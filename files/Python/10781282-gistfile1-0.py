import toopher
 
# Create an API object using your credentials
api = toopher.ToopherApi("<your consumer="" key="">", "<your consumer="" secret="">")
 
# Step 1 - Pair with their phone's Toopher app
pairing_status = api.pair("pairing phrase", "username@yourservice.com")
 
# Step 2 - Authenticate a log in
auth = api.authenticate(pairing_status.id, "my computer")
 
# Once they've responded you can then check the status
auth_status = api.get_authentication_status(auth.id)
if (auth_status.pending == false and auth_status.granted == true):
# Success!