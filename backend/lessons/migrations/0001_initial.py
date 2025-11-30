# Generated manually for initial migration
from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Lesson',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.PositiveIntegerField(help_text='Lesson number (must be unique)', unique=True, validators=[django.core.validators.MinValueValidator(1)])),
                ('title', models.CharField(help_text='Lesson title in Arabic', max_length=200)),
                ('description', models.TextField(help_text='Lesson description in Arabic')),
                ('youtube_id', models.CharField(blank=True, help_text='YouTube video ID (not full URL)', max_length=50)),
                ('audio_file_id', models.CharField(blank=True, help_text='Google Drive Audio File ID', max_length=200)),
                ('pdf_file_id', models.CharField(blank=True, help_text='Google Drive PDF File ID', max_length=200)),
                ('duration', models.CharField(default='00:00', help_text='Lesson duration (format: MM:SS or HH:MM:SS)', max_length=20)),
                ('thumbnail', models.URLField(blank=True, help_text='Optional thumbnail image URL', null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True, help_text='Whether the lesson is active and visible')),
            ],
            options={
                'verbose_name': 'Lesson',
                'verbose_name_plural': 'Lessons',
                'ordering': ['number'],
            },
        ),
    ]

