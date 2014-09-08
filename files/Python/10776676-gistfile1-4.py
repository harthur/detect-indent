from functools import wraps
from django.db import transaction


def autocommit_off(func):
    """
    Decorator to turn autocommit off inside a function, function should commit or rollback before returning.
    :param func: Function to be decorated
    :return: decorated function
    """
    @wraps(func)
    def inner(*args, **kwargs):
        transaction.set_autocommit(False)
        try:
            return func(*args, **kwargs)
        finally:
            transaction.set_autocommit(True)
    return inner