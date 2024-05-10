const DateTime = require("../services/DateTime");
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
        await res.render('layout', {view: view, title: title, url: `${process.env.HTTP}${process.env.HOST_NAME}:${process.env.PORT}/`, data: Object.assign({dateFormat: DateTime.dateFormat, timeFormat: DateTime.timeFormat}, data)});
    },

    listingPage: async (req, res, model) => {
        await Controller.render(req, res, 'page.listing.ejs', model.module_name, {columns: model.fieldDefs, module: model.module, filter: req.session.module[model.module].listing.filter, search: req.session.module[model.module].listing.search});
    },

    formPage: async (req, res, title, data) => {
        await Controller.render(req, res, 'page.form.ejs', title, data);
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