// config/policies.js

/**
* Policy defines middleware that is run before each controller/controller.
* Any policy dropped into the /middleware directory is made globally available through sails.middleware
* Below, use the string name of the middleware
*/
module.exports.policies = {
  // default require authentication
  // see api/policies/authenticated.js
	'*': 'authenticated',

  // whitelist the auth controller
	'auth':
	{
		'*': true
	}
};