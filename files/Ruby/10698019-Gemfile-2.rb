gem 'kaminari' # Pagenation
gem 'slim-rails'
gem 'simple_form'
gem 'twitter-bootstrap-rails', branch: :bootstrap3
gem 'devise'

group :development, :test do
  gem 'spring' # コマンド高速化
  # テスト用途
  gem 'factory_girl_rails'
  gem 'rspec-rails', '~> 3.0.0.beta'
  # rails c 時の表示関連
  gem 'pry-rails'
  gem 'pry-coolline'
  gem 'pry-byebug'
  gem 'awesome_print'
  # rails c でのSQL表示整形
  gem 'hirb'
  gem 'hirb-unicode'
end