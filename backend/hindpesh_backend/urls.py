"""
URL configuration for hindpesh_backend project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('_nested_admin/', include('nested_admin.urls')),
    path('api/', include('lessons.urls')),
    path('api/auth/', include('rest_framework.urls')),
]

