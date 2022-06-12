 
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
                //     msgLog: `Sai tài khoản hoặc mật khẩu`
                // })
                return res.render('login', {
                    success: false,
                    layout: 'loginLayout',
                    title: 'Login again',
                    msgLog: `Sai tài khoản hoặc mật khẩu`
                })
            }
            //kiểm tra nếu count = 10 thì là đang khoá tạm thời
            if (user.countFailed == 10) {
                return res.render('login', {
                    success: false,
                    layout: 'loginLayout',
                    title: 'Login again',
                    msgLog: `Tài khoản hiện đang bị tạm khóa, vui lòng thử lại sau 1 phút`
                })
            }
            //kiểm tra nếu count = 10 thì là đang khoá tạm thời
            if (user.countFailed == 6) {
                return res.render('login', {
                    success: false,
                    layout: 'loginLayout',
                    title: 'Login again',
                    msgLog: `Tài khoản đã bị khoá vĩnh viễn! Bạn đã nhập sai mật khẩu quá nhiều lần! Liên hệ admin để mở lại tài khoản`
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
                    //Khoá tạm thời set count = 10
                    User.updateOne({ username: username }, { $set: { countFailed: 10 } }, (err, status) => {
                        if (err) {
                            console.log(err)
                        }
                    })

                    //Mở khoá tài khoản sau 1 phút, trả count về 3
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
                        msgLog: `Tài khoản đã bị khoá trong 1 phút! Nếu bạn tiếp tục nhập sai thêm 3 lần nữa sẽ bị khoá vĩnh viễn!`
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
                        msgLog: 'Tài khoản đã bị khoá vĩnh viễn! Bạn đã nhập sai mật khẩu quá nhiều lần! Liên hệ admin để mở lại tài khoản'
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
                        msgLog: `Bạn đã nhập sai mật khẩu ${failed + 1} lần!!!`
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
        var order = new Order({
            user: req.user,
            cart: req.session.cart,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone,
        })
        order.save()
        req.session.cart = null;

        res.render('index',{
            title: 'Home',
            msg: 'Đặt hàng thành công! Bạn có thể gọi vào các số hotline 0703086663 hoặc 0865663278 thông báo với nhân viên để có thể nhận hàng sớm nhất !'
        })
        // return res.json({msg: 'Successfully', body:order});
        // return res.render('cart',{
        //     title: 'Cart',
        //     msg: 'Successfully order product'
        // })
    }
}

module.exports = new SiteController;

const res = require('express/lib/response');
const siteController = require('./SiteController');