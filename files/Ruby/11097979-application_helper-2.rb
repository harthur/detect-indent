module ApplicationHelper
  # Basic function with this if you have any object.errors that you wanted formated you just call this method and it will handle the formating
  def error_summery( object )
    return unless object.errors.any?
    # Build the messages li
    messages = []
    object.errors.full_messages.each do |msg|
      messages << content_tag(:li, msg)
    end
    content_tag(:div, "Please review the errors below", class: 'alert alert-danger') +
    content_tag(:div, content_tag(:ul, messages.join("").html_safe), class: 'alert alert-danger')
  end
end