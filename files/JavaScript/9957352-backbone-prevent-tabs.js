// allow a method to prevent closing of the current state
define([
	'jquery',
	'underscore',
	'backbone'
], function(
	$,
	_,
	Backbone
) {
	// Attach a method to Backbone that navigation code should wrap navigating code.
	// If navigation is not prevented, the navigation callback is executed.
	Backbone.preventClose = function(callback) {
		var that = this;

		// if no defer has been created yet, create one
		if (!this.defer) {
			this.defer = $.Deferred();

			if (Backbone.preventClose.preventer) {
				// find out what the preventer wants to do
				var result = Backbone.preventClose.preventer();

				if (result && result.promise) {
					this.defer = result; // delegate to callback's promise
				} else if (result) {
					this.defer.resolve(); // successfully prevent
				} else {
					this.defer.reject(); // failure to prevent
				}

				// when prevention fails, remove the preventing callback
				this.defer.fail(function() {
					delete Backbone.preventClose.preventer;
				});
			} else {
				this.defer.reject(); // failure to prevent
			}

			// when defer is done, remove it
			this.defer.always(function() {
				// wait until callbacks exec
				_.defer(function() {
					delete that.defer;
				});
			});
		}

		// if a preventer fails to prevent, exec this callback
		this.defer.fail(function() {
			callback();
		});
	};

	// Override the constructor of View, so as to allow a "preventClose"
	// method to be defined on it.  If one is defined, it is used as the 
	// prevention callback for preventClose()
	var constructor = Backbone.View.prototype.constructor;
	Backbone.View.prototype.constructor = function() {
		constructor.apply(this, arguments);

		if (this.preventClose) {
			// set the callback, with proper context
			Backbone.preventClose.preventer = _.bind(this.preventClose, this);
		}
	};
});
