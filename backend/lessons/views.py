from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Lesson
from .serializers import LessonSerializer


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

