from rest_framework import serializers
from .models import Lesson, AudioFile, PDFFile, UserProgress, Question, Choice, LessonFAQ


class ChoiceSerializer(serializers.ModelSerializer):
    """Serializer for Choice model"""
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct', 'order']


class QuestionSerializer(serializers.ModelSerializer):
    """Serializer for Question model"""
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'order', 'choices']


class LessonFAQSerializer(serializers.ModelSerializer):
    """Serializer for LessonFAQ model"""
    class Meta:
        model = LessonFAQ
        fields = ['id', 'question', 'answer', 'order']


class AudioFileSerializer(serializers.ModelSerializer):
    """Serializer for AudioFile model"""
    class Meta:
        model = AudioFile
        fields = ['id', 'title', 'google_drive_link', 'order', 'created_at']
        read_only_fields = ['created_at']


class PDFFileSerializer(serializers.ModelSerializer):
    """Serializer for PDFFile model"""
    class Meta:
        model = PDFFile
        fields = ['id', 'title', 'google_drive_link', 'order', 'created_at']
        read_only_fields = ['created_at']


class LessonSerializer(serializers.ModelSerializer):
    """Serializer for Lesson model"""
    id = serializers.IntegerField(read_only=True)
    audio_files = AudioFileSerializer(many=True, read_only=True)
    pdf_files = PDFFileSerializer(many=True, read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    faqs = LessonFAQSerializer(many=True, read_only=True)
    
    class Meta:
        model = Lesson
        fields = [
            'id',
            'number',
            'title',
            'description',
            'youtube_id',
            'duration',
            'thumbnail',
            'created_at',
            'updated_at',
            'is_active',
            'audio_files',
            'pdf_files',
            'questions',
            'faqs',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate_number(self, value):
        """Ensure lesson number is unique (excluding current instance)"""
        if self.instance:
            if Lesson.objects.filter(number=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("A lesson with this number already exists.")
        else:
            if Lesson.objects.filter(number=value).exists():
                raise serializers.ValidationError("A lesson with this number already exists.")
        return value


class AudioFileCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating AudioFile"""
    class Meta:
        model = AudioFile
        fields = ['title', 'google_drive_link', 'order']


class PDFFileCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating PDFFile"""
    class Meta:
        model = PDFFile
        fields = ['title', 'google_drive_link', 'order']


class UserProgressSerializer(serializers.ModelSerializer):
    """Serializer for UserProgress model"""
    class Meta:
        model = UserProgress
        fields = ['id', 'lesson', 'is_completed', 'completed_at', 'last_accessed']
        read_only_fields = ['last_accessed']
