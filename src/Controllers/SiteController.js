 
const User = require('../models/User')
const Brand = require('../models/Brand')
const Podtype = require('../models/Podtype')
const Pod = require('../models/Pod')
const Cart = require('../models/Cart')
const Order = require('../models/Order')

const { multipleMongooseToObject } = require('../ulti/mongoose')
const { mongooseToObject } = require('../ulti/mongoose')
const { checkUserExist, makePassword } = require('../ulti/register')

const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


class SiteController {

    // [GET] /index -- Home page
    index(req, res, next){
        if(req.cookies.token){
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Podtype.find({}),
                Pod.find({bestseller: true})
                    .populate('brand')
                    .populate('type')
                    .sort({createdAt: 1})
                    .limit(3),
                Pod.find({available: true})
                .populate('brand')
                .populate('type')
                .sort({createdAt: 1})
                .limit(3)
            ])
            .then(([
                data,
                brandList,
                podType,
                podBestseller,
                podAvailable
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('index',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            podType: multipleMongooseToObject(podType),
                            podBestseller: multipleMongooseToObject(podBestseller),
                            podAvailable: multipleMongooseToObject(podAvailable),
                            title: 'Home page'
                        })
                    next()
                }
            })
        }
        else {
            Promise.all([
                Brand.find({}),
                Podtype.find({}),
                Pod.find({bestseller: true})
                    .populate('brand')
                    .populate('type')
                    .sort({createdAt: 1})
                    .limit(3),
                Pod.find({available: true})
                .populate('brand')
                .populate('type')
                .sort({createdAt: 1})
                .limit(3)
                
            ])
            .then(([
                brandList,
                podType,
                podBestseller,
                podAvailable
            ]) => {
                res.render('index', {
                    podBestseller: multipleMongooseToObject(podBestseller),
                    podAvailable: multipleMongooseToObject(podAvailable),
                    title: 'Home page'
                })
            }
            )
        }
    }

    // [GET] /logout --> Home page
    logout (req, res) {
        // req.logout();
        // delete req.session;
        // return res.render('login',{
        //     msgLog: 'You need to login first',
        //     layout: 'loginLayout',
        //     title: 'Login'
        // })
            res.clearCookie('token');
            return res.json({ logout: true , msgLog: 'Log out successfully'})
    }

    //[GET] /authonize User
    authonize(req, res, next){
        res.render('authonize', {
            title:'Authonize',
            layout: 'loginLayout'});
    }

    // //[GET] /validation User
    // validation(req, res, next){
    //     res.render('validation', {
    //         title:'Validation',
    //         layout: 'loginLayout'});
    // }

    //[GET] /register User
    register(req, res, next){
        res.render('register', {
            title:'Register',
            layout: 'loginLayout'});
    }

    //[POST] /store User
    store(req,res,next) {
        User.findOne({
            $or: [
                {email: req.body.email}, 
                {phone: req.body.phone}
            ]
        }).then(data => {
            if(data != null){
                return res.render('register', {
                    title: 'Register',
                    layout: 'loginLayout',
                    msgReg: 'Email or phone is already registered',
                    success: false
                })
            }
            else{
                var temp = req.body.password
                bcrypt.hash(temp, 10, function(err, hash) {
                    const user = new User({
                        role: 'Customer',
                        password: hash,
                        email: req.body.email,
                        phone: req.body.phone,
                        name: req.body.name,
                        birthday: req.body.birthday,
                        address: req.body.address,
                        avatar: 'https://duytan.thinkingschool.vn/wp-content/uploads/2019/01/avatar.png'
                    })
                    // console.log(user)
                    user.save(err, result =>{
                        if(err) {
                            console.log('err: ' + err)
                            return res.render('register', {
                                title: 'Login',
                                layout: 'loginLayout',
                                msgReg: 'Failed to register',
                                success: false
                            })
                        }
                        return res.render('register', {
                            title: 'Login',
                            layout: 'loginLayout',
                            msgReg: 'Register Successfully',
                            success: true
                        })
                    })
                })
            }
        })
        .catch(err => console.log(err))

        
    }

    login(req, res, next){
        res.render('login', {
            title:'Login',
            layout: 'loginLayout'});
    }

    //[POST] /validation User
    validation(req,res,next) {
        let username = req.body.username
        let password = req.body.password
        // console.log(username + ' ' + password)

        User.findOne({
            $or: [
                {email: username}, 
                {phone: username}
            ]
        }, (err, user) => {
            if (err) {
                return console.log(err)
            }
            if (!user) {
                // return res.render('login', {
                //     success: false,
                //     layout: 'loginLayout',
                //     msgLog: `Sai t??i kho???n ho???c m???t kh???u`
                // })
                return res.render('login', {
                    success: false,
                    layout: 'loginLayout',
                    title: 'Login again',
                    msgLog: `Sai t??i kho???n ho???c m???t kh???u`
                })
            }
            //ki???m tra n???u count = 10 th?? l?? ??ang kho?? t???m th???i
            if (user.countFailed == 10) {
                return res.render('login', {
                    success: false,
                    layout: 'loginLayout',
                    title: 'Login again',
                    msgLog: `T??i kho???n hi???n ??ang b??? t???m kh??a, vui l??ng th??? l???i sau 1 ph??t`
                })
            }
            //ki???m tra n???u count = 10 th?? l?? ??ang kho?? t???m th???i
            if (user.countFailed == 6) {
                return res.render('login', {
                    success: false,
                    layout: 'loginLayout',
                    title: 'Login again',
                    msgLog: `T??i kho???n ???? b??? kho?? v??nh vi???n! B???n ???? nh???p sai m???t kh???u qu?? nhi???u l???n! Li??n h??? admin ????? m??? l???i t??i kho???n`
                })
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    var token = jwt.sign({ _id: user._id }, 'secretpasstoken', {})
                    User.updateOne({ username: username }, { $set: { countFailed: 0 } }, (err, status) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                    res.cookie('token',token, { maxAge: 2147483647, httpOnly: true });
                    // return res.render('index',{
                    //     msg: 'Login success',
                    //     title:'Home',
                    //     success: true,
                    //     user: mongooseToObject(user)
                    // })
                    return res.redirect('/')
                }
                const failed = user.countFailed
                console.log(failed)
                if (failed == 2) {
                    //Kho?? t???m th???i set count = 10
                    User.updateOne({ username: username }, { $set: { countFailed: 10 } }, (err, status) => {
                        if (err) {
                            console.log(err)
                        }
                    })

                    //M??? kho?? t??i kho???n sau 1 ph??t, tr??? count v??? 3
                    var lockAccountOneMinute = setTimeout(function () {
                        User.updateOne({ username: username }, { $set: { countFailed: 3 } }, (err, status) => {
                            if (err) {
                                console.log(err)
                            }
                        })
                        console.log(`unlock ${username} !`)
                    }, 60000);
                    return res.render('login', {
                        success: false,
                        title: 'Login again',
                        layout: 'loginLayout',
                        msgLog: `T??i kho???n ???? b??? kho?? trong 1 ph??t! N???u b???n ti???p t???c nh???p sai th??m 3 l???n n???a s??? b??? kho?? v??nh vi???n!`
                    })
                } else if (failed >= 5) {
                    User.updateOne({ username: username }, { $set: { countFailed: 6 } }, (err, status) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                    return res.render('login', {
                        success: false,
                        title: 'Login again',
                        layout: 'loginLayout',
                        msgLog: 'T??i kho???n ???? b??? kho?? v??nh vi???n! B???n ???? nh???p sai m???t kh???u qu?? nhi???u l???n! Li??n h??? admin ????? m??? l???i t??i kho???n'
                    })
                } else {
                    User.updateOne({ username: username }, { $set: { countFailed: failed + 1 } }, (err, status) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                    return res.render('login', {
                        success: false,
                        title: 'Login again',
                        layout: 'loginLayout',
                        msgLog: `B???n ???? nh???p sai m???t kh???u ${failed + 1} l???n!!!`
                    })
                }
            });
        })
    }

    // [GET] /:slug
    // Show 404 not found error
    error(req,res,next){
        if(req.cookies.token){
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            User.findOne({
                _id: decodeToken
            }).then(data => {
                if (data) {
                    req.data = data
                    // console.log(data)
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
        else{  
            res.render('partials/error', {
                title: 'Not Found',
                layout: null
            });
        }
    }

    cart(req,res,next){
        if(!req.cookies.token){
            if(!req.session.cart) {
                return res.render('cart', {
                    title: 'Cart'
                })
            }
            else{
                var cart = new Cart(req.session.cart)
                return res.render('cart',
                    {
                        pod: cart.generateArrays(),
                        totalPrice: cart.totalPrice,
                        title: 'Cart',
                    })
            }
        }
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            if(req.session.cart){
                Promise.all([
                    User.findOne({_id: decodeToken}),
                    Pod.find({})
                        .populate('brand')
                        .populate('type')
                ])
                .then(([
                    data,
                    pod,
                ]) => {
                    if (data) {
                        req.data = data
                        var cart = new Cart(req.session.cart)
                        return res.render('cart',
                            {
                                user: mongooseToObject(data),
                                pod: cart.generateArrays(),
                                totalPrice: cart.totalPrice,
                                title: 'Cart',
                            })
                        next()
                    }
                })
            }
            else{
                User.findOne({_id: decodeToken})
                .then((user) => res.render('cart',{
                    title: 'Cart',
                    user: mongooseToObject(user)
                }))
            }
        }
    }

    //[POST] /checkout
    checkout (req,res,next){
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, 'secretpasstoken')
    
        var order = new Order({
            user: req.user,
            cart: req.session.cart,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone,
        })
        order.save()
        req.session.cart = null;

        Promise.all([
            User.findOne({_id: decodeToken}),
            Brand.find({}),
            Podtype.find({}),
            Pod.find({bestseller: true})
                .populate('brand')
                .populate('type')
                .sort({createdAt: 1})
                .limit(3),
            Pod.find({available: true})
            .populate('brand')
            .populate('type')
            .sort({createdAt: 1})
            .limit(3)
        ])
        .then(([
            data,
            brandList,
            podType,
            podBestseller,
            podAvailable
        ]) => {
            if (data) {
                req.data = data
                return res.render('index',
                    {
                        user: mongooseToObject(data),
                        brandList: multipleMongooseToObject(brandList),
                        podType: multipleMongooseToObject(podType),
                        podBestseller: multipleMongooseToObject(podBestseller),
                        podAvailable: multipleMongooseToObject(podAvailable),
                        title: 'Home',
                        msg: '?????t h??ng th??nh c??ng! B???n c?? th??? g???i v??o c??c s??? hotline 0703086663 ho???c 0865663278 th??ng b??o v???i nh??n vi??n ????? c?? th??? nh???n h??ng s???m nh???t !'
                    })
                next()
            }
        })
    }
}

module.exports = new SiteController;

const res = require('express/lib/response');
const siteController = require('./SiteController');