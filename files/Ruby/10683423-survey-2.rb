class Survey < ActiveRecord::Base
  resourcify

  attr_accessor :particular_schools, :particular_users, :post_test, :post_test_date

  has_many :questions, dependent: :destroy # THIS WILL DESTROY ALL STUDENTS DATA IF SURVEY IS DELETED.
  has_many :result_sets, dependent: :destroy # THIS WILL DESTROY ALL STUDENTS DATA IF SURVEY IS DELETED.

  accepts_nested_attributes_for :questions, :result_sets, allow_destroy: true

  validates_presence_of :questions, message: "- You must add at least one question"

end
