namespace :deploy do
  namespace :assets do
    Rake::Task['deploy:assets:precompile'].clear_actions

    desc "Precompile assets on local machine and upload them to the server."
    task :precompile do
      run_locally do
        execute 'RAILS_ENV=production bundle exec rake assets:precompile'
      end

      on roles(:web) do
        execute "mkdir -p #{release_path}/public/#{fetch(:assets_prefix)}"
        upload! "./public/#{fetch(:assets_prefix)}", "#{release_path}/public/#{fetch(:assets_prefix)}", recursive: true
      end

      run_locally do
        execute "rm -r ./public/#{fetch(:assets_prefix)}"
      end
    end
  end
end
