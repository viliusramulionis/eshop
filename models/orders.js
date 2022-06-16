import mongoose from 'mongoose'

export default new mongoose.Schema({
    product: String,
    fName: String,
    lName: String,
    address: String,
    city: String,
    phone: String,
    email: String,
    status: Number
})