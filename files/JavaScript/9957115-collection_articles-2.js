 define ([
  "underscore",
  "backbone",
  "app/config",
  "app/models/article",
  "backbone.localStorage"
  ], function (_, Backbone, config, ArticleModel) {

  var ArticlesCollection = Backbone.Collection.extend({
    //localStorage: new Backbone.LocalStorage(config.storeName),

    model: ArticleModel,
    url: "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=california+drought&fq=source:(%22The%20New%20York%20Times%22)&page=1&api-key=5c49d0154978d104686bfe116fa56207:11:69114803",

    parse : function (resp) {      
      return resp.response.docs;
    },

    initialize: function () {
      this.fetch({
        success: function (collection) {
          collection.each(function (article) {
            console.log ("Article: ", article);
          });
        }
      });
        
      }

  });
  return ArticlesCollection;
});