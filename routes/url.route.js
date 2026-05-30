const express = require('express') 
const router = express.Router()
const {shortenUrl , redirectToUrl , testing} = require('../controllers/urlContrleers')
router.post('/short' , shortenUrl)

router.get('/redirect/:id' , redirectToUrl)

router.get('/testing' , testing)

module.exports = router