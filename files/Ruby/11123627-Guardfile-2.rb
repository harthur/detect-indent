require "guard/guard"

module ::Guard
  class Haskell < Guard
    def initialize(watchers=[], options=[]) @options = options; super(watchers, options) end
    def run_on_change(dir) 
        Dir["#{dir[0]}*_test.hs"].each do |p| 
            run([dir[0], p.sub(dir[0], "")]) 
        end
    end
    def run_on_additions(dir) run_on_change(dir) end
    def start() end
    def run(args)
      cmd = "echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\ncd #{args[0]}\nrunghc"
      cmd << " #{@options[:cli]}" if @options[:cli]
      cmd << " #{args[1]}"
      puts cmd; 
      system cmd
    end
  end
end

guard "haskell" do
  watch(%r{^([^\/]+)\/([^\.]+).hs$}) {|m| ["#{m[1]}/"]}
end