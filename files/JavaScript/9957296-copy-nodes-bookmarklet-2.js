javascript:(function() {
	window.nodes;
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js";
    var s = document.getElementsByTagName('body')[0];
    s.parentNode.appendChild(po, s);

	function copyToClipboard() {
		window.prompt("Copy and paste this into console to get source:", "copy(nodes);");
	}

	function runIt(){
		jQuery.noConflict();
		printHTML();
	};

	function printHTML() {
	    window.nodes = jQuery('body').html();
	    console.group('Source:');
	    console.log(window.nodes);
	    console.groupEnd();
		copyToClipboard();
	}

	var timeoutID = window.setTimeout(runIt, 200);

})();

