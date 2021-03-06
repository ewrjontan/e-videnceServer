const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');


const router = express.Router();

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find()
    .then(users => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    })
    .catch(err => next(err));
});

//for registration
router.post('/register', cors.corsWithOptions, (req, res) => {
    User.register(
        new User({username: (req.body.username).toLowerCase()}),
        req.body.password,
        (err, user) => {
          if (err) {
              res.statusCode = 500; //internal server error, not an issue on clientside
              res.setHeader('Content-Type', 'application/json');
              res.json({err: err});
          }else{
              if (req.body.firstname) {
                  user.firstname = req.body.firstname;
              }

              if (req.body.lastname) {
                  user.lastname = req.body.lastname;
              }

              if (req.body.agency) {
                user.agency = req.body.agency;
              }

              if (req.body.email) {
                user.email = req.body.email;
              }

              user.save(err => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({err: err});
                    return;
                }
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration Successful'});
                });
            });
          }
        }
    );
});


//for login
router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!', userId: req.user._id});
});

//add this below res.clearCookie in logout router if needed
//res.redirect('/'); //redirects back to route path

//for user logout
router.get('/logout', cors.corsWithOptions, (req, res, next) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        //res.statusCode = 200;
        //res.setHeader('Content-Type', 'application/json');
        //res.json({success: true, status: 'You are successfully logged out!'});
        //res.redirect('/');
    }else {//client is trying to logout without being logged in
        const err = new Error('You have logged out!');
        err.status = 401;
        return next(err);
    }
});

/* GET user by Id. */
router.get('/:userId', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    User.findById(req.params.userId)
    .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    })
    .catch(err => next(err));
});

//For Facebook OAuth
/*router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
    if (req.user) {
        const token = authenticate.getToken({_id: req.user._id});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, token: token, status: 'You are successfully logged in!'});
    }
});*/

module.exports = router;
