
const Podtype = require('../models/Podtype');
const { multipleMongooseToObject } = require('../ulti/mongoose')
const { mongooseToObject } = require('../ulti/mongoose')

class PodtypeController {

    //[PUT] /podtype/:id
    update(req,res,next) {
        Podtype.updateOne({_id: req.params.id}, req.body)
            .then(podtype => res.redirect('back'))
            .catch(next);
    }

    //[DELETE] /podtype/:id
    delete(req,res,next) {
        Podtype.delete({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[DELETE] /podtype/:id/force
    force(req,res,next) {
        Podtype.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[RESTORE] /podtype/:id/store
    restore(req,res,next) {
        Podtype.restore({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[POST] /store podtype
    store(req,res,next) {
        const podtype = new Podtype({
            name: req.body.name,
            desc: req.body.desc,
            image: req.file.filename
        });
        // const podtype = new Podtype(req.body);
        podtype.save()
            .then(() => res.redirect('/admin/podtype-table'))
            .catch(error => {
                console.log(error)
            })
    }

}

module.exports = new PodtypeController;

const res = require('express/lib/response');
const podtypeController = require('./PodtypeController');