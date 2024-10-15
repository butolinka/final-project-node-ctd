const User = require('../models/User');
const passport = require('passport');

exports.register = async(req, res)=>{
    const {username, password} = req.body;
    try{
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            req.flash('error_msg', 'Username already exists');
            return res.redirect('/register');
        }
        const newUser = new User({username, password});
        await newUser.save();
        console.log('User saved successfully');
        req.flash('success_msg', 'Registration completed and you can login');
        res.redirect('/login');
    } catch(err){
        console.error('Error during registration:', err); 
        req.flash('error_msg', `Unsuccessful registration, an error ${err} occurs`);
        res.redirect('/register');
    }
};

exports.login = (req,res,next)=>{
    console.log('attempt to login');
    passport.authenticate('local', (err, user, info)=>{
        if(err){
            console.error('error during authentication', err);
            return next(err);
        }
        if(!user){
            console.log('no user found', info.message);
            req.flash('error_msg', info.message);
            return res.redirect('/login');
        }
        req.logIn(user, (err)=>{
            if(err){
                console.log('error loggin in', err);
                return next(err);
            }
            console.log('login successful');
            return res.redirect('/books');
        });
    }) (req, res, next);
    
};

exports.logout = (req, res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
    });
};