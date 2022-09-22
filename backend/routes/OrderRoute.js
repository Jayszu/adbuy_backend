const express = require('express');
const { createOrder, getSingleOrder, getAllOrders, getAdminAllOrders, updateAdminOrder, deleteOrder } = require('../controller/OrderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')
const router = express.Router() 

router.route('/order/new').post(isAuthenticatedUser,createOrder)
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder)
router.route('/order/me').get(isAuthenticatedUser,getAllOrders)
router.route('/admin/orders').post(isAuthenticatedUser,authorizeRoles('admin'),getAdminAllOrders)
router.route('/admin/order/:id').put(isAuthenticatedUser,authorizeRoles('admin'),updateAdminOrder)
router.route('/admin/order/:id').delete(isAuthenticatedUser,authorizeRoles('admin'),deleteOrder)
module.exports = router;