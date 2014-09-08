# Create a method 'search_methods' for the Object Class
class Object
  def search_methods(param)
    methods = []
    self.methods.each { |m| methods << m if m.to_s.include? param }
    return methods
  end
end

# Now search methods for any Ruby Object
Array.search_methods 'enum'          # => [:to_enum, :enum_for]
Player.last.search_methods 'trust'   # => [:untrust, :untrusted?, :trust]
