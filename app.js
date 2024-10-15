require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const app = express();
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const Book = require('./models/Book');
const bookRouter = require('./routs/bookRout');
const authRouter = require('./routs/auth');

const xss = require('xss-clean');
const helmet = require('helmet');

passport.use(new LocalStrategy(async (username, password, done)=>{
    try{
        const user = await User.findOne({username});
        if(!user) return done(null, false, {message:'User name is not found, try again'});
        const isMatch = await user.comparePassword(password);
        if(!isMatch) return done(null, false, {message:'Password is not match, try again'});
        return done(null, user);
    } catch(err){
        return done(err);
    }
}));

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser(async(id, done)=>{
    try{
        const user = await User.findById(id);
        done(null, user);
    }catch(err){
        done(err);
    }
});

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(xss());

app.use( session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use('/auth', authRouter);
app.use('/books', bookRouter);

app.get('/register', (req,res)=>{
    res.render('register', {error_msg:req.flash('error_msg')});
});

app.get('/login', (req,res)=>{
    res.render('login', {error_msg:req.flash('error_msg')});
});

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log('Mongo DB connected'))
.catch(err=> console.log('err'));


app.get('/', (req, res)=>res.send('Book Exchange app'));

app.use((err, req,res,next)=>{
    console.error(err.stack);
    res.status(500).send("Something is wrong");
});


const PORT = process.env.PORT||3000;
app.listen(PORT,()=>console.log(`Server is listenen on port ${PORT}`));