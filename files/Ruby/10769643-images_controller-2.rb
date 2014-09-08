# /app/controllers/images_controller.rb
class ImagesController < ApplicationController
  ...
  
  def index
    @images = Images.all
  end
  
  ...
end