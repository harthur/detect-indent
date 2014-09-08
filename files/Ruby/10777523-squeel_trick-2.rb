def self.go(keys=%w[facebook-555555 linkedin-555555])
  parser = CompositeKeyParser.new(keys)
  first_item = parser.collection.shift
  a = Squeel::Nodes::Predicate.new('social_network_type', :eq, first_item.type)
  b = Squeel::Nodes::Predicate.new('social_network_id', :eq, first_item.id)
  a &= b
  where {
    parser.collection.each { |item|
      a |= (social_network_type == item.type) & (social_network_id == item.id)
    }
    a
  }
end