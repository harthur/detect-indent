require 'json'

class SmartphoneSpy
  def do_spying
    recorded_activities = {bus_trip: 5.5, ate_meal: "chicken"}
    message_to_send = recorded_activities.to_json
    send_via_internet_to_HQ(message_to_send)
  end

  def send_via_internet_to_HQ(message_to_send)
    #TODO: this should actually use the internet!
    log "Sending this string via internet, to HQ: #{message_to_send}"
    NSAServer.process_message(message_to_send)
  end

  def log(message)
    puts "Client_log: #{message}\n\n"
  end
end


class NSAServer
  def self.process_message(incoming_message)
    self.log("RECEIVED INCOMING MESSAGE!")
    parsed = JSON.parse(incoming_message)
    activities = RecordedActivity.make_from_message(parsed)
    self.log("I just built #{activities.count} activities")
    self.log("lets save them to our Database")
    activities.each do |activity|
      activity.save_to_database
    end
  end

  def self.log(message)
    print "Server_log:  #{message}\n\n"
  end

  class RecordedActivity
    def self.make_from_message(parsed_message)
      parsed_message.map do |(type, data)|
        case type
        when "bus_trip"
          BusTrip.new(data)
        when "ate_meal"
          Meal.new(data)
        else
          raise "silly goose, we dont let you use #{type}"
        end
      end
    end

    def save_to_database
      #TODO: actually use a database
      NSAServer.log("Saving record: #{summarize}")
    end
  end

  class Meal < RecordedActivity
    attr_accessor :recipe
    def initialize(recipe)
      self.recipe = recipe
    end

    def summarize
      "Meal with recipe: #{recipe}"
    end
  end

  class BusTrip < RecordedActivity
    attr_accessor :distance
    def initialize(distance)
      self.distance = distance
    end

    def summarize
      "Trip with distance: #{distance}"
    end
  end
end


SmartphoneSpy.new().do_spying()
