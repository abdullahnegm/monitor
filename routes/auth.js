const router = require('express').Router()
const {login, signup} = require('../controllers/authentication')

router.post('/login', login)
router.post('/signup', signup)

module.exports = router