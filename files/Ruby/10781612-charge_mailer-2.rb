 7 class ChargeMailer < ActionMailer::Base
  6   default :from => "mygmailaddress@gmail.com"
  5 
  4   def registration_confirmation(cust)
  3     @@customer = cust 
  2     mail(:to => "#{cust.email}", :subject => "Your Order Confirmation")
  1   end
  0 end
~          