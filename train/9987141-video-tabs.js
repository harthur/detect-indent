/*
  To use it: 
  
  require(['video'], function(Video){
  	var video = new Video('.video');
    	// optionally, you can either drag a video file over the .video element
    	video.playvideo('a valid video url');
  });
  
*/
define(['jquery'],function($){

  	var exp_prefix = "";
	if($.browser.webkit) exp_prefix = "-webkit-";
	if($.browser.mozilla) exp_prefix = "-moz-";
	if($.browser.msie) exp_prefix = "-ms-";
	if($.browser.opera) exp_prefix = "-opera-";

	var Video = function(){
		var self = this;

		self.initialize = function(element){
			self.element = element;
			self.container = $(element).eq(0);

			self.container.on('dragover', self.donothing);
			self.container.on('drop', self.addvideo);
		};

		self.addvideo = function(event){
			event.preventDefault();
    			event.stopPropagation();

    			var videofile = event.originalEvent.dataTransfer.files[0],
				blob = URL.createObjectURL(videofile);

			self.playvideo(blob);
		};

		self.playvideo = function(url){
			self.container.empty();

    			self.video = $('<video>').
    				attr('src',url).attr('muted','1').attr('loop','1').
    				css('visibility','hidden').appendTo(self.container);

    			self.canvas = $('<canvas>').
    				css('visibility','hidden').appendTo(self.container);

    			self.video.on('canplaythrough', self.startplaying);
		};

		self.startplaying = function(event){
			var video_el = self.video.get(0),
			canvas_el = self.canvas.get(0);

			video_el.play();
			self.width = self.video.width();
			self.height = self.video.height();
			canvas_el.width = self.width;
			canvas_el.height = self.height;
			self.container.width(self.width);
			self.container.height(self.height);
			self.context = canvas_el.getContext('2d');

			var position = [];
			for(var x=0; x < self.height; x++){
				position.push("0 "+x+"px");
			}
			self.container.css("background-position",position.join(","));

			self.animation_steps = [];
			self.startencoding();
		};

		self.startencoding = function(){
			if(!self.video.get(0).paused && !self.video.get(0).ended){
				self.animation_steps.push(self.render());
				requestAnimFrame(self.startencoding);
			}
		};

		self.render = function(){
			self.context.drawImage(self.video.get(0),0,0);
			var fotogramma = self.context.getImageData(0,0,self.width,self.height),
					fotogramma_data = fotogramma.data,
					css_strings = [];

			for(var y=0; y < self.height; y++){
				css_string = exp_prefix + "linear-gradient(left";

				for(var x=0; x < self.width; x++){
					var 	index = (x + y * self.width) * 4,
						red = fotogramma_data[index],
						green = fotogramma_data[index + 1],
						blue = fotogramma_data[index + 2];

					css_string += ",rgb("+red+","+green+","+blue+") "+x+"px"
				}

				css_string += ")";
				css_strings.push(css_string);
			}
			self.container.css("background-image", css_strings.join(","));

			return "{ background-image:" + css_strings.join(",") + "};";
		};

		self.donothing = function(event){
			event.preventDefault();
		};

		return self.initialize.apply(self,arguments);
	}

	return Video;
});