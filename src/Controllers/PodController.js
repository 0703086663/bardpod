
 
const User = require('../models/User')
const Brand = require('../models/Brand')
const Podtype = require('../models/Podtype')
const Pod = require('../models/Pod')
const Cart = require('../models/Cart')

const { multipleMongooseToObject } = require('../ulti/mongoose')
const { mongooseToObject } = require('../ulti/mongoose')
const { checkUserExist, makePassword } = require('../ulti/register')

const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

class PodController {

    // [GET] /pod/add-to-cart:id
    addToCart(req, res, next){
        var podId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        Pod.findById(podId, function(err, pod){
            if(err){
                return res.redirect('back');
            }
            cart.add(pod, pod._id);
            req.session.cart = cart;
            res.redirect('back');
        })
    }

    //[GET] /pod/checkout
    checkout(req, res, next){
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Podtype.find({}),
                Pod.find({})
                    .populate('brand')
                    .populate('type'),
                Pod.findOne({_id: req.query.podid})
                    .populate('brand')
                    .populate('type')
                    .limit(4),
            ])
            .then(([
                brandList,
                podType,
                pod,
                podDetail
            ]) => {
                res.render('pod/checkout', {
                    brandList: multipleMongooseToObject(brandList),
                    podType: multipleMongooseToObject(podType),
                    pod: multipleMongooseToObject(pod),
                    podDetail: mongooseToObject(podDetail),
                    title: 'Checkout',
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Podtype.find({}),
                Pod.find({})
                    .populate('brand')
                    .populate('type'),
                Pod.findOne({_id: req.query.podid})
                    .populate('brand')
                    .populate('type')
                    .limit(4),
            ])
            .then(([
                data,
                brandList,
                podType,
                pod,
                podDetail
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('pod/checkout',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            podType: multipleMongooseToObject(podType),
                            pod: multipleMongooseToObject(pod),
                            podDetail: mongooseToObject(podDetail),
                            title: 'Checkout',
                        })
                    next()
                }
            })
        }
    }

    //[GET] /pod/:id
    show(req,res,next) {
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Podtype.find({}),
                Pod.find({brand: req.query.brandid})
                    .populate('brand')
                    .populate('type')
                    .sort({createdAt: 1})
                    .limit(4),
                Pod.findOne({_id: req.params.id})
                    .populate('brand')
                    .populate('type')
                    .limit(4),
            ])
            .then(([
                brandList,
                podType,
                pod,
                podDetail
            ]) => {
                res.render('pod/show', {
                    brandList: multipleMongooseToObject(brandList),
                    podType: multipleMongooseToObject(podType),
                    pod: multipleMongooseToObject(pod),
                    podDetail: mongooseToObject(podDetail),
                    title: 'Detail',
                    podDetailTitle: req.query.podDetailTitle,
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Podtype.find({}),
                Pod.find({brand: req.query.brandid})
                    .populate('brand')
                    .populate('type')
                    .sort({createdAt: 1})
                    .limit(4),
                Pod.findOne({_id: req.params.id})
                    .populate('brand')
                    .populate('type')
                    .limit(4),
            ])
            .then(([
                data,
                brandList,
                podType,
                pod,
                podDetail
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('pod/show',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            podType: multipleMongooseToObject(podType),
                            pod: multipleMongooseToObject(pod),
                            podDetail: mongooseToObject(podDetail),
                            title: 'Detail',
                            podDetailTitle: req.query.podDetailTitle
                        })
                    next()
                }
            })
        }
    }

    //[PUT] /pod/:id
    update(req,res,next) {
        Pod.updateOne({_id: req.params.id}, req.body)
            .then(pod => res.redirect('back'))
            .catch(next);
    }

    //[DELETE] /pod/:id
    delete(req,res,next) {
        Pod.delete({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[DELETE] /pod/:id/force
    force(req,res,next) {
        Pod.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[RESTORE] /pod/:id/store
    restore(req,res,next) {
        Pod.restore({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[POST] /store pod
    store(req,res,next) {
        console.log(req.body)
        const pod = new Pod({
            brand: req.body.brand,
            type: req.body.type,
            name: req.body.name,
            color: req.body.color,
            price: req.body.price,
            buff: req.body.buff,
            // size: req.body.size,
            quantity: req.body.quantity,
            image: req.file.filename
        });
        // const pod = new Pod(req.body);
        pod.save()
            .then(() => res.redirect('/admin/pod-table'))
            // .then(() => res.json(req.body))
            .catch(error => {
                console.log(error)
            })
    }

    //[GET] /pod/newarrival
    newarrival(req,res,next){
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Podtype.find({}),
                Pod.find({})
                    .populate('brand')
                    .populate('type')
                    .sort({createdAt: 1}),
            ])
            .then(([
                brandList,
                podType,
                pod
            ]) => {
                res.render('pod', {
                    brandList: multipleMongooseToObject(brandList),
                    podType: multipleMongooseToObject(podType),
                    pod: multipleMongooseToObject(pod),
                    title: 'Detail',
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Podtype.find({}),
                Pod.find({})
                    .populate('brand')
                    .populate('type')
                    .sort({createdAt: 1}),
            ])
            .then(([
                data,
                brandList,
                podType,
                pod
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('pod',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            podType: multipleMongooseToObject(podType),
                            pod: multipleMongooseToObject(pod),
                            title: 'Detail',
                        })
                    next()
                }
            })
        }
    }

    //[GET] /pod/cheappod
    cheappod(req,res,next){
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Podtype.find({}),
                Pod.find({})
                    .populate('brand')
                    .populate('type')
                    .sort({price: 1}),
            ])
            .then(([
                brandList,
                podType,
                pod
            ]) => {
                res.render('pod', {
                    brandList: multipleMongooseToObject(brandList),
                    podType: multipleMongooseToObject(podType),
                    pod: multipleMongooseToObject(pod),
                    title: 'Detail',
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Podtype.find({}),
                Pod.find({})
                    .populate('brand')
                    .populate('type')
                    .sort({price: 1}),
            ])
            .then(([
                data,
                brandList,
                podType,
                pod
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('pod',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            podType: multipleMongooseToObject(podType),
                            pod: multipleMongooseToObject(pod),
                            title: 'Detail',
                        })
                    next()
                }
            })
        }
    }

    //[GET] /pod/expensivepod
    expensivepod(req,res,next){
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Podtype.find({}),
                Pod.find({})
                    .populate('brand')
                    .populate('type')
                    .sort({price: -1}),
            ])
            .then(([
                brandList,
                podType,
                pod
            ]) => {
                res.render('pod', {
                    brandList: multipleMongooseToObject(brandList),
                    podType: multipleMongooseToObject(podType),
                    pod: multipleMongooseToObject(pod),
                    title: 'Detail',
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Podtype.find({}),
                Pod.find({})
                    .populate('brand')
                    .populate('type')
                    .sort({price: -1}),
            ])
            .then(([
                data,
                brandList,
                podType,
                pod
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('pod',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            podType: multipleMongooseToObject(podType),
                            pod: multipleMongooseToObject(pod),
                            title: 'Detail',
                        })
                    next()
                }
            })
        }
    }

    //[GET] /pod/bestseller
    bestseller(req,res,next){
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Podtype.find({}),
                Pod.find({bestseller: true})
                    .populate('brand')
                    .populate('type'),
            ])
            .then(([
                brandList,
                podType,
                pod
            ]) => {
                res.render('pod', {
                    brandList: multipleMongooseToObject(brandList),
                    podType: multipleMongooseToObject(podType),
                    pod: multipleMongooseToObject(pod),
                    title: 'Detail',
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Podtype.find({}),
                Pod.find({bestseller: true})
                    .populate('brand')
                    .populate('type'),
            ])
            .then(([
                data,
                brandList,
                podType,
                pod
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('pod',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            podType: multipleMongooseToObject(podType),
                            pod: multipleMongooseToObject(pod),
                            title: 'Detail',
                        })
                    next()
                }
            })
        }
    }

    //[GET] /pod/available
    available(req,res,next){
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Podtype.find({}),
                Pod.find({available: true})
                    .populate('brand')
                    .populate('type'),
            ])
            .then(([
                brandList,
                podType,
                pod
            ]) => {
                res.render('pod', {
                    brandList: multipleMongooseToObject(brandList),
                    podType: multipleMongooseToObject(podType),
                    pod: multipleMongooseToObject(pod),
                    title: 'Detail',
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Podtype.find({}),
                Pod.find({available: true})
                    .populate('brand')
                    .populate('type'),
            ])
            .then(([
                data,
                brandList,
                podType,
                pod
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('pod',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            podType: multipleMongooseToObject(podType),
                            pod: multipleMongooseToObject(pod),
                            title: 'Detail',
                        })
                    next()
                }
            })
        }
    }

    //[GET] /pod/finding-type
    finding(req,res,next){
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Podtype.find({}),
                Pod.find({ $or: [
                        {type: req.query.type}, 
                        {brand: req.query.brand},
                        {color: req.query.color},
                        {buff: req.query.buff},
                        // {size: {$elemMatch: {number: req.query.size1}}},
                        // {size: {$elemMatch: {number: req.query.size2}}}
                    ]})
                    .populate('brand')
                    .populate('type'),
            ])
            .then(([
                brandList,
                podType,
                pod
            ]) => {
                res.render('pod', {
                    brandList: multipleMongooseToObject(brandList),
                    podType: multipleMongooseToObject(podType),
                    pod: multipleMongooseToObject(pod),
                    title: 'Detail',
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Podtype.find({}),
                Pod.find({ $or: [
                        {type: req.query.type}, 
                        {brand: req.query.brand},
                        {color: req.query.color},
                        {buff: req.query.buff},
                        // {size: {$elemMatch: {number: req.query.size1}}},
                        // {size: {$elemMatch: {number: req.query.size2}}},
                    ]})
                    .populate('brand')
                    .populate('type'),
            ])
            .then(([
                data,
                brandList,
                podType,
                pod
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('pod',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            podType: multipleMongooseToObject(podType),
                            pod: multipleMongooseToObject(pod),
                            title: 'Detail',
                        })
                    next()
                }
            })
        }
    }

    //[GET] /pod INDEX
    index(req,res,next) {
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Podtype.find({}),
                Pod.find({})
                    .populate('brand')
                    .populate('type'),
            ])
            .then(([
                brandList,
                podType,
                pod
            ]) => {
                res.render('pod', {
                    brandList: multipleMongooseToObject(brandList),
                    podType: multipleMongooseToObject(podType),
                    pod: multipleMongooseToObject(pod),
                    title: 'Detail',
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Podtype.find({}),
                Pod.find({})
                    .populate('brand')
                    .populate('type'),
            ])
            .then(([
                data,
                brandList,
                podType,
                pod
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('pod',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            podType: multipleMongooseToObject(podType),
                            pod: multipleMongooseToObject(pod),
                            title: 'Detail',
                        })
                    next()
                }
            })
        }
    }
}

module.exports = new PodController;

const res = require('express/lib/response');
const podController = require('./PodController');