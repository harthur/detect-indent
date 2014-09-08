class Post
  attr_accessor :title, :body, :author

  @@posts = []

  def initialize(title, body, author)
    @title = title
    @body = body
    @author = author
    @@posts << self
  end

  def self.all
    @@posts
  end

  def to_s
    "Title: #{@title}\nBody: #{@body}"
  end
end