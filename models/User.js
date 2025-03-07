const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Username - PLM (passport- local-mongoose ) --> Passport-Local Mongoose is a Mongoose plugin that simplifies building username and password .
    // password - also
    email: {
        type: String,
        trim: true,
        require:true
    },
    role: {
        type: String,
        default:'buyer'
    },
    gender: {
        type: String,
        trim: true,
        require:true
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ],
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ]
    
})
userSchema.plugin(passportLocalMongoose); // always applay in Schema


let User = mongoose.model('User', userSchema)
module.exports = User; 
