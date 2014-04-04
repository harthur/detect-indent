// api/controllers/AuthController.js

var passport = require('passport');

var AuthController = {

  login: function (req,res)
	{
		res.view();
	},

	process: function(req, res)
	{
		passport.authenticate('local', function(err, user, info)
		{
			if ((err) || (!user))
			{
				res.redirect('/login');
				return;
			}

			req.logIn(user, function(err)
			{
				if (err)
				{
					res.view();
					return;
				}
				
				res.redirect('/');
				return;
			});
		})(req, res);
	},

	logout: function (req,res)
	{
		req.logout();
		res.redirect('/');
	}

};

module.exports = AuthController;