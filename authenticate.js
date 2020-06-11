var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var jwtStrategy = require('passport-jwt').Strategy;
var extractJwt = require('passport-jwt').ExtractJwt;
var jsonWebToken = require('jsonwebtoken');
var config = require('./config');

//console.log('inside auth 1');

module.exports.local = passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//console.log('inside auth 1');

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

//console.log('inside auth 1');