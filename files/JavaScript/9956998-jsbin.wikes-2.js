$(function(){
  
// Allow user to pick which items to show
$('body').on('change','p#picker input', function() { 
  var deleteSelected = $(this).attr('id');
  if($('input#'+ deleteSelected).is(':checked') === false){
    $('div#pic'+ deleteSelected).addClass('deleteThis');
    // Store selection
    localStorage.setItem('pic'+ deleteSelected, true);
  } else {
    $('div#pic'+ deleteSelected).removeClass('deleteThis');
    // Unstore selected
    localStorage.removeItem('pic'+ deleteSelected);
  }
});

// Get the stored options for which items
// to show
$('div.member').each(function(){
  deleter = $(this).attr('id');
  if(localStorage.getItem(deleter)){ 
    $(this).addClass('deleteThis');     
  }
});
  
// Get the stored options for which checkboxes
// to fill
$('p#picker input').each(function(){ 
  deleted = $(this).attr('id');
  if(localStorage.getItem('pic'+ deleted)){
    $(this).removeAttr('checked');
  }
});

 
  
  
$('body').on('click','button#random',function() {  $("body").randomize("div.band", "div.member");
  // This stores your random setting
  // and will store it across pages and 
  // across visits to the site/app
  localStorage.setItem('random', true);
});

$('button#normal').click(function() {  
  // This gets rid of your random setting
 localStorage.removeItem('random');
});

// This checks for random setting on page load
if(localStorage.getItem('random')){  $("body").randomize("div.band","div.member");
} 
  
});


// This is the randomize jQuery plugin
(function($) {
  
  $.fn.randomize = function(tree, childElem) {
    return this.each(function() {
      var $this = $(this);
      if (tree) $this = $(this).find(tree);
      var unsortedElems = $this.children(childElem);
      var elems = unsortedElems.clone();
      
      elems.sort(function() { return (Math.round(Math.random())-0.5); });  

      for(var i=0; i < elems.length; i++)
        unsortedElems.eq(i).replaceWith(elems[i]);
    });    
  };

})(jQuery);
