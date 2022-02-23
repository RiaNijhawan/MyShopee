const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        maxLength: [8, "Price should be less than 8 digits"]
    },
    ratings: {
        type: Number,
        default: 0,

    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'Please add a category'],
    },
    Stock: {
        type: Number,
        required: [true, 'Please add a Stock'],
        maxLength: [4, "Stock should be less than 4 digits"],
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true,
            },
            name: {
                type: String,
                required: [true, 'Please add a name'],

            },
            rating: {
                type: Number,
                required: [true, 'Please add a rating'],
            },
            comments: {
                type: String,
                required: [true, 'Please add a comment'],
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('Products', productSchema);