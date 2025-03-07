const mongoose =  require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating:{
        type:Number,
        min:0,
        max:5

    },
    comment:{
        type:String,
        trim:true
    },
    user: {
        // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: { type: String, required: true }
    }

} , {timestamps:true})
let Review = mongoose.model('Review' , reviewSchema);
module.exports = Review;