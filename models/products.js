import mongoose from 'mongoose'

export default new mongoose.Schema({
    name: String,
    description: String,
    photo: String
})