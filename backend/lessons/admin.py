from django.contrib import admin
from .models import Lesson, AudioFile, PDFFile


class AudioFileInline(admin.TabularInline):
    model = AudioFile
    extra = 1
    fields = ('title', 'google_drive_link', 'order')
    ordering = ('order',)


class PDFFileInline(admin.TabularInline):
    model = PDFFile
    extra = 1
    fields = ('title', 'google_drive_link', 'order')
    ordering = ('order',)


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['number', 'title', 'duration', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'description']
    ordering = ['number']
    inlines = [AudioFileInline, PDFFileInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('number', 'title', 'description', 'is_active')
        }),
        ('Media', {
            'fields': ('youtube_id', 'thumbnail')
        }),
        ('Metadata', {
            'fields': ('duration', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['created_at', 'updated_at']


@admin.register(AudioFile)
class AudioFileAdmin(admin.ModelAdmin):
    list_display = ['lesson', 'title', 'order', 'created_at']
    list_filter = ['lesson', 'created_at']
    search_fields = ['title', 'lesson__title']
    ordering = ['lesson', 'order']


@admin.register(PDFFile)
class PDFFileAdmin(admin.ModelAdmin):
    list_display = ['lesson', 'title', 'order', 'created_at']
    list_filter = ['lesson', 'created_at']
    search_fields = ['title', 'lesson__title']
    ordering = ['lesson', 'order']
