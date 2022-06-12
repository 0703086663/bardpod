const express = require('express');
const router = express.Router();

const podtypeController = require('../Controllers/PodtypeController');

// [PUT] /podtype/:id/update podtype
router.put('/:id', podtypeController.update)

// [PATCH] /podtype/:id/update podtype
router.patch('/:id/restore', podtypeController.restore)

// [DELETE] /podtype/:id/detele podtype
router.delete('/:id', podtypeController.delete)
router.delete('/:id/force', podtypeController.force)

// // [POST] /podtype/store podtype
router.post('/store', podtypeController.store)


module.exports = router;