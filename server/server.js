const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

const auth = require('./routes/auth');
const cinema = require('./routes/cinema');
const theater = require('./routes/theater');
const movie = require('./routes/movie');
const showtime = require('./routes/showtime');
const quoteRoutes = require('./routes/quotes');

mongoose.set('strictQuery', false);
mongoose
	.connect(process.env.DATABASE, { autoIndex: true })
	.then(() => {
		console.log('mongoose connected!');
	})
	.catch((err) => console.log(err));

const app = express();

// Passport configuration
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Local Strategy for login with username and password
passport.use(
	new LocalStrategy((username, password, done) => {
		// Example logic, replace with your DB logic
		if (username !== 'test_user') {
			return done(null, false, { message: 'User not found' });
		} else if (password !== 'test_password') {
			return done(null, false, { message: 'Wrong password' });
		}
		return done(null, { id: 1, name: 'Test User' });
	})
);

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));


// Google OAuth Strategy
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: 'http://localhost:5173/auth/google/callback',
		},
		(accessToken, refreshToken, profile, done) => {
			return done(null, profile);
		}
	)
);

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(session({ secret: 'your secret key', resave: false, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', auth);
app.use('/cinema', cinema);
app.use('/theater', theater);
app.use('/movie', movie);
app.use('/showtime', showtime);
app.use('/api', quoteRoutes);

// Google OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
app.get(
	'/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/login', successRedirect: 'http://localhost:5173/login' })
);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`start server in port ${port}`));
