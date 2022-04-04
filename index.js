const express = require('express')
const app = express()

const bodyParser = require('body-parser')

// Dabatabses
require('./connections/mongo')

// Redis
// const redisDB  = require('./services/redis')
// const redisCon = new redisDB() 

// Configs
require('dotenv').config()
app.use(bodyParser.json());

// Middlewares
const authUser = require('./middilewares/auth')

// Require routers
const authRouter = require('./routes/auth')
const targetRouter = require('./routes/targets')

app.use('/auth', authRouter)
app.use('/targets', authUser, targetRouter)

app.listen(3000, () => {
    console.log("Server is up and running")
})
