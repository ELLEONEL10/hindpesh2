from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .models import Lesson, AudioFile, PDFFile, UserProgress
from .serializers import (
    LessonSerializer, 
    AudioFileSerializer, 
    PDFFileSerializer,
    AudioFileCreateSerializer,
    PDFFileCreateSerializer,
    UserProgressSerializer
)


class LessonViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing lessons.
    - GET /api/lessons/ - List all active lessons (public)
    - GET /api/lessons/{id}/ - Get lesson details (public)
    - POST /api/lessons/ - Create lesson (authenticated only)
    - PUT/PATCH /api/lessons/{id}/ - Update lesson (authenticated only)
    - DELETE /api/lessons/{id}/ - Delete lesson (authenticated only)
    """
    queryset = Lesson.objects.filter(is_active=True)
    serializer_class = LessonSerializer

    def get_permissions(self):
        """
        Allow read-only access to everyone, but require authentication for write operations.
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        For authenticated users, show all lessons (including inactive).
        For anonymous users, show only active lessons.
        """
        if self.request.user.is_authenticated:
            return Lesson.objects.all()
        return Lesson.objects.filter(is_active=True)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_audio(self, request, pk=None):
        """Add an audio file to a lesson"""
        lesson = self.get_object()
        serializer = AudioFileCreateSerializer(data={**request.data, 'lesson': lesson.id})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_pdf(self, request, pk=None):
        """Add a PDF file to a lesson"""
        lesson = self.get_object()
        serializer = PDFFileCreateSerializer(data={**request.data, 'lesson': lesson.id})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """
        Custom login endpoint that returns a token.
        POST /api/lessons/login/
        Body: {"username": "admin", "password": "your_password"}
        """
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'اسم المستخدم وكلمة المرور مطلوبان'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.id,
                'username': user.username
            })
        else:
            return Response(
                {'error': 'اسم المستخدم أو كلمة المرور غير صحيحة'},
                status=status.HTTP_401_UNAUTHORIZED
            )

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Get current authenticated user info.
        GET /api/lessons/me/
        """
        return Response({
            'user_id': request.user.id,
            'username': request.user.username,
            'is_staff': request.user.is_staff
        })


class AudioFileViewSet(viewsets.ModelViewSet):
    """ViewSet for managing audio files"""
    queryset = AudioFile.objects.all()
    serializer_class = AudioFileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        lesson_id = self.request.query_params.get('lesson', None)
        if lesson_id:
            return AudioFile.objects.filter(lesson_id=lesson_id)
        return AudioFile.objects.all()


class PDFFileViewSet(viewsets.ModelViewSet):
    """ViewSet for managing PDF files"""
    queryset = PDFFile.objects.all()
    serializer_class = PDFFileSerializer
    permission_classes = [IsAuthenticated]


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Verify token
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request())
            
            # Get user info
            email = idinfo['email']
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            
            # Get or create user
            user, created = User.objects.get_or_create(username=email, defaults={
                'email': email,
                'first_name': first_name,
                'last_name': last_name
            })
            
            # Generate JWT
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            })
            
        except ValueError as e:
            return Response({'error': f'Invalid token: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


class UserProgressViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProgressSerializer
    
    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user)
        
    def create(self, request, *args, **kwargs):
        lesson_id = request.data.get('lesson')
        is_completed = request.data.get('is_completed', True)
        
        if not lesson_id:
             return Response({'error': 'Lesson ID required'}, status=status.HTTP_400_BAD_REQUEST)

        progress, created = UserProgress.objects.update_or_create(
            user=request.user,
            lesson_id=lesson_id,
            defaults={'is_completed': is_completed}
        )
        
        serializer = self.get_serializer(progress)
        return Response(serializer.data)

    def get_queryset(self):
        lesson_id = self.request.query_params.get('lesson', None)
        if lesson_id:
            return PDFFile.objects.filter(lesson_id=lesson_id)
        return PDFFile.objects.all()
