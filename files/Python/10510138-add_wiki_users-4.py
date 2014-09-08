from subprocess import Popen, PIPE

users = [
    # agregar acá la lista de usuarios
]

print "Comenzando..."
for user in users:
    print "Creando usuario {0}...".format(user)
    proc = Popen(["php", "/var/lib/mediawiki/maintenance/createAndPromote.php",
                  user, "SO2014"], stderr=PIPE, stdout=PIPE)
    proc.wait()
print "Fin."
