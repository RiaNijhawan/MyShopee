const express = require('express');
const {registerUesr, loginUser, logout, forgetPassword,updateUserRole, resetPassword,getAllUserDetails,getSingleUser, getUserDetails, updateUserPassword, updateUserProfile, deleteUser} = require('../controlles/userController')
const router = express.Router();
const { isAuthenticatedUser,authRoles } = require('../middleware/auth');

router.route("/register").post(registerUesr);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updateUserPassword);
router.route("/me/update").put(isAuthenticatedUser, updateUserProfile);
router.route("/admin/users").get(isAuthenticatedUser, authRoles("admin"), getAllUserDetails);
router.route("/admin/user/:id").put(isAuthenticatedUser, authRoles("admin"), updateUserRole);
router.route("/admin/user/:id").get(isAuthenticatedUser, authRoles("admin"), getSingleUser);
router.route("/admin/user/:id").delete(isAuthenticatedUser, authRoles("admin"),deleteUser);
router.route("/logout").get(logout);

module.exports = router;
