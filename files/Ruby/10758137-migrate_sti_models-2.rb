# Migrate from this:
 
class ListItem < ActiveRecord::Base
  belongs_to :group
  acts_as_list scope: :group
  # has id and type columns
end
 
class Audio < ListItem
end
 
class Video < ListItem
end
 
# to this, where parts are temporary measures to support the new models on top of the legacy DB:
 
class ListItem < ActiveRecord::Base
  belongs_to :content, polymorphic: true, foreign_key: :id, foreign_type: :type
  belongs_to :group
  acts_as_list scope: :group
  
  def self.inheritance_column
    :no_such_column_because_type_no_longer_references_subclasses_of_ListItem
  end
end
 
class Audio < ActiveRecord::Base
  self.table_name = :list_items
  has_many :list_items, as: :content, foreign_key: :id, foreign_type: :type
end
 
class Video < ActiveRecord::Base
  self.table_name = :list_items
  has_many :list_items, as: :content, foreign_key: :id, foreign_type: :type
end