// Check existence of a property
Object.prototype.hasOwnProperty.call(obj, keyToBeChecked);

// Create a new object that inherits from a null prototype
var registry = Object.create(null);
// So this could yield `true`
!registry['hasOwnProperty'];

// Source: http://www.devthought.com/2012/01/18/an-object-is-not-a-hash/