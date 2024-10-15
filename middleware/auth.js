const passport = require('passport');

const ensureAuthenticated = (req, res, next)=>{
    console.log('User:', req.user);
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg', 'Please login for an access');
    res.redirect('/login');
};

module.exports = ensureAuthenticated;