from django.contrib import admin
from .models import Lesson


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['number', 'title', 'duration', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'description']
    ordering = ['number']
    fieldsets = (
        ('Basic Information', {
            'fields': ('number', 'title', 'description', 'is_active')
        }),
        ('Media Files', {
            'fields': ('youtube_id', 'audio_file_id', 'pdf_file_id', 'thumbnail')
        }),
        ('Metadata', {
            'fields': ('duration', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['created_at', 'updated_at']

