const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dishesSchema = new Schema(
    {
        dish: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish'
        }
    },
    {
        timestamps: true
    }
)

const favouriteSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        dishes: [dishesSchema]
    },
    {
        timestamps: true
    }
)

const favourite = mongoose.model('Favourite', favouriteSchema);

module.exports = favourite;