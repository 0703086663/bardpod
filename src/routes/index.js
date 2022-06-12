
const siteRouter = require('./site');
const adminRouter = require('./admin');
const brandRouter = require('./brand');
const podtypeRouter = require('./podtype');
const podRouter = require('./pod');

const {upload} = require('../ulti/storage');
//File uploads 
const multer=require('multer');

function route(app){

    app.use('/pod', upload.single('image'), podRouter);

    app.use('/podtype', upload.single('image'), podtypeRouter);

    app.use('/brand', upload.single('image'), brandRouter);

    app.use('/admin', adminRouter);

    app.use('/', siteRouter);
}

module.exports=route;