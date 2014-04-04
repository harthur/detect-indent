	$("a[title=\'Close\'],a[data-rel=\'back\']").live("click",function(ev){
		ev.preventDefault();
		window.location = "#" + $.mobile.urlHistory.getPrev().pageUrl;
		return false;
	});