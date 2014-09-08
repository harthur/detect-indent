task :kill_postgres_connections => :environment do
  db_name = "ads"
  sh = <<EOF
ps xa \
  | grep postgres: \
  | grep #{db_name} \
  | grep -v grep \
  | awk '{print $1}' \
  | xargs kill
EOF
  puts `#{sh}`
end

task :pg_backup => :environment do
  #stamp the filename
  datestamp = Time.now.strftime("%Y-%m-%d_%H-%M-%S")
  host = '173.193.69.42'
  user = 'root'
  password = 'ssh_password'
  local_folder = '/home/backups/my_app'
  remote_app_folder = '/home/rails/app'
  remote_backup_folder = "#{remote_app_folder}/public/backups"
  #drop it in the db/backups directory temporarily
  backup_file = "#{remote_backup_folder}/appname_#{datestamp}_dump.sql.gz"

  sh "mkdir -p #{local_folder}"
  Net::SSH.start(host, user, :password => password) do |ssh|
    ssh.exec!("mkdir -p #{remote_backup_folder}")
    exec_cmd =  "pg_dump -h localhost -U user database | gzip -c > #{backup_file}"
    #ssh.exec!("cd #{remote_backup_folder}")
    ssh.exec!(exec_cmd)
    ssh.scp.download!(backup_file, local_folder)
  end

end