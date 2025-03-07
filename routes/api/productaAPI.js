// its for wish list
// ---> when we need data + page we use --> routes
// ---> hen we need only data  we use --> api



const express = require('express');
const { isLoggedIn } = require('../../middleware');
const User = require('../../models/User');
const router = express.Router();

router.post('/products/:productId/like',isLoggedIn, async (req, res) => {
    // console.log(req.params);
    let { productId } = req.params;
    let user = req.user;
    // its show the empty arry because of Schema is define bu id is not push on their // its now show in the older user is show on the new user.
    let isLike = user.wishlist.includes(productId)
    // console.log(productId);
    
    // console.log(isLike); // its check the vale of wishlist that id is prest or not --> return --> true false
    if (isLike) {
        await User.findByIdAndUpdate(req.user._id,{$pull : {wishlist:productId}}) // $pull : --> remove
    } else {
        await User.findByIdAndUpdate(req.user._id,{$addToSet : {wishlist:productId}}) // $addToSet : --> add --> if add do nothing
    }
  

})
// we us to isLoggedIn to validate the request --> so for check the --> req.xhr in "isLoggedIn" middele where


module.exports = router;