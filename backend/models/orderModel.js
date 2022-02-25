const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    shipingInfo: {
        adresses: {
            type: String,
            required: [true, 'Please add a adresses'],
        },
        city: {
            type: String,
            required: [true, 'Please add a city'],
        },
        state: {
            type: String,
            required: [true, 'Please add a state'],
        },
        country: {
            type: String,
            required: [true, 'Please add a country'],
            default: "INDIA"
        },
        pinCode: {
            type: Number,
            required: [true, 'Please add a pin code'],
        },
        phoneNumber: {
            type: Number,
            required: [true, 'Please add a phone number'],
        }
    },
    orderItems: [
        {
            name: {
                type: String,
                required: [true, 'Please add a name'],
            },
            quantity: {
                type: Number,
                required: [true, 'Please add a quantity'],
            },
            price: {
                type: Number,
                required: [true, 'Please add a price'],
            },
            image: {
                type: String,
                required: [true, 'Please add a image'],
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true
            },
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    paidAt: {
        type: Date,
        required: true
    },
    itmePrice: {
        type: Number,
        required: true,
        default: 0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0
    },
    shipingPrice: {
        type: Number,
        required: true,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Pending",
    },
    deliveredAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});


const Order = mongoose.model('Order', orderSchema);
module.exports = Order;