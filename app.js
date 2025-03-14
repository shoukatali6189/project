

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const seedDB = require('./seed');
const methodOverride = require('method-override');


const reviewRoutes = require("./routes/review");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cart");

// -----------------Lecture-62 code----------------//
const LocalStrategy = require('passport-local');  // for passwor

const authRoutes = require('./routes/auth');
const passport = require('passport')
// -----------------Lecture-64 code----------------//
const productApi = require('./routes/api/productaAPI');


//-----------------------------------------//
require('dotenv').config();
const session = require('express-session');
const flash = require("connect-flash");
const User = require('./models/User');  



const MongoStore = require('connect-mongo');
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{console.log("DB connected")})
.catch((err)=>{console.log(err,"server is not connected")}) 
 

app.set('view engine' , 'ejs'); 
app.set('views' , path.join(__dirname,'views'));
// now for public folder
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

// seeding dummy data
// seedDB();

// let configSession = {
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         htttponly: true,
//         expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//         maxAge :7 * 24 * 60 * 60 * 1000,
//     }
// }
let configSession = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/myDatabase',
        collectionName: 'sessions',
        ttl: 7 * 24 * 60 * 60 // Session expiry time (7 days)
    }),
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
};

app.use(session(configSession));



app.use(flash());


//----------------------------------------Lecture-62 code --------------------------------------------------------------//
app.use(passport.initialize()); // passposr got the initialize of session 
app.use(passport.session()); // passport to use session
passport.serializeUser(User.serializeUser()); // for password
passport.deserializeUser(User.deserializeUser()); // for password
passport.use(new LocalStrategy(User.authenticate())); // for password

app.use((req, res, next) => {
    res.locals.currentUser = req.user; // lecture-63 code store use details
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Routes
app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(productApi);
app.use(cartRoutes);

// lecture-65 --> codee
app.get('/', (req, res) => {
    res.render('home')
})



//----------------------------------------------------------------------------------------------------//
const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`server connected at port : ${PORT}`);
})

//----------------------------------------------------------------------------------------------------//
// user specification 
// 1 --> created a wish list and like button  --> with the help of AHAX-request