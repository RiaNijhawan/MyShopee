const express = require('express');
const { gettAllProducts,getReviews,deleteReviewById, createProduct,createProductReview, updateProduct, deleteProduct, getPoductById } = require('../controlles/productControlle');
const router = express.Router();
const {isAuthenticatedUser, authRoles} = require('../middleware/auth');

router.route("/products").get(gettAllProducts);
router.route("/products/:id").get(getPoductById);
router.route("/admin/products/new").post(isAuthenticatedUser,authRoles("admin"),createProduct);
router.route("/admin/products/:id").put(isAuthenticatedUser, authRoles("admin"), updateProduct);
router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(getReviews).delete(isAuthenticatedUser,deleteReviewById);
router.route("/admin/products/:id").delete(isAuthenticatedUser,authRoles("admin"),deleteProduct);;

module.exports = router;