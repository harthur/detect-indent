# GOAL: CustomCatalogs, Whiteboards Printed, Orders Created, Orders Submitted BY User PER Month

(1..12).each do |num|
  printed_cc = PrintJob::CustomCatalog.where(:updated_at.gte => num.months.ago, :updated_at.lte => (num-1).months.ago)
  printed_orders = PrintJob::Document.where(:updated_at.gte => num.months.ago, :updated_at.lte => (num-1).months.ago)
  printed_whiteboards = PrintJob::Whiteboard.where(:updated_at.gte => num.months.ago, :updated_at.lte => (num-1).months.ago)
  arr = {}
  
  printed_cc.each do |cc|
    next if cc.author.nil?
    arr[cc.author.username] ||= {}
    arr[cc.author.username][:custom_catalogs] ||= []
    arr[cc.author.username][:custom_catalogs] << cc[:pdf_filename]
  end
  printed_orders.each do |cc|
    next if cc.author.nil?
    arr[cc.author.username] ||= {}
    arr[cc.author.username][:orders] ||= []
    arr[cc.author.username][:orders] << cc[:pdf_filename]
  end
  printed_whiteboards.each do |cc|
    next if cc.author.nil?
    arr[cc.author.username] ||= {}
    arr[cc.author.username][:whiteboards] ||= []
    arr[cc.author.username][:whiteboards] << cc[:pdf_filename]
  end
  p "---====== PER MONTH =======---"
  p "for #{(num.months.ago).strftime('%B %e %Y')} through #{((num-1).months.ago).strftime('%B %e %Y')}"
  p "Custom Catalogs: #{PrintJob::CustomCatalog.where(:updated_at.gte => num.months.ago, :updated_at.lte => (num-1).months.ago).count}"
  p "Documents: #{PrintJob::Document.where(:updated_at.gte => num.months.ago, :updated_at.lte => (num-1).months.ago).count}"
  p "Whiteboards: #{PrintJob::Whiteboard.where(:updated_at.gte => num.months.ago, :updated_at.lte => (num-1).months.ago).count}"
  arr.each do |k, v|
    p "For User with username: #{k}"
    v.each do |key, val|
      p "printed #{key.to_s.titleize}, #{val.count} time(s)."
    end
    p ""
  end  
  p "-============================-"
end
  p "Final Counts:"
  p "Custom Catalogs: #{PrintJob::CustomCatalog.where(:updated_at.gte => 12.months.ago).count}"
  p "Printed Docs: #{PrintJob::Document.where(:updated_at.gte => 12.months.ago).count}"
  p "Whiteboards: #{PrintJob::Whiteboard.where(:updated_at.gte => 12.months.ago).count}"
