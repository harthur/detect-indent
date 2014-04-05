(function() {

var initialize = function() {
  console.log('initialize');
  
  var cid = 123;
  		var widget_id = 'YT_widget_' + cid;

  		$('body').append('<div id="' + widget_id + '" class="YT_widget"></div>');

		this.widget = new YT.UploadWidget(widget_id, {
			width: 570,
			events: {
				'onApiReady': onApiReady,
'onStateChange': onStateChange
			}
		});

};

var onApiReady = function() {
  console.log('onApiReady');
};

var onStateChange = function() {
   console.log('onStateChange');
};
  
// On DOM ready.
$(function() {
  	window.onYouTubeIframeAPIReady = initialize;
});
  
})();