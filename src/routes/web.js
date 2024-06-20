const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const AuthController = require('../controllers/AuthController');
// const BillController = require('../controllers/BillController');
// const ArchiveController = require('../controllers/ArchiveController');
const UserController = require('../controllers/UserController');
const ZingMp3Controller = require('../controllers/ZingMp3Controller');

router.get('/login', AuthController.login);
router.post('/auth', AuthController.auth);
router.post('/refreshToken', AuthController.refreshToken);
router.post('/logout', AuthController.logout);

router.get('/', ZingMp3Controller.index);

router.get('/getSong/:id', ZingMp3Controller.getSong);

router.get('/zing-mp3', ZingMp3Controller.index);

// const billRouter = express.Router();
// billRouter.use(authenticateToken);
// billRouter.get('/', BillController.index);
// billRouter.post('/ajax/getRecords', BillController.getRecords);
// billRouter.get('/create', BillController.create);
// billRouter.post('/store', BillController.store);
// billRouter.get('/edit/:id', BillController.edit);
// billRouter.put('/update/:id', BillController.update);
// billRouter.delete('/ajax/delete/:id', BillController.delete);
// billRouter.post('/ajax/select/:id', BillController.selectItem);
// billRouter.post('/ajax/archiveConversion', BillController.archiveConversion);
// billRouter.post('/ajax/checkExists', BillController.checkExists);
// router.use('/bill', billRouter);

// const archiveRouter = express.Router();
// archiveRouter.use(authenticateToken);
// archiveRouter.get('/', ArchiveController.index);
// archiveRouter.post('/ajax/getRecords', ArchiveController.getRecords);
// archiveRouter.get('/create', ArchiveController.create);
// archiveRouter.post('/store', ArchiveController.store);
// archiveRouter.get('/edit/:id', ArchiveController.edit);
// archiveRouter.put('/update/:id', ArchiveController.update);
// archiveRouter.delete('/ajax/delete/:id', ArchiveController.delete);
// archiveRouter.post('/ajax/select/:id', ArchiveController.selectItem);
// archiveRouter.post('/ajax/archiveConversion', ArchiveController.archiveConversion);
// archiveRouter.post('/ajax/checkExists', ArchiveController.checkExists);
// router.use('/archive', archiveRouter);

// router.use(function(req, res, next) {
//     res.status(404).redirect('/');
// });

module.exports = router;
