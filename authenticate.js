var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var jwtStrategy = require('passport-jwt').Strategy;
var extractJwt = require('passport-jwt').ExtractJwt;
var jsonWebToken = require('jsonwebtoken');
var config = require('./config');
var FacebookTokenStrategy = require('passport-facebook-token');

//console.log('inside auth 1');

/**
 * 
 * localstrategy and session. though session not used
 * 
 */

module.exports.local = passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//console.log('inside auth 1');


/**
 * 
 * configure jsonwebtoken strategy for passport
 * 
 */

module.exports.getToken = function (user) {
    return jsonWebToken.sign(user, config.secretKey, { expiresIn: 3600 });
}

var options = {
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey
}

module.exports.jwtPassportAuth = passport.use(new jwtStrategy(options, (jwt_payload, done) => {
    console.log('JWT payload: ', jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
            return done(err, false);
        }
        else if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    })
}));

module.exports.verifyUser = passport.authenticate('jwt', { session: false });

/**
 * 
 * checking admin
 * 
 */

module.exports.verifyAdmin = function (req, res, next) {
    if (req.user.admin) {
        return next();
    }
    else {
        let err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        return next(err);
    }
}

/**
 * 
 * configure facebook token strategy for passport
 * 
 */
module.exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accesstoken, refreshtoken, profile, done) => {
    User.findOne({ facebookId: profile.id }, (err, user) => {
        if (err) {
            return done(err, false);
        }
        else if (!err && user !== null) {
            return done(null, user);
        }
        else {
            user = new User({ username: profile.displayName });
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.facebookId = profile.id;
            user.save((err, user) => {
                if (err) {
                    return done(err, false);
                }
                else {
                    return done(null, user);
                }
            })
        }
    })
}))

//console.log('inside auth 1');