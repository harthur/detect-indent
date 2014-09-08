require 'open-uri'
require 'uri'
require 'tempfile'
require 'bundler'
Bundler.require


# http://aws.typepad.com/marketplace_jp/2014/04/weekly_top1000.html
#
urls = [
  'https://s3.amazonaws.com/JP_AM/weekly_top1000/used_Top1000_14.txt', # 売上数TOP1000レポート（中古のみ）
  'http://s3.amazonaws.com/JP_AM/weekly_top1000/books_long_tale_item.txt', # ロングテール商品:出品推奨レポート
  'http://s3.amazonaws.com/JP_AM/weekly_top1000_view/GV_Top1000_14.txt', # 閲覧数TOP1000レポート
]
urls.each do |url|
  tempfile = Tempfile.new 'csv'
  tempfile.write URI.parse(url).open.read
  tempfile.close

  File.open(tempfile.path, 'rb:Shift_JIS:UTF-8', undef: :replace) do |f|
    jan_num = price_num = 0
    f.readlines.map{|l| l.split(/\t/) }.each_with_index do |row,i|
      if i.zero?
        jan_num = row.index('jan')
        price_num = row.index('lowest_price_used')
        next
      end
      next if (jan = row[jan_num]) == '' || (price = row[price_num].to_i) < 100

      begin
        url = "http://www.bookoffonline.co.jp/feed/search,st=u,q=#{jan}"
        Feedjira::Feed.fetch_and_parse(url).entries.each do |entrie|
          doc = Nokogiri::HTML entrie.summary
          old_price = doc.css('li').map do |li|
            li.text.gsub(/[^0-9]/,'').to_i if li.text.include?('中古')
          end.compact.first || 0
          next if price < (old_price + 200)
          # ブックオフの価格が200円安い
          p "jan: #{jan} Amazon: #{price}円 > ブックオフ: #{old_price}円 商品: #{entrie.title}"
        end
      rescue => e
        p "error  message: #{e.message} jan: #{jan}"
      end
    end
  end
end
