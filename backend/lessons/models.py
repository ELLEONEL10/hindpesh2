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


class AudioFile(models.Model):
    """Model for storing audio file links (Google Drive)"""
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='audio_files',
        help_text="The lesson this audio file belongs to"
    )
    title = models.CharField(
        max_length=200,
        blank=True,
        help_text="Optional title for the audio file"
    )
    google_drive_link = models.URLField(
        help_text="Full Google Drive shareable link to the audio file"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Order of display (lower numbers appear first)"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['lesson', 'order', 'created_at']
        verbose_name = "Audio File"
        verbose_name_plural = "Audio Files"

    def __str__(self):
        return f"Audio: {self.lesson.title} - {self.title or 'Untitled'}"


class PDFFile(models.Model):
    """Model for storing PDF file links (Google Drive)"""
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='pdf_files',
        help_text="The lesson this PDF file belongs to"
    )
    title = models.CharField(
        max_length=200,
        help_text="Title/name of the PDF file"
    )
    google_drive_link = models.URLField(
        help_text="Full Google Drive shareable link to the PDF file"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Order of display (lower numbers appear first)"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['lesson', 'order', 'created_at']
        verbose_name = "PDF File"
        verbose_name_plural = "PDF Files"

    def __str__(self):
        return f"PDF: {self.lesson.title} - {self.title}"


class UserProgress(models.Model):
    """Model for tracking user progress on lessons"""
    user = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='progress'
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='user_progress'
    )
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    last_accessed = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'lesson')
        verbose_name = "User Progress"
        verbose_name_plural = "User Progress"

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"
