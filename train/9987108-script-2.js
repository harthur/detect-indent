(function(){
  'use strict';
  
  $(function(){
    
    var $facet = $facet = $('#facet'),
        hasSelected = $facet.find('input').filter(':checkbox').filter(':visible').is(':checked');

    
    $('#has-selected').html(hasSelected.toString());
  });
  
}());