const express = require('express');
const router = express.Router();
const crypto = require('crypto');

//Bring in User model
let user = require('./../models/user');

//Register form
router.get('/register', function(req, res) {
  res.render('register');
});

//Register Proccess
router.post('/register', function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;
  let email = req.body.email;
  let fullname = req.body.fullname;
  let birthday = req.body.birthday;

  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('assword', 'Password is required').notEmpty();
  req.checkBody('password2', 'Password2 is not match').equals(req.body.password);
  req.checkBody('email',     'Email is required').notEmpty();
  req.checkBody('email',     'Email is not valid').isEmpty();
  req.checkBody('fullname',  'FullName is required').notEmpty();
  req.checkBody('birthday',  'birthday is required').notEmpty();

  let errors = req.validationErrors();
  if (errors){
    res.render('register', {
      errors:errors
    });
  } else {
    let newUser = new User({
      username:username,
      password:password,
      email:email,
      fullname:fullname,
      birthday:birthday,
      key:key
    });

    password = crypto.createHash('md5').update(password + username).digest('hex');
    if (error) {
      console.log(err);
    }
    newUser.password = hash;
    newUser.save(function(err) {
      if(error) {
        console.log(err);
        return;
      } else{
        req.flash('success', 'You are now registered and can Log in');
        res.redirect('/user/login');
      }
    });
  }
});

router.get('login',function(req, res) {
  res.render('login');
});


module.exports = router;
