import os

"""
Two things are wrong with Django's default `SECRET_KEY` system:

1. It is not random but pseudo-random
2. It saves and displays the SECRET_KEY in `settings.py`

This snippet gets an environment variable `DJANGO_SECRET_KEY`

The result is a random and safely hidden `SECRET_KEY`.
"""
try:
    SECRET_KEY
except NameError:
    SECRET_FILE = os.path.join(PROJECT_DIR, 'secret.txt')
    try:
        SECRET_KEY = open(SECRET_FILE).read().strip()
    except IOError:
        SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')