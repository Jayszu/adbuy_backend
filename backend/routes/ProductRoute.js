const express = require('express')
const { getAllProducts, createProduct, updateProduct, deleteProduct, getSingleProduct, getAdminProducts, createProductReview, getSingleProductReviews, deleteReview } = require('../controller/ProductController')
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')

const router = express.Router()


router.route('/products').get(getAllProducts)
router.route('admin/products').get(getAdminProducts)
router.route('/products/new').post(isAuthenticatedUser,createProduct)
router.route('/products/:id').put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)
router.route('/products/:id').delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)
router.route('/products/:id').get(getSingleProduct)
router.route('/products/review').post(isAuthenticatedUser,createProductReview)
router.route('/reviews').get(getSingleProductReviews).delete(isAuthenticatedUser,authorizeRoles('admin'),deleteReview)

module.exports = router 