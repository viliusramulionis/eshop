import express from 'express'
import multer from 'multer'
import auth from '../middleware/auth.js'
import { Products, Orders } from '../database/connect.js'
import { access, mkdir } from 'fs/promises'

const router = express.Router()
const storage = multer.diskStorage({
    destination: async (req, file, callback) => {
        const path = './uploads'
        try {
            await access(path)
        } catch {
            await mkdir(path)
        }

        callback(null, path)
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extension = file.originalname.split('.')

        callback(null, uniqueSuffix + '.' + extension[extension.length - 1])
    }
})
const upload = multer({ 
    storage,
    fileFilter: (req, file, callback) => {
        if(
            file.mimetype === 'image/gif' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png'
        ) {
            callback(null, true)
        } else {
            callback(null, false)
        }
    }
})

router.get('/', async (req, res) => {
    try {
        const products = await Products.find()
        res.status(200).json(products)
    } catch(error) {
        res.status(202).send(error)
    }
})

router.get('/details/:id', auth, async (req, res) => {
    const id = req.params.id

    try {
        const product = await Products.findById(id)
        res.status(200).json(product)
    } catch {
        res.sendStatus(202)
    }
})

router.post('/new', auth, upload.single('photo'), async (req, res) => {
    if(!req.body) {
        res.sendStatus(202)
        return 
    }

    if( req.body.name === '' ||
        req.body.description === '' ) {
        res.sendStatus(202)
        return
    } 
    try {
        const product = new Products({
            name: req.body.name, 
            description: req.body.description,
            photo: req.file.filename
        })

        await product.save()
        res.sendStatus(200)
    } catch {
        res.sendStatus(202)
    }

})

router.put('/update/:id', auth, async (req, res) => {
    const id = req.params.id 
    
    if(!req.body) {
        res.sendStatus(202)
        return 
    }

    if( req.body.name === '' ||
        req.body.description === '' ) {
        res.sendStatus(202)
        return
    } 

    try {
        await Products.findByIdAndUpdate(id, {
            name: req.body.name, 
            description: req.body.description
        })

        res.sendStatus(200)
    } catch {
        res.sendStatus(202)
    }

})

router.delete('/delete/:id', auth, async (req, res) => {
    const id = req.params.id

    try {
        await Products.findByIdAndDelete(id)
        res.sendStatus(200)
    } catch {
        res.sendStatus(202)
    }
})

export default router