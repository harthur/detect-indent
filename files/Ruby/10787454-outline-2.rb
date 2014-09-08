require 'optparse'

user_input = {}
OptionParser.new do |opts|
  opts.banner = "RFE #{RFE::VERSION}"
  opts.separator ""
  opts.separator "Available Options:"
  opts.on("-h", "--help", "help") do |some_option|
    puts opts
  end
  opts.on("-s", "--search KEYWORD" "search") do |keyword|
    user_input[:search] = keyword
  end
  opts.on("-c", "--channel-search CHANNEL" "search channel" do |channel|
    user_input[:channel_search] = channel
  end
  opts.on("-R", "--ripper RIPPER", "use ripper") do |ripper|
    user_input[:ripper] = ripper
  end
  opts.on("-C", "--convert CONVERTER", "use converter") do |converter|
    user_input[:converter] = converter
  end
end.parse!

class RFE

  VERSION = '0.0.1'
  
end