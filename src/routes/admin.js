const express = require('express');
const router = express.Router();

const User = require('../models/User')
const {isLoggined, isAdmin, isStaff} = require('../ulti/login')
var cookieParser = require('cookie-parser')
router.use(cookieParser())

const adminController = require('../Controllers/AdminController');

// [GET] /admin/pod-table - ./admin/pod-table
router.use('/pod-table', isLoggined, isAdmin, adminController.podTable)

// [GET] /admin/podtype-table - ./admin/podtype-table
router.use('/podtype-table', isLoggined, isAdmin, adminController.podtypeTable)

// [GET] /admin/brand-table - ./admin/brand-table
router.use('/brand-table', isLoggined, isAdmin, adminController.brandTable)

// [GET] /admin/product-table - ./admin/product-table
router.use('/product-table', isLoggined, isAdmin, adminController.productTable)

// [GET] /admin/user-table - ./admin/user-table
router.use('/user-table', isLoggined, isAdmin, adminController.userTable)

// [GET] /admin/:slug - partials/error.hbs
router.use('/:slug', isLoggined, isAdmin, adminController.error)

// /admin/index - admin.hbs
router.use('/', isLoggined, isAdmin, adminController.index)


module.exports = router;