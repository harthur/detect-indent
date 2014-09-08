lock '3.1.0'

set :git_strategy, Capistrano::Scm::Strategy::Git::Shallow

set :linked_dirs, %w{log}

set :keep_releases, 0


namespace :deploy do
  
  desc 'Run puppet'
  task :run_puppet do
    on roles(:all), in: :parallel do
      execute %Q{puppet apply --modulepath #{release_path.join('modules')} #{release_path.join('**/*.pp')} | tee -a #{shared_path.join('log/puppet.log')}}
    end
  end
  
  desc 'Delete repo'
  task :delete_repo do
    on roles(:all), in: :parallel do
      execute :rm, '-rf', repo_path
    end
  end
  
  after :publishing, :run_puppet
  after :cleanup,    :delete_repo
  
end
