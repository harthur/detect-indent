class ChargesController < ApplicationController
  after_filter :destroy_cart, :only => [:show]

  def new
    @cart = Cart.find(params[:id])
  end

  def create

  begin

    @cart = Cart.find(params[:id])

    @@customer = Stripe::Customer.create(
      :email => params[:stripeEmail],
      :card => params[:stripeToken]
    )

    charge = Stripe::Charge.create(
      :customer    => @@customer.id,
      :amount      => @cart.total_price * 100,
      :description => 'California Love Customer',
      :currency    => 'usd'
    )  

    rescue Stripe::CardError => e
      flash[:error] = e.message
      redirect_to charges_path
    end

    respond_to do |format|
      format.html { redirect_to charge_path(@cart) }
      format.json { head :ok }
    end

  end

  def show 
    @cart = current_cart
    #@current_cust1 = Stripe::Customer.email.retrieve("cus_3r0osHVQf5ASpc")
    @current_cust1 = @@customer.email
  end
   
  private

  def destroy_cart
    @cart = current_cart
    @cart.destroy 
    session[:cart_id] = nil
  end

end
