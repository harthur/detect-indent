var css_url = 'https://gist.githubusercontent.com/tijptjik/10038965/raw/73d92061648c72c7c621345243bc16f2577c60db/custom.css'

$('<link>')
  .appendTo($('head'))
  .attr({type : 'text/css', rel : 'stylesheet'})
  .attr('href', css_url);

