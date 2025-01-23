const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/User.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'faslksksk3455uuyu'

require('dotenv').config();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))

app.get('/test', (req, res) => {
    res.json('Test is ok')
})

app.get('/profile', (req, res) => {
    mongoose.connect(process.env.MONGO_URL)
    const { token } = req.cookies;
    if(token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if(err) throw err;
            const { name, email, _id } = await User.findById(userData.id);
            res.json({ name, email, _id })
        })
    } else {
        res.json(null)
    }
})

app.post('/register', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL)
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({ name, email, password: bcrypt.hashSync(password, bcryptSalt) })
        res.json(userDoc)
    } catch (error) {
        res.status(422).json(error)
    }
})

app.post('/login', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL)
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email })
    if(userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password)
        if(passOk){
            jwt.sign({ email: userDoc.email, id: userDoc._id}, jwtSecret, {}, (err, token) => {
                if(err) throw err;
                res.cookie('token', token).json(userDoc)
            })
        } else {
            res.status(422).json('Password is not ok')
        }
    } else {
        res.json('Not found')
    }
})

app.listen(4000);