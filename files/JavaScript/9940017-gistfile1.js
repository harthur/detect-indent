#customer-info{'data-message-channel' => "#{current_user.company.channel if user_signed_in?}", 'data-customer-id' => "#{@customer.id if @customer}", 'data-customer-first-name' => "#{@customer.first_name if @customer}"}
#key-info{'data-subscribe-key' => "#{ENV['PUBNUB_SUBSCRIBE_KEY'] || CONFIG['pubnub_subscribe_key']}"}

:javascript
  if(pubnub == undefined){
    var pubnub = PUBNUB.init({
      subscribe_key : $('#key-info').data('subscribe-key')
    })
  }

  pubnub.subscribe({
    channel : $('#customer-info').data('message-channel'),
    message : function(message){
      if(message.customer_id == $('#customer-info').data('customer-id')){
        $('#message').append($('<li>').text($('#customer-info').data('customer-first-name') + ': (' + message.time + ') '+ message.text));
      } else {
        $('#badge-' + message.customer_id).text('new');
      }
      if($('#cust-' + message.customer_id).length == 0){
        debugger;
        $('#customer').append("<div> <a href=\"http://design.optimus.com/projects\">Previous Page</a></div> ")
      }
    }
  })

  $('.close-issue').on('click', function(e){
    pubnub.unsubscribe({
      channel : $('#customer-info').data('message-channel')
    })
  })