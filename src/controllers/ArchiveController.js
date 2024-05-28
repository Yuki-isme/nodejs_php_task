const Archive = require('../models/Archive');
// Archive.__init();
const Controller = require('./Controller');

const ArchiveController =  {
    index: async (req, res) => {
        await Controller.listingPage(req, res, Archive);
    },

    getRecords: async (req, res) => {
        return await Archive.getRecords(req, res);
    },

    create: async (req, res) => {
        let formData = await Controller.formData(req, res);
        await Controller.formPage(req, res, Archive, 'Archive Create', Object.assign({ module: 'Archive', action: 'store', id: null}, formData));
    },

    store: async (req, res) => {
        await Controller.store(req, res, Archive);
        res.redirect('/archive');
    },

    edit: async (req, res) => {
        let formData = await Controller.formData(req, res);
        let archive = await Archive.getRecord(req, res);
        await Controller.formPage(req, res, Archive, 'Archive Update', Object.assign({ module: 'Archive', action: `update/${req.params.id}`, record: archive[0], id: req.params.id}, formData));
    },

    update: async (req, res) => {
        await Controller.update(req, res, Archive);
        res.redirect('/archive');
    },

    delete: async (req, res) => {
        await Controller.delete(req, res, Archive);
    },

    selectItem: async (req, res) => {
        await Controller.selectItem(req, res, Archive);
    },

    archiveConversion: async (req, res) => {
        await Archive.archiveConversion(req, res);
    },

    checkExists: async (req, res) => {
        await Archive.checkExists(req, res);
    },
}

module.exports = ArchiveController;
