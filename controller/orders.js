import express from 'express'
import auth from '../middleware/auth.js'
import { Orders, Products } from '../database/connect.js'

const router = express.Router()

router.get('/', auth,  async (req, res) => {
    try {
        let orders = await Orders.find()

        for(let i = 0; i < orders.length; i++) {
            const product = await Products.findById(orders[i].product)
            orders[i].product = product.name
        }

        res.status(200).json(orders)
    } catch {
        res.sendStatus(202)
    }
})

router.post('/new', async (req, res) => {
    if(!req.body) {
        res.sendStatus(202)
        return 
    }

    if( req.body.product === '' ||
        req.body.fName === '' ||
        req.body.lName === '' ||
        req.body.address === '' ||
        req.body.city === '' ||
        req.body.phone === '' ||
        req.body.email === '' 
    ) {
        res.sendStatus(202)
        return
    } 

    try {
        const order = new Orders({
            product: req.body.product,
            fName: req.body.fName, 
            lName: req.body.lName,
            address: req.body.address,
            city: req.body.city,
            phone: req.body.phone,
            email: req.body.email,
            status: 0
        })

        await order.save()
        res.sendStatus(200)
    } catch {
        res.sendStatus(202)
    }
})

router.delete('/delete/:id', auth, async (req, res) => {
    const id = req.params.id

    try {
        await Orders.findByIdAndDelete(id)
        res.sendStatus(200)
    } catch {
        res.sendStatus(202)
    }
})

router.put('/status/:id/:status', auth, async (req, res) => {
    const id = req.params.id
    const status = req.params.status

    if(isNaN(status)) {
        res.sendStatus(202)
        return
    }

    try {
        await Orders.findByIdAndUpdate(id, { status })
        res.sendStatus(200)
    } catch {
        res.sendStatus(202)
    }
})

export default router