require('dotenv').config()
const bcrypt = require('bcrypt');
 

const express = require('express');
const nodemailer = require('nodemailer');
const emailConfig = require('./config');


const app = express();
const port = 8080;


// This structure ensures that the Nodemailer transporter is created and configured when your application starts, and it will be available for use in any route handler or middleware that needs to send emails.

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailConfig.email,
      pass: emailConfig.password,
    },
  });


const path = require('path');
// let ejs = require('ejs');
const mongoose = require('mongoose');
const seedDb = require('./seed.js');
const engine = require('ejs-mate');
const methodOverride = require('method-override')



const BlogRoutes = require('./routes/blog.js')
const ReviewRoutes = require('./routes/review.js')
const AuthRoutes = require('./routes/auth.js')

const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');


mongoose.connect('mongodb://127.0.0.1:27017/Blogging-App').then(() => {
    console.log('db connected');
}).catch((err) => {
    console.log("DB Error");
    console.log(err);
})

// for setting up session
let configSession = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie :{
        httpOnly: true,
        expires: Date.now() + 24*7*60*60*1000,
        maxAge: 24*7*60*60*1000
    }
}



app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(methodOverride('_method')) // for sending patch request 

app.set('views', path.join(__dirname, 'views')); // views folder
app.use(express.static(path.join(__dirname, 'public'))); // public folder
app.use(express.urlencoded({ extended: true }))  // middleware for post request

app.use(session(configSession)); 


app.use(passport.session());
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

// middleware for flash msgs so that we don't need to write flash msgs in every file
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.use(BlogRoutes); // so that har incoming request par check kiya jaye
app.use(ReviewRoutes);
app.use(AuthRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to our blogging app');
})

app.listen(port, () => {
    console.log('listening at port 8080');
})



// seeding database (running only for fisrt tym)
// seedDb();