
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Pod = new Schema({
    brand: {type: mongoose.Schema.Types.ObjectId, ref:'Brand'},
    type: {type: mongoose.Schema.Types.ObjectId, ref: 'Podtype'},

    name: {type: String, minLength: 1, maxLength: 255},
    color: {type: String},
    price: {type: Number, minLength:1, default: 0},
    // size: [{
    //     number: {type: Number, minLength:1, maxLength:2 },
    //     stock: {type: Number}
    // }],
    image: {type : String, minLength : 1},
    rate: {type: Number, minLength:1, default:0},
    quantity: {type: Number, minLength:1, default:0},
    available: {type: Boolean, default: true},
    bestseller: {type: Boolean, default: false},
    buff: {type: Number, default: 0},
    slug: {type : String, slug : 'name', unique: true},
    deletedAt: {},
    // createdAt: {type: Date, default : Date.Now},
    // updateAt: {type: Date, default : Date.Now}
}, {
    timestamps : true,
});

//Add plugin
Pod.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true
});
mongoose.plugin(slug);

module.exports = mongoose.model('Pod', Pod);