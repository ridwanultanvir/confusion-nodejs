const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        admin: {
            type: Boolean,
            default: false
        },
        firstname: {
            type: String,
            default: ''
        },
        lastname: {
            type: String,
            default: ''
        },
        facebookId: {
            type: String,
            default: ''
        }
    }
);

userSchema.plugin(passportLocalMongoose); //adds username and hashed password in the userSchema 

const user = mongoose.model('user', userSchema);

module.exports = user;