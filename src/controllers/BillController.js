const Bill = require('../models/Bill');
Bill.__init();
const Controller = require('./Controller');

const BillController =  {
    index: async (req, res) => {
        await Controller.listingPage(req, res, Bill);
    },

    getRecords: async (req, res) => {
        return await Bill.getRecords(req, res);
    },

    create: async (req, res) => {
        let formData = await Controller.formData(req, res);
        await Controller.formPage(req, res, 'Bill Create', Object.assign({ module: 'Bill', action: 'store' }, formData));
    },

    store: async (req, res) => {
        await Controller.store(req, res, Bill);
        res.redirect('/bill');
    },

    edit: async (req, res) => {
        let formData = await Controller.formData(req, res);
        let bill = await Bill.getRecord(req, res);
        await Controller.formPage(req, res, 'Bill Update', Object.assign({ module: 'Bill', action: `update/${req.params.id}`, record: bill[0] }, formData));
    },

    update: async (req, res) => {
        await Controller.update(req, res, Bill);
        res.redirect('/bill');
    },

    delete: async (req, res) => {
        await Controller.delete(req, res, Bill);
    },

    selectItem: async (req, res) => {
        await Controller.selectItem(req, res, Bill);
    },

    archive: async (req, res) => {
        await Bill.archive(req, res);
    }
}

module.exports = BillController;
