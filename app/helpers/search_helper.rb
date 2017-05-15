module SearchHelper

  def self.query(query_text)
    UserFile.where('file_name like ?', query_text)
  end

end
