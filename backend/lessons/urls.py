from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, AudioFileViewSet, PDFFileViewSet

router = DefaultRouter()
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'audio-files', AudioFileViewSet, basename='audiofile')
router.register(r'pdf-files', PDFFileViewSet, basename='pdffile')

urlpatterns = [
    path('', include(router.urls)),
]

