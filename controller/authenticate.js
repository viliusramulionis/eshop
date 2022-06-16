import express from 'express'

const router = express.Router()

const credentials = {
    email: 'vilius@bit.lt',
    password: '1234'
}

//Prisijungimo duomenu tikrinimas
router.post('/', (req, res) => {
    if( req.body?.email === credentials.email && 
        req.body?.password === credentials.password
    ) {
        req.session.loggedIn = true
        res.sendStatus(200)
    } else {
        res.sendStatus(401)
    }
})

export default router