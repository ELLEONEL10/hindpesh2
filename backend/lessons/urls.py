from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, AudioFileViewSet, PDFFileViewSet, UserProgressViewSet, GoogleLoginView

router = DefaultRouter()
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'audio-files', AudioFileViewSet, basename='audiofile')
router.register(r'pdf-files', PDFFileViewSet, basename='pdffile')
router.register(r'progress', UserProgressViewSet, basename='userprogress')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
]

