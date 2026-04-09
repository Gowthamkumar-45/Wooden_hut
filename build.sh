#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

python Backend_M/manage.py collectstatic --no-input
python Backend_M/manage.py migrate
