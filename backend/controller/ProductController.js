const Product = require('../model/ProductModel')
const catchAsyncError = require('../middleware/catchAsyncErrors')
const Features = require ('../utils/Features')

exports.createProduct = catchAsyncError(async(req,res,next)=>{
    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
})
//update-admin

exports.updateProduct = catchAsyncError(async (req,res)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
        return res.status(500).json({
            success:false,
        message:"product not found"
        })
        
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators:true,
        useUnified:false
    })

    res.status(200).json({
        success:true,
        product
    })
    
})
//delete
exports.deleteProduct=catchAsyncError(async (req, res)=>{
    Product.findByIdAndRemove(req.params.id).then(product =>{
        if(product) {
            return res.status(200).json({success: true, message: 'the product is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "product not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})
//getall - admin
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });
  //getallprod - user
exports.getAllProducts = catchAsyncError(async (req, res) => {
    const resultPerPage = 8;
    const productCount =  await Product.countDocuments()
    const feature = new Features(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage)
    const products = await feature.query;
    res.status(200).json({
      success: true,
      products,
      productCount,
      resultPerPage
      
    })
});

//single prod details

exports.getSingleProduct =catchAsyncError( async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            success:false,
            message:"Product not found"
        })
    }
    res.status(200).json({
        success:true,
        product,
        productCount
    })
})
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });
  // Get All reviews of a single product
  exports.getSingleProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
        return res.status(400).json({
            success:false,
            message:"Product not found"
        })
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });
// Delete Review --Admin
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
        return res.status(400).json({
            success:false,
            message:"Product not found"
        })
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });
  
