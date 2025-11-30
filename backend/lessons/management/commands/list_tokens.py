"""
Management command to list all API tokens
Usage: python manage.py list_tokens
"""
from django.core.management.base import BaseCommand
from rest_framework.authtoken.models import Token


class Command(BaseCommand):
    help = 'List all API tokens'

    def handle(self, *args, **options):
        tokens = Token.objects.select_related('user').all()

        if not tokens.exists():
            self.stdout.write(self.style.WARNING('No tokens found.'))
            self.stdout.write('Create a token with: python manage.py create_token <username>')
            return

        self.stdout.write(self.style.SUCCESS(f'Found {tokens.count()} token(s):\n'))
        
        for token in tokens:
            self.stdout.write(f'Username: {token.user.username}')
            self.stdout.write(f'User ID: {token.user.id}')
            self.stdout.write(f'Token: {token.key}')
            self.stdout.write('-' * 50)

