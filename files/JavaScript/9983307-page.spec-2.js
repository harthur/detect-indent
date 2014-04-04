describe('angularjs homepage', function() {
  it('should greet the named user', function() {
    browser.get('http://www.angularjs.org');

    element(by.model('yourName')).sendKeys('John Doe');

    var greeting = element(by.binding('yourName'));

    expect(greeting.getText()).toEqual('Hello John Doe!');
  });
});