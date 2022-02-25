const express = require('express');
const { newOrder,getAllOrders, getOrder, myOrder, updateOrderStatus, deleteOrder } = require('../controlles/orderController');
const router = express.Router();
const {isAuthenticatedUser, authRoles} = require('../middleware/auth');



router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOrder);
router.route("/admin/orders").get(isAuthenticatedUser, authRoles('admin'), getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedUser, authRoles('admin'), updateOrderStatus).delete(isAuthenticatedUser, authRoles('admin'), deleteOrder);
module.exports = router;