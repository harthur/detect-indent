class WordList
  class << self
    def find(option = {})
      default_option = {limit: 10}.merge(option)
      option = default_option.merge(option)
      word_list_path = Rails.root.join('lib/word_list/config/')
      @word_list = []

      @file ||= YAML.load_file(word_list_path.to_s + file)

      Dir::foreach(word_list_path) do |file|
        @word_list.concat(YAML.load_file(word_list_path.to_s + file)) if File::extn
ame(file) == '.yml'
      end

      if option[:type] == 'rand'
        find_rand(option)
      elsif option[:type] == 'ahead'
        # 未実装
      elsif option[:type] == 'behind'
        # 未実装
      elsif option[:type] == 'partial'
        # 未実装
      else
        find_rand(option)
      end
    end

    def find_rand(option)
      @word_list.sample(option[:limit])
    end
  end
end