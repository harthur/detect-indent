// api/policies/authenticated.js

// We use passport to determine if we're authenticated
module.exports = function(req, res, next)
{
  if (req.isAuthenticated())
		return next();

	res.redirect('/login')
}