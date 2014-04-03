define([
 "jquery",
  "backbone",
  "app/collections/articles",
  "app/views/articlesview"
], function($,Backbone, ArticlesCollection, ArticlesView) {
  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "section/:section" : "nyt"
    },
    index: function() {
      	var articlesView = new ArticlesView({
      		collection: new ArticlesCollection()
    	});
    	articlesView.render();
    	console.log("nyt index : " );
    },
    nyt: function (section) {
    	console.log("nyt routes : "  + section);
    }
  });
  
  

  return Router;
});