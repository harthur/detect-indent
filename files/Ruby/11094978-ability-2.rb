class Foo; end
BAR = :bar

class Ability
  def initialize user
    if user
      can :read, Foo, :way => false
      can :read, BAR, :way => true
    end
  end
  
  def as_json = {}
    rules.map do |rule|
      {
        :can => rule.base_behavior,
        :actions => rule.actions.as_json,
        :subjects => rule.subjects.map { |s| s.to_s.underscore },
        :conditions => rule.conditions.as_json
      }
    end
  end
end