const express = require('express') 
const router = express.Router()
const {shortenUrl , redirectToUrl} = require('../controllers/urlContrleers')
router.post('/short' , shortenUrl)

router.post('/redirect' , redirectToUrl)

module.exports = router