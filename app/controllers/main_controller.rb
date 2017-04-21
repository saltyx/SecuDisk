class MainController < BaseController

  def index
    current_user= session[:current_user]
    if current_user.nil?
      redirect_to login_url
    end
  end

end
