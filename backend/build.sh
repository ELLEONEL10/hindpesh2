#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Convert static asset files
python manage.py collectstatic --no-input

# Apply database migrations
python manage.py migrate

# Create superuser (or ignore if it already exists)
# The "|| true" part prevents the build from crashing if the admin already exists
python manage.py createsuperuser --noinput || true