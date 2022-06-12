
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Brand = require('../models/Brand')
const Podtype = require('../models/Podtype')
const Pod = require('../models/Pod')
const {mongooseToObject, multipleMongooseToObject} = require('../ulti/mongoose')



var secret = 'secretpasstoken'
class AdminController {
    
    // [GET] /index -- Home page
    index(req, res, next){

        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        User.findOne({ _id: decodeToken})
        .then(data => {
            if (data) {
                req.data = data
                // console.log(data)
                return res.render('admin',
                    {
                        user: mongooseToObject(data),
                        layout: 'adminLayout',
                        title: 'Dashboard'
                    })
                next()
            }
        })
    }

    // // [GET] /logout --> Home page
    // logout (req, res) {
    //     req.logout();
    //     res.redirect('login');
    // }

    // [GET] /:slug
    // Show 404 not found error
    error(req,res,next){
        // res.render('partials/error', {
        //     title: 'Not Found',
        //     layout: null
        // });
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        User.findOne({ _id: decodeToken})
        .then(data => {
            if (data) {
                req.data = data
                return res.render('partials/error',
                    {
                        user: mongooseToObject(data),
                        title: 'Not Found',
                        layout: null
                    })
                next()
            }
        })
    }

    // [GET] /admin/user-table
    userTable(req,res,next){
        
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        Promise.all([User.find(), User.findOne({_id:decodeToken})])
        .then(([userList, data]) => {
            if (data) {
                req.data = data
                return res.render('admin/user-table',
                    {
                        user: mongooseToObject(data),
                        userList: multipleMongooseToObject(userList),
                        layout: 'adminLayout',
                        title: 'User Management'
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.redirect('/login')
        })
        // res.render('admin/user-table', {
        //     title: 'User Table',
        //     layout: 'adminLayout'
        // });
    }

    // [GET] /admin/product-table
    productTable(req,res,next){      
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        Promise.all([Product.find(), User.findOne({_id:decodeToken})])
        .then(([productList, data]) => {
            if (data) {
                req.data = data
                return res.render('admin/product-table',
                    {
                        user: mongooseToObject(data),
                        productList: multipleMongooseToObject(productList),
                        layout: 'adminLayout',
                        title: 'Product Management'
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.redirect('/login')
        })
    }

    // [GET] /admin/brand-table
    brandTable(req,res,next){      
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        Promise.all([Brand.find({}).sort({'createdAt': -1}), 
            Brand.findDeleted({}).sort({'createdAt': -1}),
            User.findOne({_id:decodeToken})])
        .then(([brandList, 
            brandDeletedList,
            data]) => {
            if (data) {
                req.data = data
                return res.render('admin/brand-table',
                    {
                        user: mongooseToObject(data),
                        brandDeletedList: multipleMongooseToObject(brandDeletedList),
                        brandList: multipleMongooseToObject(brandList),
                        layout: 'adminLayout',
                        title: 'Brand Management'
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.redirect('/login')
        })
    }


    // [GET] /admin/podtype-table
    podtypeTable(req,res,next){      
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        Promise.all([Podtype.find(), Podtype.findDeleted(), User.findOne({_id:decodeToken})])
        .then(([podtypeList, podtypeDeleted, data]) => {
            if (data) {
                req.data = data
                return res.render('admin/podtype-table',
                    {
                        user: mongooseToObject(data),
                        podtypeList: multipleMongooseToObject(podtypeList),
                        podtypeDeleted: multipleMongooseToObject(podtypeDeleted),
                        layout: 'adminLayout',
                        title: 'Pod Type',
                        deletedTitle: 'Deleted Types'
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.redirect('/login')
        })
    }

    // [GET] /admin/pod-table
    podTable(req,res,next){      
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        Promise.all([
            User.findOne({_id:decodeToken}),
            Pod.find().populate('brand').populate('type'), 
            Pod.findDeleted().populate('brand').populate('type'), 
            Brand.find({}),
            Podtype.find({})
        ])
        .then(([
            data,
            podList, 
            podDeleted, 
            brandList,
            podtypeList
        ]) => {
            if (data) {
                req.data = data
                return res.render('admin/pod-table',
                    {
                        user: mongooseToObject(data),
                        podList: multipleMongooseToObject(podList),
                        podDeleted: multipleMongooseToObject(podDeleted),
                        brandList: multipleMongooseToObject(brandList),
                        podtypeList: multipleMongooseToObject(podtypeList),
                        layout: 'adminLayout',
                        title: 'Pod',
                        deletedTitle: 'Deleted Pod'
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.redirect('/login')
        })
    }
}

module.exports = new AdminController;

const res = require('express/lib/response');
const adminController = require('./AdminController');