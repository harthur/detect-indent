# instead of debugger, you could use byebug gem
# and then you do not need to require debugger
group :development, :test do
  gem 'minitest'
  gem 'awesome_print'
  gem 'capybara'
  gem 'database_cleaner', '~> 1.0'
  gem 'debugger'
  gem 'factory_girl_rails'
  gem 'hirb'
  gem 'mailcatcher'
  gem 'minitest-reporters'
end