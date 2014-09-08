require 'open-uri'
require 'bundler'
Bundler.require

class Nico
  def client
    Pocket.client(
      consumer_key: ENV['CONSUMER_KEY'],
      access_token: ENV['ACCESS_TOKEN'],
    )
  end

  def retrieve
    client.retrieve(detailType: :simple)
  end

  def convert
    retrieve['list'].each do |id,item|
      url = item['given_url']
      if url.include?('http://cobachica.hateblo.jp') || url.include?('http://blog.livedoor.jp/nicotwi')

        doc = Nokogiri::HTML URI.parse(url).open
        if url.include?('http://cobachica.hateblo.jp')
          doc.css('iframe').each do |iframe|
            iframe.attributes.each do |name,attr|
              next unless name == 'src'
              next unless (url = attr.value).include?('nicovideo.jp/thumb')
              item = add(url)
              next if item.nil?
              archive id
              p item
            end
          end
        elsif url.include?('http://blog.livedoor.jp/nicotwi')
          doc.css('script').each do |script|
            script.children.each do |child|
              next unless child.text.include?('var nico =')
              item = add(child.text)
              next if item.nil?
              archive id
              p item
            end
          end
        end
      end
    end
  end

  def add var
    matchs = var.match(/(sm[0-9]+)|(nm[0-9]+)/)
    nico_id = matchs.captures.compact.first unless matchs.nil?
    client.add(url: "http://www.nicovideo.jp/watch/#{nico_id}") if nico_id
  end

  def archive id
    client.modify [ { action: 'archive', item_id: id, } ]
  end

end


Nico.new.convert
