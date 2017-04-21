class LoginController < BaseController

  def index
    current_user = session[:current_user]
    redirect_to main_url unless current_user.nil?
  end

  def verify
    @user = User.find_by(email: login_param[:email])
    if !@user.nil? && @user.authenticate(login_param[:password])
      @user = User.update(@user.id, last_login_ip: request.remote_ip)
      session[:current_user] = @user
      render :plain => 'success'
    else
      render :plain => 'fail'
    end
  end

  private

  def login_param
    params.permit(:email, :password)
  end

end
