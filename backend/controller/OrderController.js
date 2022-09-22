const Order = require('../model/OrderModel')
const catchAsyncError = require('../middleware/catchAsyncErrors')

// Create Order
exports.createOrder = catchAsyncError(async (req,res,next) =>{

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order
    });
});
//  Get Single order
exports.getSingleOrder = catchAsyncError(async (req,res,next) =>{
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if(!order){
        return res.status(404).json({
            success:false,
        message:"order not found"
        })
    }

    res.status(200).json({
        success: true,
        order
    });
});
// Get all orders
exports.getAllOrders = catchAsyncError(async (req,res,next) =>{
    const orders = await Order.find({user: req.user._id});
    res.status(200).json({
        success: true,
        orders
    });
});
// Get All orders ---Admin
exports.getAdminAllOrders = catchAsyncError(async (req,res,next) =>{
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) =>{
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});
// update Order Status ---Admin
exports.updateAdminOrder = catchAsyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id);
  
    if (!order) {
        return res.status(404).json({
            success:false,
        message:"order not found"
        })
    }
  
    if (order.orderStatus === "Delivered") {
        return res.status(400).json({
            success:false,
        message:"order already Delivered"
        })
    }
  
    if (req.body.status === "Shipped") {
      order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
      });
    }
    order.orderStatus = req.body.status;
  
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }
  
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  });
  
  async function updateStock(id, quantity) {
      
    const product = await Product.findById(id);
  
    product.Stock -= quantity;
  
    await product.save({ validateBeforeSave: false });
  }

//del order
  exports.deleteOrder = catchAsyncError(async (req,res,next) =>{

    const order = await Order.findById(req.params.id);
    
    if(!order){
        return res.status(404).json({
            success:false,
        message:"order not found"
        })
    }

    await order.remove();

    res.status(200).json({
        success: true,
    });
});