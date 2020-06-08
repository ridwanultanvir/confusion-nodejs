const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const currecny = mongoose.Types.Currency;


const Schema = mongoose.Schema;

const leaderSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        designation: {
            type: String,
            required: true
        },
        abbr: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        featured: {
            type: Boolean,
            default: false
        }
    },
    {

    }
);

const leader = mongoose.model('leader', leaderSchema);

module.exports = leader;