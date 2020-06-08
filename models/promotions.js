const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const currecny = mongoose.Types.Currency;


const Schema = mongoose.Schema;

const promotionSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        label: {
            type: String,
            default: ''
        },
        price: {
            type: currecny,
            required: true,
            min: 0
        },
        description: {
            type: String,
            required: true
        },
        featured: {
            type: Boolean,
            default: true
        }
    }
);

const promotion = mongoose.model('promotion', promotionSchema);

module.exports = promotion;