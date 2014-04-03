/* Author : Julien GROUD
Version : 1.0.9
Date : 03/04/2014 00h30 -- Julien GROUD
*/

var express = require('express'), // to have express
	app     = express(), // create var of express
	mysql   = require('mysql'), // to have mysql
	
	
	
    connectionpool = mysql.createPool({ // connect to mysql in localhost
        host     : 'localhost', 
        user     : 'root',
        password : '',
        database : 'apinode' // my database in localhost
    });


//------------------------------------------------------ SELECT TABLE ----------------------------------------------------------
app.get('/select/:table', function(req,res){ // to have all table
	if(isSecure(req.params.table))
	{
		connectionpool.getConnection(function(err, connection) 
		{
			if (err)
			{
				console.error('CONNECTION error: ',err);
				res.statusCode = 503;
				res.send({
					result: 'error',
					err:    err.code
				});
			} 
			
			else
			{
				connection.query('SELECT * FROM '+req.params.table, function(err, rows, fields)
				{
					console.log(rows);
					if (err) 
					{
						console.error(err);
						res.statusCode = 500;
						res.send({
							result: 'error',
							err:    err.code
						});
					}
					
					else 
					{
						res.send({
							result: 'success',
							json:   rows,
							length: rows.length
						});
					}
					connection.release();
				});
			}
		});
	}
	else
	{
		res.statusCode = 500;
		res.send({
			result: 'error',
			err:    'no valid caracters'
		});
	}
});





//------------------------------------------------------ INSERT IN TABLE VIDEO----------------------------------------------------------
app.get('/insert/video/:name/:nameUser', function(req,res){ // to have all table
	if(isSecure(req.params.name) && isSecure(req.params.nameUser))
	{
		connectionpool.getConnection(function(err, connection) 
		{
			if (err)
			{
				console.error('CONNECTION error: ',err);
				res.statusCode = 503;
				res.send({
					result: 'error',
					err:    err.code
				});
			} 
			
			else
			{
				connection.query('SELECT * FROM user WHERE name=("'+req.params.nameUser+'")', function(err, rows2, fields)
				{
					if (err) 
					{
						console.error(err);
						res.statusCode = 500;
						res.send({
							result: 'error',
							err:    err.code
						});
					}
					else if(0==rows2.length)
					{
						console.error(err);
						res.statusCode = 500;
						res.send({
							result: 'error',
							err:    'no user with this name'
						});
					}
					else 
					{
						id=rows2[0].id; // to have the id_user 
						connectionpool.getConnection(function(err, connection) 
						{
							if (err)
							{
								console.error('CONNECTION error: ',err);
								res.statusCode = 503;
								res.send({
									result: 'error',
									err:    err.code
								});
							} 
												
							else
							{
								connection.query('INSERT INTO video (titre,id_user) VALUES ("'+req.params.name+'","'+id+'")', function(err, rows, fields)
								{
									if (err) 
									{
										console.error(err);
										res.statusCode = 500;
										res.send({
											result: 'error',
											err:    err.code
										});
									}
														
									else 
									{
										res.send({
											result: 'success',
											json:   rows,
											length: rows.length
										});
									}
									connection.release();
								});
							}
						});
					}
					connection.release();
				});
			}
		});
	}
	else
	{
		res.statusCode = 500;
		res.send({
			result: 'error',
			err:    'no valid caracters'
		});
	}
});













//------------------------------------------------------ INSERT IN TABLE USER ----------------------------------------------------------
app.get('/insert/user/:name', function(req,res){
	if(isSecure(req.params.name))
	{
		connectionpool.getConnection(function(err, connection) 
		{
			if (err)
			{
				console.error('CONNECTION error: ',err);
				res.statusCode = 503;
				res.send({
					result: 'error',
					err:    err.code
				});
			} 
			
			else
			{
				connection.query('INSERT INTO user (name) VALUES ("'+req.params.name+'")', function(err, rows, fields)
				{
					if (err) 
					{
						console.error(err);
						res.statusCode = 500;
						res.send({
							result: 'error',
							err:    err.code
						});
					}
					
					else 
					{
						res.send({
							result: 'success',
							json:   rows,
							length: rows.length
						});
					}
					connection.release();
				});
			}
		});
	}
	else
	{
		res.statusCode = 500;
		res.send({
			result: 'error',
			err:    'no valid caracters'
		});
	}
});

















//------------------------------------------------------ DELETE IN TABLE USER ----------------------------------------------------------
app.get('/delete/user/:name', function(req,res){ // to have all table
	if(isSecure(req.params.name))
	{
		connectionpool.getConnection(function(err, connection) 
		{
			if (err)
			{
				console.error('CONNECTION error: ',err);
				res.statusCode = 503;
				res.send({
					result: 'error',
					err:    err.code
				});
			} 
			
			else
			{
				connection.query('SELECT * FROM user WHERE name=("'+req.params.name+'")', function(err, rows2, fields)
				{
					if (err) 
					{
						console.error(err);
						res.statusCode = 500;
						res.send({
							result: 'error',
							err:    err.code
						});
					}
					else if(0==rows2.length)
					{
						console.error(err);
						res.statusCode = 500;
						res.send({
							result: 'error',
							err:    'no user with this name'
						});
					}
					else 
					{
						id_user=rows2[0].id; // to have the id_user
						connectionpool.getConnection(function(err, connection) 
						{
							if (err)
							{
								console.error('CONNECTION error: ',err);
								res.statusCode = 503;
								res.send({
									result: 'error',
									err:    err.code
								});
							} 
							
							else
							{
								connection.query('DELETE FROM video WHERE id_user="'+id_user+'"', function(err, rows, fields) // for delete all video of the user
								{
									if (err) 
									{
										console.error(err);
										res.statusCode = 500;
										res.send({
											result: 'error',
											err:    err.code
										});
									}
									
									else 
									{
										connectionpool.getConnection(function(err, connection) 
										{
											if (err)
											{
												console.error('CONNECTION error: ',err);
												res.statusCode = 503;
												res.send({
													result: 'error',
													err:    err.code
												});
											} 
											
											else
											{
												connection.query('DELETE FROM user WHERE name="'+req.params.name+'"', function(err, rows, fields)
												{
													if (err) 
													{
														console.error(err);
														res.statusCode = 500;
														res.send({
															result: 'error',
															err:    err.code
														});
													}
													
													else 
													{
														res.send({
															result: 'success',
															json:   rows,
															length: rows.length
														});
													}
													connection.release();
												});
											}
											connection.release();
										});
									}
									connection.release();
								});
							}
						});
					}
				});
			}
		});
	}
	else
	{
		res.statusCode = 500;
		res.send({
			result: 'error',
			err:    'no valid caracters'
		});
	}
});

	
	
	
	

	
	
	
	
	
//------------------------------------------------------ DELETE IN TABLE VIDEO ----------------------------------------------------------
app.get('/delete/video/:name', function(req,res){
	if(isSecure(req.params.name))
	{
		connectionpool.getConnection(function(err, connection) 
		{
			if (err)
			{
				console.error('CONNECTION error: ',err);
				res.statusCode = 503;
				res.send({
					result: 'error',
					err:    err.code
				});
			} 
			
			else
			{
				connection.query('DELETE FROM video WHERE titre="'+req.params.name+'"', function(err, rows, fields)
				{
					if (err) 
					{
						console.error(err);
						res.statusCode = 500;
						res.send({
							result: 'error',
							err:    err.code
						});
					}
					
					else 
					{
						res.send({
							result: 'success',
							json:   rows,
							length: rows.length
						});
					}
					connection.release();
				});
			}
		});
	}
	else
	{
		res.statusCode = 500;
		res.send({
			result: 'error',
			err:    'no valid caracters'
		});
	}
});

	
	
		




















//------------------------------------------------------ UPDATE IN TABLE ----------------------------------------------------------
app.get('/update/:table/:oldName/:newName', function(req,res){ // to have all table
	if(isSecure(req.params.table) && isSecure(req.params.oldName) && isSecure(req.params.newName))
	{
		if("video"==req.params.table)
		{
			connectionpool.getConnection(function(err, connection) 
			{
				if (err)
				{
					console.error('CONNECTION error: ',err);
					res.statusCode = 503;
					res.send({
						result: 'error',
						err:    err.code
					});
				} 
				
				else
				{
					connection.query('UPDATE video SET titre="'+req.params.newName+'" WHERE titre="'+req.params.oldName+'"', function(err, rows, fields)
					{
						if (err) 
						{
							console.error(err);
							res.statusCode = 500;
							res.send({
								result: 'error',
								err:    err.code
							});
						}
						
						else 
						{
							res.send({
								result: 'success',
								json:   rows,
								length: rows.length
							});
						}
						connection.release();
					});
				}
			});
		}
		
		else if("user"==req.params.table)
		{
			connectionpool.getConnection(function(err, connection) 
			{
				if (err)
				{
					console.error('CONNECTION error: ',err);
					res.statusCode = 503;
					res.send({
						result: 'error',
						err:    err.code
					});
				} 
				
				else
				{
					connection.query('UPDATE user SET name="'+req.params.newName+'" WHERE name="'+req.params.oldName+'"', function(err, rows, fields)
					{
						if (err) 
						{
							console.error(err);
							res.statusCode = 500;
							res.send({
								result: 'error',
								err:    err.code
							});
						}
						
						else 
						{
							res.send({
								result: 'success',
								json:   rows,
								length: rows.length
							});
						}
						connection.release();
					});
				}
			});
		}
		
		else
		{
			res.statusCode = 500;
			res.send({
				result: 'error',
				err:    'unknow table'
			});
		}
	}
	else
	{
		res.statusCode = 500;
		res.send({
			result: 'error',
			err:    'no valid caracters'
		});
	}
});














//------------------------------------------------------ SELECT VIDEO FOR A USER ----------------------------------------------------------
app.get('/selectVideo/:name', function(req,res){ // to have all table
	if(isSecure(req.params.name))
	{
		connectionpool.getConnection(function(err, connection) 
		{
			if (err)
			{
				console.error('CONNECTION error: ',err);
				res.statusCode = 503;
				res.send({
					result: 'error',
					err:    err.code
				});
			} 
			
			else
			{
				connection.query('SELECT * FROM user WHERE name=("'+req.params.name+'")', function(err, rows2, fields)
				{
					if (err) 
					{
						console.error(err);
						res.statusCode = 500;
						res.send({
							result: 'error',
							err:    err.code
						});
					}
					else if(0==rows2.length)
					{
						console.error(err);
						res.statusCode = 500;
						res.send({
							result: 'error',
							err:    'no user with this name'
						});
					}
					else 
					{
						id_user=rows2[0].id;
						connectionpool.getConnection(function(err, connection) 
						{
							if (err)
							{
								console.error('CONNECTION error: ',err);
								res.statusCode = 503;
								res.send({
									result: 'error',
									err:    err.code
								});
							} 
												
							else
							{
								connection.query('SELECT * FROM video WHERE id_user="'+id_user+'"', function(err, rows, fields)
								{
									if (err) 
									{
										console.error(err);
										res.statusCode = 500;
										res.send({
											result: 'error',
											err:    err.code
										});
									}
														
									else 
									{
										res.send({
											result: 'success',
											json:   rows,
											length: rows.length
										});
									}
									connection.release();
								});
							}
						});
					}
					connection.release();
				});
			}
		});
	}
	else
	{
		res.statusCode = 500;
		res.send({
			result: 'error',
			err:    'no valid caracters'
		});
	}
});




function isSecure(name) { // function for the security of the BDD
	if(name.match(/^[a-zA-Z0-9 \-_\é\'\-\è\ç\à\ù\ê\ë\û\ü\ê\ë\ä\â\ÿ\ï\ô\ö\î\_\/\:\Ë\Ê\ñ\Ä\Â\Ü\Û\Î\Ï\Ö\Ô]+$/g))
	{ 
		return true;
	}
	else {return false;}
}




app.listen(3000);
console.log('Rest Demo Listening on port 3000');