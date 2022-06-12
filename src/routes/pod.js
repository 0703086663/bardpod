const express = require('express');
const router = express.Router();

const podController = require('../Controllers/PodController');

const {isLoggined} = require('../ulti/login')
var cookieParser = require('cookie-parser')
router.use(cookieParser())

// [GET] /pod/add-to-cart:id pod
router.get('/add-to-cart/:id', podController.addToCart)

// [GET] /pod/checkout pod
router.get('/checkout', podController.checkout)

// [GET] /pod/newarrival pod
router.get('/newarrival', podController.newarrival)

// [GET] /pod/cheappod pod
router.get('/cheappod', podController.cheappod)

// [GET] /pod/expensivepod pod
router.get('/expensivepod', podController.expensivepod)

// [GET] /pod/bestseller pod
router.get('/bestseller', podController.bestseller)

// [GET] /pod/available pod
router.get('/available', podController.available)

// [GET] /pod/finding pod
router.get('/finding', podController.finding)

// [GET] /pod/:id/ pod
router.get('/:id', podController.show)

// [PUT] /pod/:id/update pod
router.put('/:id', podController.update)

// [PATCH] /pod/:id/update pod
router.patch('/:id/restore', podController.restore)

// [DELETE] /pod/:id/detele pod
router.delete('/:id', podController.delete)
router.delete('/:id/force', podController.force)

// [POST] /pod/store pod
router.post('/store', podController.store)

// [GET] /pod INDEX
router.get('/', podController.index)

module.exports = router;