const express = require('express') 
const router = express.Router()
const {shortenUrl , redirectToUrl , testing} = require('../controllers/urlContrleers')
router.post('/short' , shortenUrl)

router.post('/redirect' , redirectToUrl)

router.get('/testing' , testing)

module.exports = router