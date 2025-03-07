const express = require('express');
const Product = require('../models/product');
const Review = require('../models/review');
const {validateReview, isLoggedIn} = require('../middleware');
const User = require('../models/User');

const router = express.Router();
router.use(express.json())

router.post('/products/:productId/review' ,isLoggedIn, validateReview, async(req,res)=>{
        try{
                let {productId} = req.params;
                let { rating, comment } = req.body;
                          
                const product = await Product.findById(productId);

                const review = new Review({
                        rating, comment,
                        user: {
                                
                                username: req.user.username
                            }
                 });
                product.reviews.push(review); //mongodb internally isme se id nikaal kr usse push krdega.
                // console.log(review);
                await review.save();
                await product.save();
                
                req.flash('success' , 'Review added successfully');
                res.redirect(`/products/${productId}`)
        }
        catch(e){
                res.status(500).render('error' ,{err:e.message})
        }      
    
})

router.delete('/products/remove/:productId',isLoggedIn,async(req, res) => {
        let { productId } = req.params;
        const product = await Product.findById(productId);

        for(let id of product.reviews){
            await Review.findByIdAndDelete(id);
        }
        res.redirect(`/products/${productId}`)
})










module.exports = router;