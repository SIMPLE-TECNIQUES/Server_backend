const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/userSchema')
require('dotenv').config();
const SECRET_KEY = 'super-secret-key'

//connect to express app
const app=express()

//connect to Mongodb
const dbURI=process.env.MONGODB_URI;
mongoose.connect(dbURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).
then(()=>{
    app.listen(8000,()=>{
        console.log('server connected to port 8000 and connnected to mongodb')
    })  
})
.catch((error)=>{
    console.log('unable to connect to server and mongodb')
})
//middleware
app.use(bodyParser.json())
app.use(cors())
// schema

//Routes
//post register
app.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ email, username, password: hashedPassword })
        await newUser.save()
        res.status(201).json({ message: 'User created successfully' })
    } 
    catch (error) {
        res.status(500).json({ error: 'Error signing up' })
    }
})

// Get register
app.get('/register', async (req, res) => {
    try {
        const users = await User.find()
        res.status(201).json(users)
        
    } catch (error) {
        res.status(500).json({ error: 'Unable to get users' })
    }
})

//LOGIN

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials'})
        }
        //chnages
        // user.currentUsername = username;
        // await user.save();
        // changes
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        const token = jwt.sign({ userId: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1hr' })
        res.json({
            //  message: 'Login successful'
            token,user
     })
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' })
    }
})

