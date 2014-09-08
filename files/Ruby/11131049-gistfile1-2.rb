# in migration

class AddPermalinkToPost < ActiveRecord::Migration
  def change
    add_column :posts, :permalink, :string
  end
  Post.find_each(&:save)
end


#  in model

validates :title, presence: true
before_validation :generate_slug

private

def generate_slug
  # title is the field
  self.permalink = "#{self.title.parameterize}-#{self.id}"  
end