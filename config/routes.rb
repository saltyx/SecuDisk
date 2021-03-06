Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'download/shared'
    end
  end

  namespace :api do
    namespace :v1 do
      get 'search/query'
    end
  end

  # main part
  get 'main', to: 'main#index'
  get 'login', to: 'login#index'
  root 'login#index'
  get 'main/:id', to: 'main#change_folder'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # API part
  namespace :api do
    namespace :v1 do
      post 'login/', to: 'login#index'

      post 'upload/:id', to: 'upload#upload'
      post 'uploadByChunk/:id', to: 'upload#upload_big_file'

      post 'folder/create', to: 'folder#create'
      delete 'folder/delete', to: 'folder#delete'
      put 'folder/update', to: 'folder#update'
      post 'folder/encrypt', to: 'folder#encrypt'
      post 'folder/decrypt', to: 'folder#decrypt'
      get 'folder/:id', to: 'folder#files_by_folder'
      get 'folder/info/:id', to: 'folder#folder_info'

      post 'file/encrypt', to: 'file#encrypt'
      post 'file/decrypt', to: 'file#decrypt'
      put 'file/copy', to: 'file#copy'
      delete 'file/delete',to: 'file#delete'
      put 'file/move', to: 'file#move'
      put 'file/update', to: 'file#update'
      post 'file/share', to: 'file#share'
      post 'file/share/cancel', to: 'file#cancel_sharing'
      get 'file/:id', to: 'file#get_the_file'
      get 'file/info/:id', to: 'file#file_info'

      get 'search/:query', to: 'search#query'
      get 'shared/:id', to: 'download#shared'
    end
  end



end
