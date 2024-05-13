const Model = require("../models/Model");
const Account = require('../models/Account');
Account.__init();
const Service = require('../models/Service');
Service.__init();
const Category = require('../models/Category');
Category.__init();
const PaymentStatus = require('../models/PaymentStatus');
const Bill = require("../models/Bill");
PaymentStatus.__init();

const Controller = {
    render: async (req, res, view, title, data) => {
        console.log(DateTime.localTimeZone);
        await res.render('layout', {view: view, title: title, url: `${process.env.HTTP}${process.env.HOST_NAME}:${process.env.PORT}/`, data: Object.assign({dateFormat: global.DateTime.dateFormat, timeFormat: global.DateTime.timeFormat}, data)});
    },

    listingPage: async (req, res, model) => {
        let listingProperties = ['index', 'field', 'label', 'display', 'hidden', 'orderable', 'relation'];
        let fieldDefsFiltered = model.fieldDefs.map(item => Object.fromEntries(Object.entries(item).filter(([key, value]) => listingProperties.includes(key))));
        await Controller.render(req, res, 'page.listing.ejs', model.module_name, {columns: fieldDefsFiltered, module: model.module, filter: req.session.module[model.module].listing.filter, search: req.session.module[model.module].listing.search});
    },

    formPage: async (req, res, model, title, data) => {
        let formProperties = ['field', 'label', 'validate', 'onlySelect', 'relation'];
        let fieldDefsFiltered = model.fieldDefs.map(item => Object.fromEntries(Object.entries(item).filter(([key, value]) => formProperties.includes(key))));
        await Controller.render(req, res, 'page.form.ejs', title, Object.assign(data, {fields: fieldDefsFiltered}));
    },

    formData: async (req, res) => {
        let accounts = await Account.getFullRecords(req, res);
        let services = await Service.getFullRecords(req, res);
        let categories = await Category.getFullRecords(req, res);
        let paymentStatuses = await PaymentStatus.getFullRecords(req, res);
        return {accounts: accounts, services: services, categories: categories, paymentStatuses: paymentStatuses};
    },

    store: async (req, res, model) => {
        model.fieldDefs.forEach((field) => {
            if (typeof req.body[field.field] !== 'undefined') {
                field.value = req.body[field.field];
            }
        });
        await Model.store(req, res, model);
    },

    update: async (req, res, model) => {
        model.fieldDefs.forEach((field) => {
            if (typeof req.body[field.field] !== 'undefined') {
                field.value = req.body[field.field];
            }
        });
        await Model.update(req, res, model);
    },

    delete: async (req, res, model) => {
        await Model.delete(req, res, model);
    },

    selectItem: async (req, res, model) => {
        if (req.body.checked === 'true') {
            let ids = [];
            if (req.params.id === `${model.module}_check_all`) {
                ids = await Model.getAllIds(req, res, model);
                ids = ids.map(obj => obj.id.toString());
            } else {
                ids.push(req.params.id);
            }
            ids.forEach((id) => {
                if (!req.session.module[model.module].listing.selected.includes(id)) {
                    req.session.module[model.module].listing.selected.push(id);
                }
            });
        } else {
            if (req.params.id === `${model.module}_check_all`) {
                req.session.module[model.module].listing.selected = [];
            } else {
                req.session.module[model.module].listing.selected = req.session.module[model.module].listing.selected.filter(id => id !== req.params.id);
            }
        }

        res.json({selected: req.session.module[model.module].listing.selected.length});
    },
}

module.exports = Controller;