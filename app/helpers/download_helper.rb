module DownloadHelper
  def self.find_the_shared_file(file_id)
    unchecked_file = UserFile.where('id = ? and is_shared = ? and is_folder = ?', file_id, true, false)
    return nil if unchecked_file.nil? || unchecked_file.blank?
    unchecked_file.first!
  end
end
