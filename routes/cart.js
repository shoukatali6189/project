const express = require('express');
const { isLoggedIn } = require('../middleware');
const User = require('../models/User');
const Product = require('../models/product');
const router = express.Router();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// router.use(express.json())



router.get('/user/cart',isLoggedIn, async(req, res) => {
    let userId = req.user._id;
    let user = await User.findById(userId).populate("cart");
    // using method reduce
    let totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);
    res.render('cart/cart.ejs',{user,totalAmount})

})

router.post('/user/:productId/add',isLoggedIn, async (req, res) => {
    let { productId } = req.params;
   
    let userId = req.user._id;

    let user = await User.findById(userId);
    let product = await Product.findById(productId);

    user.cart.push(product);
    await user.save();

    res.redirect('/user/cart');
    
})

router.delete('/user/:productId/cart', async (req, res) => {
    try {

        let { productId } = req.params;
        let currentUser = req.user._id
        let user = await User.findByIdAndUpdate(currentUser, { $pull: { cart: productId } }, { new: true });
        req.flash('success', 'Product removed from cart');
        res.redirect('/user/cart');
        
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
    
   
});

router.get('/checkout', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'T-shirt',
            },
            unit_amount: 2000*100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:4242/success',
      cancel_url: 'http://localhost:4242/cancel',
    });
  
    res.redirect(303, session.url);
  });
  

module.exports = router;