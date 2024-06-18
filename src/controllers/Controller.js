const db = require('../models/index.js');
const {Model} = require("sequelize");

class Controller {
    // Private method
    static async #render(req, res, view, title, data) {
        const dataBase = {
            url: process.env.PORT === '80' ? `${process.env.HTTP}${process.env.HOST_NAME}/` : `${process.env.HTTP}${process.env.HOST_NAME}:${process.env.PORT}/`,
            dateFormat: global.DateTime.dateFormat,
            timeFormat: global.DateTime.timeFormat,
        };
        data = Object.assign(dataBase, data);
        await res.render('layout', {view, title, data });
    }

    // Protected method (convention)
    static async _index(req, res, model) {
        let columns = db[model].fieldDef;
        let title = `${db[model].name.charAt(0).toUpperCase()}${db[model].name.slice(1)}`;
        const data = {
            columns: columns,
            module: db[model].name,
            filter: req?.session?.module[model?.module]?.listing?.filter,
            search: req?.session?.module[model?.module]?.listing?.search
        };
        await Controller.#render(req, res, 'page.listing.ejs', title, data);
    }
}

module.exports = Controller;

    // formPage: async (req, res, model, title, data) => {
    //     let formProperties = ['field', 'label', 'validate', 'onlySelect', 'relation'];
    //     let fieldDefsFiltered = model.fieldDefs.map(item => Object.fromEntries(Object.entries(item).filter(([key, value]) => formProperties.includes(key))));
    //     await Controller.render(req, res, 'page.form.ejs', title, Object.assign(data, {fields: fieldDefsFiltered}));
    // },
    //
    // formData: async (req, res) => {
    //     let accounts = await Account.getFullRecords(req, res);
    //     let services = await Service.getFullRecords(req, res);
    //     let categories = await Category.getFullRecords(req, res);
    //     let paymentStatuses = await PaymentStatus.getFullRecords(req, res);
    //     return {accounts: accounts, services: services, categories: categories, paymentStatuses: paymentStatuses};
    // },
    //
    // store: async (req, res, model) => {
    //     model.fieldDefs.forEach((field) => {
    //         if (typeof req.body[field.field] !== 'undefined') {
    //             field.value = req.body[field.field];
    //         }
    //     });
    //     await Model.store(req, res, model);
    // },
    //
    // update: async (req, res, model) => {
    //     model.fieldDefs.forEach((field) => {
    //         if (typeof req.body[field.field] !== 'undefined') {
    //             field.value = req.body[field.field];
    //         }
    //     });
    //     await Model.update(req, res, model);
    // },
    //
    // delete: async (req, res, model) => {
    //     await Model.delete(req, res, model);
    // },

    // function selectItem: async (req, res, model) => {
    //     if (req.body.checked === 'true') {
    //         let ids = [];
    //         if (req.params.id === `${model.module}_check_all`) {
    //             ids = await Model.getAllIds(req, res, model);
    //             ids = ids.map(obj => obj.id.toString());
    //         } else {
    //             ids.push(req.params.id);
    //         }
    //         ids.forEach((id) => {
    //             if (!req.session.module[model.module].listing.selected.includes(id)) {
    //                 req.session.module[model.module].listing.selected.push(id);
    //             }
    //         });
    //     } else {
    //         if (req.params.id === `${model.module}_check_all`) {
    //             req.session.module[model.module].listing.selected = [];
    //         } else {
    //             req.session.module[model.module].listing.selected = req.session.module[model.module].listing.selected.filter(id => id !== req.params.id);
    //         }
    //     }
    //
    //     res.json({selected: req.session.module[model.module].listing.selected.length});
    // },