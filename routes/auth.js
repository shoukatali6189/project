const express = require('express');
const User = require('../models/User');
const passport = require('passport');
const router = express.Router();

// sigup
router.get('/register', (req,res) => {
    res.render('auth/signup');
})


// actualy sigup
router.post('/register',  async(req,res) => {
    // console.log(req.body);
    let { username, password, email, role, gender } = req.body;

    // user and password ko alag karna ha
    let user = new User({ username, email, gender,role }) // password nahi da sakata 
    // register is tstaticmethod  --> its a DB operation async await
    // register --> its stored the"newUser" in db --> make it unique and add hashing and salt in it --> its work automatically
    let newUser =  await User.register(user,password)
    // res.send(newUser);
    res.redirect('/login')
    
})

// login 
router.get('/login' , (req,res)=>{
    res.render('auth/login');
})

// actualy login 
router.post('/login',
  passport.authenticate('local', 
  { 
    failureRedirect: '/login', // if failure its redrect the login page 
    failureMessage: true 
  }),
    function (req, res) {
    // console.log(req.user,"User"); // get user details
    
    req.flash(`success`, `Welcome Back ${req.user.username}`) // get user details user name 
    res.redirect('/products'); // if sucess its redrect the products page 
    });


// logout 
router.get("/logout", (req,res) => {
    req.logOut(() => {
        req.flash('success' , 'logout successFully')
        res.redirect('/login');
    })
})  


module.exports = router;