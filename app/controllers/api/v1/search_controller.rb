class Api::V1::SearchController < Api::V1::BaseController

  include SearchHelper
  before_action :authenticate_user!

  def query
    response_status(200, SearchHelper.query('%' + search_params[:query].to_s + '%').to_json)
  end

  private

  def search_params
    params.permit(:query)
  end

end
