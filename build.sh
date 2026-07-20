#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r backend/requirements.txt

python backend/manage.py collectstatic --no-input --clear
python backend/manage.py migrate

# Auto-create superuser for Free Tier using environment variables
python backend/manage.py shell -c "import os; from django.contrib.auth import get_user_model; User = get_user_model(); u=os.environ.get('SUPERUSER_USERNAME'); e=os.environ.get('SUPERUSER_EMAIL', ''); p=os.environ.get('SUPERUSER_PASSWORD'); u and p and (User.objects.filter(username=u).exists() or User.objects.create_superuser(u, e, p))"

