const express = require('express');
const BillController = require('../controllers/BillController');
const ArchiveController = require('../controllers/ArchiveController');
const router = express.Router();

router.get('/', BillController.index);

const billRouter = express.Router();
billRouter.get('/', BillController.index);
billRouter.post('/ajax/getRecords', BillController.getRecords);
billRouter.get('/create', BillController.create);
billRouter.post('/store', BillController.store);
billRouter.get('/edit/:id', BillController.edit);
billRouter.post('/update/:id', BillController.update);
billRouter.delete('/ajax/delete/:id', BillController.delete);
billRouter.post('/ajax/select/:id', BillController.selectItem);
billRouter.post('/ajax/archiveConversion', BillController.archiveConversion);
router.use('/bill', billRouter);

const archiveRouter = express.Router();
archiveRouter.get('/', ArchiveController.index);
archiveRouter.post('/ajax/getRecords', ArchiveController.getRecords);
archiveRouter.get('/create', ArchiveController.create);
archiveRouter.post('/store', ArchiveController.store);
archiveRouter.get('/edit/:id', ArchiveController.edit);
archiveRouter.post('/update/:id', ArchiveController.update);
archiveRouter.delete('/ajax/delete/:id', ArchiveController.delete);
archiveRouter.post('/ajax/select/:id', ArchiveController.selectItem);
archiveRouter.post('/ajax/archiveConversion', ArchiveController.archiveConversion);
router.use('/archive', archiveRouter);

// router.use(function(req, res, next) {
//     res.status(404).redirect('/');
// });

module.exports = router;