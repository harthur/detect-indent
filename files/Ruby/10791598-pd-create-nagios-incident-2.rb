require 'json'
 
subdomain="change_this"
api_key="change_this"
 
endpoint="https://events.pagerduty.com/generic/2010-04-15/create_event.json"
service_id="change_this"
service_access_key="change_this"
incident_key="change_this"
subject="change_this"
client="change_this"
client_url="change_this"
details_hash={"ping time" => "1200ms", "load average" => "200ms"} 
details="A line of details for an alternate submission."
 
def curl_command_post_incident(token_string,incident_json,endpoint)
    curl_command='curl -k -H "Content-type: application/json" --data '+incident_json+' '+endpoint+''
end
 
def hash_to_json(hash)
  string=""
  hash.each do |key,value|
    string+='"'+key+'": "'+value+'", '
  end
  string
end
    
inc_quote = '"web_trigger_message%5Bservice_id%5D=PEM6ZY8&web_trigger_message%5Bdescription%5D=Iospiron+Server&web_trigger_message%5Bdetails%5D=Rell+2013+Apache+Server."'

inc_json= '\'{ 
              "web_trigger_message[service_id]": "'+service_id+'", 
              "web_trigger_message[description]": "'+subject+'", 
              "web_trigger_message[details]": "'+details+'" }\'' 
               
curl_string = curl_command_post_incident(api_key,inc_json,endpoint)
puts curl_string
 
system(curl_string)