# BAD
from flask import request as global_request

def do_a_thing_globally():
    print(global_request.session["username"])


def view():
    do_a_thing_globally()
    
# GOOD
def do_a_thing(username):
    print(username)
  
def view(local_request):
    do_a_thing(local_request.session["username"])