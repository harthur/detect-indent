Blog::Application.routes.draw do
  get 'welcome/index'

  # The priority is based upon order of creation: first created -> h$
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"

   resources :articles

   root 'welcome#index'

end
