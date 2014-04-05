export default Ember.Handlebars.helpers('money', function(amount) {
  return "$" + amount;
});