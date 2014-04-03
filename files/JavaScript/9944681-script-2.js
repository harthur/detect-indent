$(document).ready(function () {
  $('.accordion__button').click(function(){
    $activeAccordion = $(this).closest('.accordion');
    if($(this).hasClass( "active" )){
      $('.accordion__panel').slideUp();
      $(this).removeClass('active');
    } else {
      $activeAccordion.find('.accordion__panel').slideUp();
      $(this).next().stop( true, true ).slideDown();
      $('.accordion__button').removeClass('active');
      $(this).addClass('active');
    }
  });
});