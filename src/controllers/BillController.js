const Bill = require('../models/Bill');
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
        await Controller.formPage(req, res, Bill, 'Bill Create', Object.assign({ module: Bill.module, action: 'store', id: null}, formData));
    },

    store: async (req, res) => {
        await Controller.store(req, res, Bill);
        res.redirect('/bill');
    },

    edit: async (req, res) => {
        let formData = await Controller.formData(req, res);
        let bill = await Bill.getRecord(req, res);
        await Controller.formPage(req, res, Bill, 'Bill Update', Object.assign({ module: Bill.module, action: `update/${req.params.id}`, record: bill[0], id: req.params.id}, formData));
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

    archiveConversion: async (req, res) => {
        await Bill.archiveConversion(req, res);
    },

    checkExists: async (req, res) => {
        await Bill.checkExists(req, res);
    },
}

module.exports = BillController;
