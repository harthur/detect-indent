def create_title_url( title_string )
      title_no_special_characters = title_string.gsub( /[^A-Za-z0-9\s]/, '')
      title_no_special_characters.strip!
      title_hyphens_between_words = title_no_special_characters.gsub(/\s/, '-')
      title_downcase = title_hyphens_between_words.downcase
      title_downcase
end