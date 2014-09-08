#!/usr/bin/env ruby                                                                                                                                                                                                          
#                                                                                                                                                                                                                            
# Usage:                                                                                                                                                                                                                     
#   security dump-keychain -d login.keychain > keychain_logins.txt                                                                                                                                                           
#   # Lots of clicking 'Always Allow', or just 'Allow', until it's done...                                                                                                                                                   
#   curl -O curl -O https://raw.github.com/gist/1224792/06fff24412311714ad6534ab700a7d603c0a56c9/keychain.rb
#   chmod a+x ./keychain.rb                                                                                                                                                                                                  
#   ./keychain.rb keychain_logins.txt | sort > logins.csv                                                                                                                                                                    
#                                                                                                                                                                                                                            
# Then import logins.csv in 1Password using the format:                                                                                                                                                                      
# Title, URL/Location, Username, Password                                                                                                                                                                                    
# Remember to check 'Fields are quoted', and the Delimiter character of 'Comma'.                                                                                                                                             
require 'date'

class KeychainEntry
  attr_accessor :fields

  def initialize(keychain)
    last_key = nil
    @fields = {}
    data = nil
    aggregate = nil
    lines = keychain.split("\n")
    lines.each do |line|
      # Everything after the 'data:' statement is data.

      if data != nil
        data << line
      elsif aggregate != nil
        if line[0] == " "
          keyvalue = line.split('=', 2).collect { |kv| kv.strip }
          aggregate[keyvalue.first] = keyvalue.last
        else
          @fields[last_key] = aggregate
          aggregate = nil
        end
      end

      if aggregate == nil
        parts = line.split(':').collect { |piece| piece.strip }
        if parts.length > 1
          @fields[parts.first] = parts.last
        else
          last_key = parts.first
          data = [] if parts.first == "data"
          aggregate = {}
        end
      end
    end
    @fields["data"] = data.join(" ") if data
  end
end

def q(string)
  "\"#{string}\""
end

def process_entry(entry_string)
  entry = KeychainEntry.new(entry_string)
 

  if entry.fields['class'] == '"inet"' && ['"form"', '"dflt"'].include?(entry.fields['attributes']['"atyp"<blob>'])
    site = entry.fields['attributes']['"srvr"<blob>'].gsub!('"', '')
    path = entry.fields['attributes']['"path"<blob>'].gsub!('"', '')
    proto= entry.fields['attributes']['"ptcl"<uint32>'].gsub!('"', '')
    proto.gsub!('htps', 'https');
    user = entry.fields['attributes']['"acct"<blob>'].gsub!('"', '')
    #user = entry.fields['attributes']['0x00000007 <blob>'].gsub!('"', '')
    date_string = entry.fields['attributes']['"mdat"<timedate>'].gsub(/0x[^ ]+[ ]+/, '').gsub!('"', '')
    date = DateTime.parse(date_string)
    pass = entry.fields['data'][1..-2]
    path = '' if path == '<NULL>'
    url = "#{proto}://#{site}#{path}"

    puts "#{site},#{url},#{user},#{pass},#{date}"
    #puts "#{user}, #{pass}, #{date}"
  end
end

accum = ''
ARGF.each_line do |line|
  if line =~ /^keychain: /
    unless accum.empty?
      process_entry(accum)
      accum = ''
    end
  end
  accum += line
end
