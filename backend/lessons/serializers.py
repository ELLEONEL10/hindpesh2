from rest_framework import serializers
from .models import Lesson


class LessonSerializer(serializers.ModelSerializer):
    """Serializer for Lesson model"""
    id = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Lesson
        fields = [
            'id',
            'number',
            'title',
            'description',
            'youtube_id',
            'audio_file_id',
            'pdf_file_id',
            'duration',
            'thumbnail',
            'created_at',
            'updated_at',
            'is_active',
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

