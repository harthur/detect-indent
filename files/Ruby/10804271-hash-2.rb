class Hash
  def has_shitty_key?(key)
    !!keys.find {|k| key.downcase == k.downcase}
  end
end