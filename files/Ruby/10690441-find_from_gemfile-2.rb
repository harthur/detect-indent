term = ARGV[0]

puts "Searching all gems in Gemfile for #{term}..."

gemfile = File.read('Gemfile')
gems = gemfile.split("\n").map do |line|
  next unless line.match(/gem '/)
  line.split('gem').last.split(',').first.gsub("'","").split.first.strip
end.compact

gems_with_target_term = gems.map do |gem|
  path = `bundle show #{gem}`.strip
  puts "Searching gem #{gem}"
  if `ag #{term} #{path}`.length > 0
    puts "FOUND: Gem #{gem} contains references to #{term}"
    gem
  end
end.compact

puts "Gems containing references to #{term}:"
p gems_with_target_term