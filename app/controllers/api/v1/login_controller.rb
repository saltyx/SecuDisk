
class Api::V1::LoginController < Api::V1::BaseController

  def index

    @user = User.find_by(name: login_params[:name])

    if !@user.nil? && @user.authenticate(login_params[:password])
      @user = User.update(@user.id, last_login_ip: request.remote_ip)
      render :text => @user.token
      #render :json => UsersSerializer.new(@user)
    else
      if @user.nil?
        @user = User.find_by(email: login_params[:name])
        if !@user.nil? && @user.authenticate(login_params[:password])
          @user = User.update(@user.id, last_login_ip: request.remote_ip)
          render :plain => @user.token
        else
          api_error(status: 401)
        end
      else
        api_error(status: 401)
      end
    end

  end

  private

  def login_params
    params.require(:user).permit(:name, :password)
  end

end
