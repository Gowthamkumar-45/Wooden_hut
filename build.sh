#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r backend/requirements.txt

python backend/manage.py collectstatic --no-input --clear
python backend/manage.py migrate

# Auto-create superuser for Free Tier
python backend/manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='Gowtham').exists() or User.objects.create_superuser('Gowtham', 'Gowtham@gmail.com', 'Gowtham123')"
