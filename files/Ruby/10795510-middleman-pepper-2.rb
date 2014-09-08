ENV = YAML::load(File.open('env.yml'))

require 'builder'

require "rack/middleman/optional_html"
  use Rack::OptionalHtml,
    :root => "/example/source",
    :urls => %w[/]

ignore '/private/*'

set :css_dir,       'stylesheets'
set :js_dir,        'javascripts'
set :images_dir,    'images'
set :build_dir,     'build'
set :fonts_dir,     'fonts'

Time.zone = "UTC"

set :markdown_engine, :kramdown
set :markdown, :layout_engine => :erb,
               :tables => true,
               :autolink => true,
               :smartypants => true

activate :blog do |blog|
  blog.name = "blog"
  blog.prefix = "posts"
  blog.permalink = "{title}"
  blog.sources = "{title}"
  blog.summary_length = 250
  blog.default_extension = ".markdown"
  blog.paginate = true
  blog.per_page = 10
  blog.page_link = "page/{num}"
  blog.layout = "/layouts/layout"
end

page "/sitemap.xml", :layout => false # sitemap
page "/rss.xml", :layout => false # rss feed

activate :automatic_image_sizes

configure :development do
  activate :livereload
end

configure :build do
  # activate :relative_assets
  activate :asset_host
    set :asset_host do |asset|
      "http://cdn%d.example.com" % (asset.hash % 4)
    end
  activate :asset_hash
  activate :minify_css
  activate :minify_javascript
  activate :minify_html
  # activate :imageoptim
  activate :gzip
  sass_options = { :debug_info => false }
  # activate :favicon_maker do |f|
  #   f.template_dir  = File.join(root, 'source', 'images')
  #   f.output_dir    = File.join(root, 'build')
  #   f.icons = {
  #             "logo.png" => [
  #                                       { icon: "apple-touch-icon-152x152-precomposed.png" },
  #                                       { icon: "apple-touch-icon-144x144-precomposed.png" },
  #                                       { icon: "apple-touch-icon-120x120-precomposed.png" },
  #                                       { icon: "apple-touch-icon-114x114-precomposed.png" },
  #                                       { icon: "apple-touch-icon-76x76-precomposed.png" },
  #                                       { icon: "apple-touch-icon-72x72-precomposed.png" },
  #                                       { icon: "apple-touch-icon-60x60-precomposed.png" },
  #                                       { icon: "apple-touch-icon-57x57-precomposed.png" },
  #                                       { icon: "apple-touch-icon-precomposed.png", size: "57x57" },
  #                                       { icon: "apple-touch-icon.png", size: "57x57" },
  #                                       { icon: "favicon-196x196.png" },
  #                                       { icon: "favicon-160x160.png" },
  #                                       { icon: "favicon-96x96.png" },
  #                                       { icon: "favicon-32x32.png" },
  #                                       { icon: "favicon-16x16.png" },
  #                                       { icon: "favicon.png", size: "16x16" },
  #                                       { icon: "favicon.ico", size: "64x64,32x32,24x24,16x16" },
  #                                       { icon: "mstile-144x144", format: "png" },
  #                                       ]
  #             }
  # end
end

# caching_policy 'text/html', cache_control: {max_age: 7200, must_revalidate: true}, content_encoding: 'gzip'
# caching_policy 'image/png', cache_control: {max_age: 31536000, public: true}, content_encoding: 'gzip'
# caching_policy 'image/jpeg', cache_control: {max_age: 31536000, public: true}, content_encoding: 'gzip'
# caching_policy 'text/css', cache_control: {max_age: 31536000, public: true}, content_encoding: 'gzip'
# caching_policy 'application/javascript', cache_control: {max_age: 31536000, public: true}, content_encoding: 'gzip'

activate :s3_sync do |s3_sync|
  s3_sync.bucket                     = ENV['FOG_DIRECTORY']
  s3_sync.region                     = ENV['REGION']
  s3_sync.aws_access_key_id          = ENV['AWS_ACCESS']
  s3_sync.aws_secret_access_key      = ENV['AWS_SECRET']
  s3_sync.delete                     = true
  s3_sync.after_build                = false
  s3_sync.prefer_gzip                = true
end

activate :deploy do |deploy|
  deploy.method            = :rsync
  deploy.host              = ENV['HOST']
  deploy.path              = ENV['PATH']
  deploy.clean             = "true"
end
