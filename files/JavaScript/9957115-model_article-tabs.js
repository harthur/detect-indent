define ([
	"backbone"
	], function (Backbone, LoanModel) {

	var ArticleModel = Backbone.Model.extend ({
		parse : function(response, options){
		    if (options.collection) return response;
		    return response.response.docs[0];
		}
	});
 	return ArticleModel;
});