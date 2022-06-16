import mongoose from 'mongoose'
import orders from '../models/orders.js'
import products from '../models/products.js'

mongoose.connect('mongodb+srv://vilius:1234@cluster0.8ey80yw.mongodb.net/Eshop?retryWrites=true&w=majority', (error) => {
    if(error) {
        console.log('Nepavyko prisijungti prie duomenų bazės: ' + error)
        return
    }
})

export const Orders = mongoose.model('Orders', orders)
export const Products = mongoose.model('Products', products)