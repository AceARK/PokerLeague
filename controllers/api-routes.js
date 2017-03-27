var path = require("path");
var db = require("../models");
var sessions = require("express-session");
var crypto = require('crypto');

var session;

//hash functions
const sha512 = (password, salt) => {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

const genRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

// Routes
// =============================================================
module.exports = function(app) {

    //ADD A TOURNAMENT
    app.post("/add/tournament", function(req, res) {
        db.Tournament.create(req.body).then(function(result) {
            // redirect to admin.html page to load new tournament data
            res.redirect("/admin");
        });
    });

    //REGISTER NEW USER
    app.post("/users/register", function(req, res, next) {
        //Validation - checks if form is filled out properly
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

        var errors = req.validationErrors();

        if (errors) { //if errors restart register page
            req.session.errors = errors;
            req.session.success = false;
            res.render('register', {
                errors: errors
            });
        } else { //else look if there is a current user with same username or same email address

    	db.User.findAll({
	   	where: {
	   		$or: [
		   		{
		   			username: req.body.username
		   		},
		   		{
		   			email: req.body.email
	   			}
	   		]
	   	}
	   	}).then(function(userResults) {
	   		if(userResults.length){ //if there is a match of same name, restart register page
	   			res.render('register', {
                errors: [{msg: "Username or e-mail already in use"}]
            });
	   		}else { //else hash password and create the user

	   			 req.session.success = true;

            var salt = genRandomString(32);
            var hashedPassword = sha512(req.body.password, salt).passwordHash;

            db.User.create({
                email: req.body.email,
                username: req.body.username,
                hash: hashedPassword,
                salt: salt
            }).then(function(result) {
                // redirect to user.html with username in welcome message
                res.render('user', {
                    userName: req.body.username
                });
            });   		



	   		}

	   	});
           
        }
    });

    //SESSION LOGIN
    app.post("/login", function(req, res) {
        var session = req.session;
        var email = req.body.email;
        var password = req.body.password;
        console.log("am here");
        //checks hash against hash for entry validation
        db.User.findOne({
            where: {
                email: email
            }
        }).then(function(data) {
            var salt = data.salt;
            var hashedPassword = sha512(req.body.password, salt).passwordHash;
            if (hashedPassword === data.hash) {
            	session.loggedIn = true;
                session.uniqueID = [data.email, data.role, data.id, data.username];
                if (data.role === "admin") {
                    res.redirect('/admin');
                } else if (data.role === "user") {
                    res.redirect('/user/'+ data.id);
                } else {
                    console.log('No role found');
                }
            } else {
                console.log("Illegal entry detected.");
                console.log("Illegal entry detected.");
                console.log("Illegal entry detected.");
                console.log("Illegal entry detected.");
                console.log("Illegal entry detected.");
                console.log("Illegal entry detected.");
                console.log("Illegal entry detected.");
                res.redirect('/');
            }

        });

    });

//REGISTER FOR TOURNAMENT
    app.get('/register/tournament/:id', function(req, res) {
        var tournamentID = req.params.id;
        var userID = req.session.uniqueID[2];

        db.Player.create({
            UserId: userID,
            TournamentId: tournamentID,
            player_registered_flag: 1
        }).then(function(data) {
            console.log(data);
            res.redirect("/user/"+userID);
        });

    });

//UNREGISTER FOR TOURNAMENT
    app.get('/unregister/tournament/:id', function(req, res) {
        console.log("unregister");
        var tournamentID = req.params.id;
        var userID = req.session.uniqueID[2];

        db.Player.update({
            player_registered_flag: 0
        },{
            where:{
            UserId: userID,
            TournamentId: tournamentID
            }
        });
    });
    
    // PUT route to update checkedIn players in table
  app.put("/player/checkin", function(req, res) {
    db.Player.update(
      {
      	player_checkedIn_flag: 1
      },
      {
        where: {
          UserId: req.body.UserId,
          TournamentId: req.body.TournamentId
        }
      }).then(function(data) {
        res.json("flag updated on checkin");
      });
  });

app.get("/loggedIn", function(req, res) {
	res.json(req.session);
});



};

