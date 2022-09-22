const Cart = require ('../model/CartModel')
const WishList = require ('../model/WishListModel')
const catchAsyncError = require("../middleware/catchAsyncErrors");
// Add to wishlist
exports.addToWishlist = catchAsyncError(async (req, res, next) => {
    const {
      productName,
      quantity,
      productImage,
      productPrice,
      userId,
      productId,
      Stock,
    } = req.body;
    const wishList = await Wishlist.create({
      productName,
      quantity,
      productImage,
      productPrice,
      userId,
      productId,
      Stock,
    });
  
    res.status(200).json({
      success: true,
      wishList,
    });
  });
  
  // get wishlistData Data
  exports.getWishlistData = catchAsyncError(async (req, res, next) => {
    const wishlistData = await Wishlist.find({ userId: req.user.id });
  
    res.status(200).json({
      success: true,
      wishlistData,
    });
  });
  
  // remove wishlistData
  exports.removeWishlistData = catchAsyncError(async (req, res, next) => {
    const wishlistData = await Wishlist.findById(req.params.id);
  
    if (!wishlistData) {
        return res.status(404).json({
            success:false,
        message:"no data  found"
        })
    }
  
    await wishlistData.remove();
  
    res.status(200).json({
      success: true,
      message: "Item removed from wishlist",
    });
  });
  
  // add To Cart
  exports.addToCart = catchAsyncError(async (req, res, next) => {
    const {
      productName,
      quantity,
      productImage,
      productPrice,
      userId,
      productId,
      Stock,
    } = req.body;
    const cart = await Cart.create({
      productName,
      quantity,
      productImage,
      productPrice,
      userId,
      productId,
      Stock,
    });
  
    res.status(200).json({
      success: true,
      cart,
    });
  });
  
  // update Cart
  exports.updateCart = catchAsyncError(async (req, res, next) => {
    const {
      quantity,
    } = req.body;
    const cart = await Cart.findByIdAndUpdate(req.params.id);
  
    if (!cart) {
        return res.status(404).json({
            success:false,
        message:"cart not found"
        })
    }
  
    await cart.update({
      quantity,
    });
  });
  
  // get Cart Data
  exports.getCartData = catchAsyncError(async (req, res, next) => {
    const cartData = await Cart.find({ userId: req.user.id });
    res.status(200).json({
      success: true,
      cartData,
    });
  });
  
  // remove Cart Data
  exports.removeCartData = catchAsyncError(async (req, res, next) => {
    const cartData = await Cart.findById(req.params.id);
  
    if (!cartData) {
        return res.status(404).json({
            success:false,
        message:"item not found"
        })
    }
  
    await cartData.remove();
  
    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  });
