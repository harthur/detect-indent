require 'date'
require 'CSV'
require 'influxdb'

influxdb = InfluxDB::Client.new "twitter"
influxdb.delete_database("twitter")
influxdb.create_database("twitter")

CSV.foreach("data/tweets.csv", {headers: true}) do |row|
  data = {
  	time: Date.strptime(row[3]).to_time.to_i,
	  value: 1
  }

  influxdb.write_point("tweet", data)
end

# select sum(value) from tweet group by time(1d)
