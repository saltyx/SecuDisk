class Api::V1::DownloadController < Api::V1::BaseController

  include DownloadHelper

  def shared
    file = DownloadHelper.find_the_shared_file download_params[:id].to_i
    file.download_times = file.download_times + 1
    file.save!
    return file_not_exist if file.nil?
    send_file file.file_path
  end

  private

  def download_params
    params.permit(:id)
  end
end
