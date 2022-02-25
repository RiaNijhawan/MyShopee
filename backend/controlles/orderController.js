const Order = require('../models/orderModel');
const ErrorHandler = require('../utils/errorHandler');
const CatchAsyncErrorHandler = require('../middleware/catchAsyncErrors');
const ApiFeatuers = require('../utils/apiFeatures');
const Product = require('../models/productModel');

// create new orderv
exports.newOrder = CatchAsyncErrorHandler(async function (req, res, next) { 
    const { shipingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shipingPrice,
        totalPrice
    } = req.body;
    const order = await Order.create({
        shipingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shipingPrice,
        totalPrice,
        paidAt: new Date(),
        user:req.user._id
    });
    res.status(201).json({
        success: true,
        message: 'Order created successfully created',
        order
    });
});

// Get single order
exports.getOrder = CatchAsyncErrorHandler(async function (req, res, next) {
    const order = await Order.findById(req.params.id).populate('user',"name email");
    if (!order) return next(new ErrorHandler('Order not found', 404));
    res.status(200).json({
        success: true,
        order
    });
});

// get logged in user order
exports.myOrder = CatchAsyncErrorHandler(async function (req, res, next) {
    const orders = await Order.find({user:req.user._id});
    // if (!order) return next(new ErrorHandler('Order not found', 404));
    res.status(200).json({
        success: true,
        orders
    });
});

// get all orders -- Admin
exports.getAllOrders = CatchAsyncErrorHandler(async function (req, res, next) {
    const orders = await Order.find();
    let totalAmount = 0
    orders.forEach(order => {
        totalAmount += order.totalPrice;

    });
    // if (!order) return next(new ErrorHandler('Order not found', 404));
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});

// update order status
exports.updateOrderStatus = CatchAsyncErrorHandler(async function (req, res, next) {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ErrorHandler('Order not found', 404));
    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("Order already delivered", 400));
    }

    order.orderItems.forEach(async (order) => {
        await updateStock(order.product, order.quantity);
    });
    
    order.orderStatus = req.body.status;
    if (req.body.status == "Delivered") { 
        order.deliveredAt = new Date();
    }

    await order.save({ validateBeforeSave: false });
   
    res.status(200).json({
        success: true,
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.Stock = product.Stock - quantity;

    await product.save({ validateBeforeSave: false });
}

// delete order -- Admin 
exports.deleteOrder = CatchAsyncErrorHandler(async function (req, res, next) {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ErrorHandler('Order not found', 404));
    await order.remove();
    res.status(200).json({success: true, message: 'Order deleted successfully'});
})