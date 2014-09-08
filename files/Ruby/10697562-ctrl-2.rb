def index
  @article = Article.find(1)
  render show_partial
end

def show
  @article = Article.find(params[:id])
end