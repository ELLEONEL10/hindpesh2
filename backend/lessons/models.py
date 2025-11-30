from django.db import models
from django.core.validators import MinValueValidator


class Lesson(models.Model):
    """Model for storing lesson information"""
    number = models.PositiveIntegerField(
        unique=True,
        validators=[MinValueValidator(1)],
        help_text="Lesson number (must be unique)"
    )
    title = models.CharField(max_length=200, help_text="Lesson title in Arabic")
    description = models.TextField(help_text="Lesson description in Arabic")
    youtube_id = models.CharField(
        max_length=50,
        blank=True,
        help_text="YouTube video ID (not full URL)"
    )
    audio_file_id = models.CharField(
        max_length=200,
        blank=True,
        help_text="Google Drive Audio File ID"
    )
    pdf_file_id = models.CharField(
        max_length=200,
        blank=True,
        help_text="Google Drive PDF File ID"
    )
    duration = models.CharField(
        max_length=20,
        default="00:00",
        help_text="Lesson duration (format: MM:SS or HH:MM:SS)"
    )
    thumbnail = models.URLField(
        blank=True,
        null=True,
        help_text="Optional thumbnail image URL"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(
        default=True,
        help_text="Whether the lesson is active and visible"
    )

    class Meta:
        ordering = ['number']
        verbose_name = "Lesson"
        verbose_name_plural = "Lessons"

    def __str__(self):
        return f"Lesson {self.number}: {self.title}"

