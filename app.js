const express         = require('express');
const app             = express();
const mongoose        = require('mongoose');
const path            = require('path');
const method_override = require('method-override');
const ejs_mate        = require('ejs-mate');
const session         = require('express-session');
const flash           = require('connect-flash');
const ExpressError    = require('./utils/ExpressError');
const campRoutes      = require('./routes/campRoutes');
const revRoutes       = require('./routes/revRoutes');
const authRoutes      = require('./routes/auth');
const passport        = require('passport');
const LocalStatergy   = require('passport-local');
const User            = require('./models/user');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp-new', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})
.then(() => {
    console.log('Connection Open');
})
.catch((error) => {
    console.log(`error - ${error}`);
});

const sessionCatalog = {
    secret: 'thisisthesecretused', 
    resave: false, 
    saveUninitialized: false,
    cookie: {   //cookie is an returning back cookie because of session
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(express.urlencoded({extended: true}));
app.use(method_override('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('ejs', ejs_mate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session(sessionCatalog));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStatergy(User.authenticate()));

passport.serializeUser(User.serializeUser());   //storing user in the session
passport.deserializeUser(User.deserializeUser());   //retriving user from the session

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

app.use('/', authRoutes);   
app.use('/campgrounds', campRoutes);
app.use('/campgrounds/:id/reviews', revRoutes);

app.listen(3000, () => {
    console.log('yelp camp new server started');
});

app.get('/', (req, res) => {
    console.log(req.user);
    res.render('index');
});

app.get('/campgound', (req, res) => {
    req.flash('error', 'You must sign in');
    res.redirect('/login');
});

app.get('/campground', async (req, res) => {
    const campsName = await Campground.find({});
    res.render('campgrounds/indexx', {campsName});
});

app.get('/campground/new', (req, res) => {
    res.render('campgrounds/news');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});
// docker run --rm -p 3000:3000 bkimminich/juice-shop