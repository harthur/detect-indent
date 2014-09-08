#
# This Guardfile exemplified how to manage One Shared Task 
# across one or multiple Groups. The advantage of this code is 
# that the Shared Task will not be loaded more that one time
# and it will belongs to the default group (as default) or
# any other group you have declared.
#
# Owner:    Salim Afiune @afiune <salim@afiunemaya.com.mx>
# Created:  04/15/2014
#

unit = Proc.new do |group,plugin|
  def load_plugin(plugin)
    guard plugin, :cli => "--color" do
      # You can set your own watchers here 
      watch(%r{^spec/.+_spec\.rb$})
      watch(%r{^lib/(.+)\.rb$})     { |m| "spec/lib/#{m[1]}_spec.rb" }
      watch('spec/spec_helper.rb')  { "spec" }
      watch(%r{^recipes/(.+)\.rb$}) { |m| "spec/unit/recipes/#{m[1]}_spec.rb" }
      watch(%r{^attributes/(.+)\.rb$})
      watch(%r{^files/(.+)})
      watch(%r{^templates/(.+)})
      watch(%r{^providers/(.+)\.rb}) { |m| "spec/unit/providers/#{m[1]}_spec.rb" }
      watch(%r{^resources/(.+)\.rb}) { |m| "spec/unit/resources/#{m[1]}_spec.rb" }
    end
  end

  def plugin_exist(plugin)
    # Method ::Guard.guards is depricated on version >= 2.0.0
    # Use ::Guard.plugins instead
    if ::Gem::Version.create(::Guard::VERSION) >= ::Gem::Version.create('2.0.0')
      if ::Guard.plugins(plugin).length == 0
        load_plugin(plugin)
      end
    else
      if ::Guard.guards(plugin).nil?
        load_plugin(plugin)
      end
    end
  end

  unless ::Guard.options[:group].empty?
    if group.to_s == ::Guard.options[:group][0]
      plugin_exist(plugin)
    end
  else
    plugin_exist(plugin)
  end
end

# The :rspec Shared Task will belongs to the `default` group 
unit.call(:default,:rspec)

# Add as many `unit.call(group,plugin)` as groups you have ...