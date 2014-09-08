  def create
    respond_to do |format|  
      format.html  do
        if user_not_activated params[:user][:email]
          flash[:alert] = "Your account hasn't been approved by VTS. Please contact VTS for more information."
          render :new
        else
          super
        end
      end

      format.json do
        resource = warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#new")  
        render :json=> {:success=>true, :auth_token=>resource.auth_token, :email=>resource.email, admin: resource.admin? }
      end
    end
  end

