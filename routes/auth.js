const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const Campground = require('../models/campground');

router.get('/register', (req, res) => {
    res.render('userAuth/register');
});

router.post('/register', async (req, res, next) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({username, email});
        const regUser = await User.register(user, password);
        req.login(regUser, err => {
            if(err)  return next(err);
            else{
                req.flash('success', 'User created successfully');
                res.redirect('/campgrounds');
            }
        });
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
    
});

router.get('/vulnerablelogin', (req, res) => {
    res.render('userAuth/vulnerableLogin');
});

router.post('/vulnerablelogin', async (req, res) => {
    req.flash('success', 'Welcome! Logged in Successfully');
    res.redirect('/campground');
});

router.get('/login', (req, res) => {
    res.render('userAuth/login');
});

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome! Logged in Successfully');
    const returnUrl = req.session.returnTo || '/campgrounds';    //if returnTo exist in the not login middleware it will execute 1st statement otherwise /campgrounds
    delete req.session.returnTo;
    res.redirect(returnUrl);
});

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'Goodbye!!');
    res.redirect('/');
})

module.exports = router;