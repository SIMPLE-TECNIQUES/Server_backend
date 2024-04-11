const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({ 
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    //
    currentProduct: { type: String }, // Add current product field
    currentPrice: { type: Number },
    currentItemTitle: { type: String }, // Add field for item title
    currentItemPrice: { type: Number } // Add field for item price
    //
 })

 const User = mongoose.model('User', userSchema)

 module.exports = User