import express from 'express'
import session from 'express-session'
import path from 'path'
import authenticate from './controller/authenticate.js'
import products from './controller/products.js'
import orders from './controller/orders.js'

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
app.use('/authenticate', authenticate)
app.use('/products', products)
app.use('/orders', orders)

app.use('/uploads', express.static('uploads'))

//Titulinis puslapis
app.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/index.html'))
})

//Login puslapis
app.get('/login', (req, res) => {
    if(req.session.loggedIn) {
        res.redirect('/admin')
        return false
    }
    res.sendFile(path.resolve('./public/login.html'))
})

//Admin puslapis
app.get('/admin', (req, res) => {
    if(!req.session.loggedIn) {
        res.redirect('/login')
        return false
    }
    res.sendFile(path.resolve('./public/admin.html'))
})

app.listen(port)