// use for patterns:
//   *outlook.office365.com*
//   *outlook.com*

// Updated to work with latest version of office365,
// credit to http://userscripts.org/scripts/show/186003

// TODO: Exclude unread count from favourites folders

var playBeep = true;
 
window.fluid.dockBadge = '';
var numMessages = 0;
 
setTimeout(updateDockBadge, 1000);
setTimeout(updateDockBadge, 3000);
setInterval(updateDockBadge, 5000);
updateDockBadge();
 
// console.log("Loaded Userscript for Outlook Badge Notifications");
 
function updateDockBadge() {
  
  var newBadge = '';
  var html = document.getElementsByTagName('html')[0].innerHTML
  var regex = /([0-9]+)\sUnread/g, result
 
    var parts = html.match(regex);
    var sum = 0
    
    if (parts)
    	parts.forEach(function(entry) {
    		sum += parseInt(entry.split(" ")[0]);
    	});
    	
    if (sum > 0) {
                
        if (sum - numMessages > 0 && playBeep) {
				window.fluid.playSound("Glass");
        }
        
        newBadge = sum;

    }
    
    numMessages = sum;
    
	window.fluid.dockBadge = newBadge;
}