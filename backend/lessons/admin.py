from django.contrib import admin
from django.utils.html import format_html
from django.conf import settings
import qrcode
from io import BytesIO
import base64
from .models import Lesson, AudioFile, PDFFile, Question, Choice, LessonFAQ

# 1. Define Inline classes FIRST so they are available for LessonAdmin
class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 4
    fields = ('text', 'is_correct', 'order')
    ordering = ('order',)

class QuestionInline(admin.StackedInline):
    model = Question
    extra = 0
    fields = ('text', 'order')
    ordering = ('order',)
    show_change_link = True

class LessonFAQInline(admin.StackedInline):
    model = LessonFAQ
    extra = 0
    fields = ('question', 'answer', 'order')
    ordering = ('order',)

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

# 2. Define LessonAdmin, using the Inlines defined above
@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['number', 'title', 'duration', 'is_active', 'created_at', 'qr_code_preview']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'description']
    ordering = ['number']
    
    # These now refer to the classes defined at the top
    inlines = [AudioFileInline, PDFFileInline, QuestionInline, LessonFAQInline]
    
    readonly_fields = ['created_at', 'updated_at', 'qr_code_display']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('number', 'title', 'description', 'is_active')
        }),
        ('QR Code', {
            'fields': ('qr_code_display',)
        }),
        ('Media', {
            'fields': ('youtube_id', 'thumbnail')
        }),
        ('Metadata', {
            'fields': ('duration', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def generate_qr_code(self, lesson_id):
        """Helper to generate base64 QR code image"""
        # Ensure FRONTEND_URL is set in settings.py, or fallback to localhost
        base_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        url = f"{base_url}/#/lesson/{lesson_id}"
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        img_str = base64.b64encode(buffer.getvalue()).decode()
        return url, img_str

    def qr_code_display(self, obj):
        """Displays the QR code with a download button in the detail view"""
        if not obj.pk:
            return "Save the lesson first to generate QR code."
            
        url, img_str = self.generate_qr_code(obj.pk)
        
        return format_html(
            '''
            <div style="display: flex; align-items: flex-start; gap: 20px;">
                <img src="data:image/png;base64,{}" width="200" height="200" style="border: 1px solid #ddd; border-radius: 8px;" />
                <div style="padding-top: 10px;">
                    <p style="margin-bottom: 10px; color: #666;"><strong>Scans to:</strong> <a href="{}" target="_blank">{}</a></p>
                    <a href="data:image/png;base64,{}" download="lesson_{}_qr.png" class="button" style="padding: 10px 15px; background: #417690; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        Download QR Code Image
                    </a>
                </div>
            </div>
            ''',
            img_str, url, url, img_str, obj.number
        )
    qr_code_display.short_description = "QR Code Download"

    def qr_code_preview(self, obj):
        """Small preview for the list view"""
        if not obj.pk:
            return "-"
        _, img_str = self.generate_qr_code(obj.pk)
        return format_html('<img src="data:image/png;base64,{}" width="50" height="50" />', img_str)
    qr_code_preview.short_description = "QR"


# 3. Register other models
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

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['text', 'lesson', 'order']
    list_filter = ['lesson']
    search_fields = ['text', 'lesson__title']
    inlines = [ChoiceInline]