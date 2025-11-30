"""
Management command to create or verify API tokens for users
Usage: python manage.py create_token <username>
       python manage.py create_token <username> --token <token_string>
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


class Command(BaseCommand):
    help = 'Create or verify API token for a user'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username to create token for')
        parser.add_argument(
            '--token',
            type=str,
            help='Specific token to assign (optional)',
            default=None
        )

    def handle(self, *args, **options):
        username = options['username']
        token_string = options['token']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'User "{username}" does not exist.')
            )
            self.stdout.write('Available users:')
            for u in User.objects.all():
                self.stdout.write(f'  - {u.username}')
            return

        # Get or create token
        if token_string:
            # Use specific token
            token, created = Token.objects.get_or_create(
                user=user,
                defaults={'key': token_string}
            )
            if not created and token.key != token_string:
                # Update existing token
                token.key = token_string
                token.save()
                self.stdout.write(
                    self.style.WARNING(f'Updated token for user "{username}"')
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(f'Token set for user "{username}"')
                )
        else:
            # Create new token
            token, created = Token.objects.get_or_create(user=user)
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created new token for user "{username}"')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Token already exists for user "{username}"')
                )

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('Token Information:'))
        self.stdout.write(f'  Username: {user.username}')
        self.stdout.write(f'  User ID: {user.id}')
        self.stdout.write(f'  Token: {token.key}')
        self.stdout.write('')
        self.stdout.write('Use this token in your frontend:')
        self.stdout.write(
            self.style.SUCCESS(f'localStorage.setItem("authToken", "{token.key}");')
        )

