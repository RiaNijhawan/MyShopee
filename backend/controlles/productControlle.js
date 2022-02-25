const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const CatchAsyncErrorHandler = require('../middleware/catchAsyncErrors');
const ApiFeatuers = require('../utils/apiFeatures');



// Create Product --Admin

exports.createProduct = CatchAsyncErrorHandler(async (req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
        message: 'Product successfully created'
    });
});

exports.updateProduct = CatchAsyncErrorHandler( async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found",404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({success: true, product});
});


exports.gettAllProducts = CatchAsyncErrorHandler(async (req, res, next) => {
    const resultPerPage = req.query.limit || 3;
    const productCount = await Product.countDocuments();
    const apiFeautre = new ApiFeatuers(Product.find(), req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeautre.query;
    res.status(200).json({ sucess: true, products, productCount });
});

// delete a product --Admin

exports.deleteProduct = CatchAsyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }
    await product.remove();
    res.status(200).json({ success: true, message: 'Product successfully deleted' });

});

// get a single product

exports.getPoductById = CatchAsyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }
    res.status(200).json({ success: true, product });
});

// Create product review

exports.createProductReview=CatchAsyncErrorHandler(async (req, res, next) => {
    const { rating, comments, productId } = req.body; 
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating :Number(rating),
        comments,
    };
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(review => review.user.toString() === req.user.id.toString());
    if(isReviewed){
        product.reviews.forEach(rev => {
            if(rev.user.toString() === req.user.id.toString()){
                rev.rating = rating;
                rev.comments = comments;
            }
        })
    }else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;

    }
    let avg = 0;
    product.reviews.forEach(rev => { avg += rev.rating })
    product.ratings =  avg / product.reviews.length;
    await product.save({ validateBeforeSave: false }); 
    res.status(200).json({ success: true });
});
 
 // Get All Reviews

exports.getReviews = CatchAsyncErrorHandler(async function (req, res, next) {
    const product = await Product.findById(req.query.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }
    res.status(200).json({ success: true, reviews: product.reviews });
});


// delete a review 
exports.deleteReviewById= CatchAsyncErrorHandler(async function (req, res, next) {
    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
    let avg = 0;
    reviews.forEach(rev => { avg += rev.rating })
    const ratings = avg / reviews.length;
    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews, ratings, numOfReviews
    },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false
        }
    );

    await product.save({ validateBeforeSave: false });
    res.status(200).json({ success: true });
});
 