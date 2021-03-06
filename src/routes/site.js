const express = require('express');
const router = express.Router();

const siteController = require('../Controllers/SiteController');

const {isLoggined} = require('../ulti/login')
var cookieParser = require('cookie-parser')
router.use(cookieParser())

// [GET] /cart/
router.get('/cart', siteController.cart)

// [POST] /checkout/
router.post('/checkout', isLoggined, siteController.checkout)

// [POST] /logout/
router.post('/logout', siteController.logout)

// [GET] /login/
router.get('/login', siteController.login)

// [GET] /register/
router.use('/register', siteController.register)

// [GET] /authonize/
router.use('/authonize', siteController.authonize)

// [POST] /validation
router.post('/validation', siteController.validation)

// [POST] /store
router.post('/store', siteController.store)

// [GET] /error/:slug
router.use('/:slug', siteController.error)

// Index
router.use('/', siteController.index)


module.exports = router;