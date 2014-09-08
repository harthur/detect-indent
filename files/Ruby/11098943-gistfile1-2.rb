unless File.exist?('Gemfile')
  File.write('Gemfile', <<-GEMFILE)
    source 'https://rubygems.org'
    gem 'rails', github: 'rails/rails'
    gem 'sqlite3'
  GEMFILE

  system 'bundle'
end

require 'bundler'
Bundler.setup(:default)

require 'active_record'
require 'minitest/autorun'
require 'logger'

Minitest::Test = MiniTest::Unit::TestCase unless defined?(Minitest::Test)
ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :tracker_publishers do |t|
  end

  create_table :tracker_books do |t|
    t.integer :publisher_id
  end
end

class Publisher < ActiveRecord::Base
  self.table_name = 'tracker_publishers'
  has_many :books
end

class Book < ActiveRecord::Base
  self.table_name = 'tracker_books'
  belongs_to :publisher
end

class BugTest < Minitest::Test
  def setup
    @old_publisher = Publisher.create!
    @publisher = Publisher.create!
    
    @linked_book = Book.create!
    @unlinked_book = Book.create
    
    @publisher.books << @linked_book
    @old_publisher.books << @unlinked_book
    
    @old_publisher.destroy
  end
  
  def teardown
    Publisher.destroy_all
    Book.destroy_all
  end
  
  def test_where_on_association
    # The association works on a top-level where call
    assert_equal @linked_book, Book.where(:publisher => @publisher).first
  end
  
  def test_where_on_join_with_explicit_table_name
    # Finding unlinked books works when the real table name is specified (should still work for backwards compatibility)
    assert_equal @unlinked_book, Book.eager_load(:publisher).where(:tracker_publishers => {:id => nil}).first
  end
  
  def test_where_on_join_without_explicit_table_name
    # But does not work using the relation column name on Book!
    assert_equal @unlinked_book, Book.eager_load(:publisher).where(:publisher => {:id => nil}).first
  end
end