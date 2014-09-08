#1. The first Test
#The command is,
#rails g migration AddPermalinkToPosts permalink:string:uniq
#In the migration file that just generated, I will add some code, then the migration file should be,
class AddPermalinkToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :permalink, :string
    add_index :posts, :permalink, unique: true

    Post.select("id,title").each do |post|
      Post.find(post.id).update_attribute :permalink, "#{post.id}-#{post.title.split(' ').join('-')}"
    end
  end
end


#2. The second Test
def first_method number
  # change the number to a arrary, and reverse the elements' order
  arr = number.to_s.split("").reverse
  # change value of the elements that have a even index
  0.upto(arr.length - 1).each do |i|
    if i % 2 == 0
      two_digit_array = (arr[i].to_i * 2).to_s.split("")
      arr[i] = two_digit_array[0].to_i + two_digit_array[1].to_i
    end
  end
  # sum of the elements, modal with 10, and compare the result with 0
  arr.inject(0) {|sum, x| sum + x.to_i } % 10 == 0
end

puts first_method(7992739871)

# this method is very like the first one
def second_method number
  arr = number.to_s.split("").reverse
  0.upto(arr.length - 1).each do |i|
    if i % 2 == 0
      two_digit_array = (arr[i].to_i * 2).to_s.split("")
      arr[i] = two_digit_array[0].to_i + two_digit_array[1].to_i
    end
  end
  num = arr.inject(0) {|sum, x| sum + x.to_i } % 10
  number.to_s + num.to_s
end

puts second_method(7992739871)


#3. The Third Test
#First, add a unique constraint for service_id and line_item_id
class AddUQServiceLineItemToPosts < ActiveRecord::Migration
  def up
    ActiveRecord::Base.connection.execute("ALTER TABLE payments ADD CONSTRAINT uq_service_line_item UNIQUE (service_id, line_item_id)")
  end

  def down
    ActiveRecord::Base.connection.execute("ALTER TABLE payments DROP index uq_service_line_item")
  end
end

#Then, add a with method for Payment, the most important thing here is adding a lock
class Payment < ActiveRecord::Base
  belongs_to :service

  def self.with hash
    Payment.transaction do
      payment = Payment.where(hash).first_or_create
      payment.lock!
      yield(payment)
    end
  end
end