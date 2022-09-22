const express = require("express");
const {
  createUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  userDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controller/UserController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser, userDetails);
router.route("/me/updatepass").put(isAuthenticatedUser, updatePassword);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser);
router
  .route("/admin/user")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/me/update/info").put(isAuthenticatedUser, updateProfile);
router
  .route("/admin/user/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole);
  router
 
  
module.exports = router;
