const Model = require('../models/Model');

const Archive = {
    fieldDefs: [
        {field: 'bill_id',           label: 'Archive ID',     type: 'varchar',  validate: ['unique'],             hidden: false, orderable: true, onlyQuery: false, insert: true, quick_edit: false, relation: false},
        {field: 'amount',            label: 'Amount',         type: 'double',   validate: ['number'],             hidden: false, orderable: true, onlyQuery: false, insert: true, quick_edit: false, relation: false},
        {field: 'comment',           label: 'Comment',        type: 'text',     validate: null,                   hidden: true,  orderable: true, onlyQuery: false, insert: true, quick_edit: false, relation: false},
        {field: 'service_id',        label: 'Service',        type: 'int',      validate: null,                   hidden: false, orderable: true, onlyQuery: false, insert: true, quick_edit: false, relation: {table: 'services',         field: 'name', alias_name: 'service'}},
        {field: 'payment_status_id', label: 'Payment Status', type: 'int',      validate: null,                   hidden: false, orderable: true, onlyQuery: false, insert: true, quick_edit: false, relation: {table: 'payment_statuses', field: 'name', alias_name: 'payment_status'}},
        {field: 'category_id',       label: 'Category',       type: 'int',      validate: null,                   hidden: false, orderable: true, onlyQuery: false, insert: true, quick_edit: false, relation: {table: 'categories',       field: 'name', alias_name: 'category'}},
        {field: 'closed_date',       label: 'Closes Date',    type: 'datetime', validate: ['greaterCurrentTime'], hidden: false, orderable: true, onlyQuery: false, insert: true, quick_edit: false, relation: false},
    ],

    module: 'archive',
    module_name: 'Archive',
    table: 'archives',

    __init: () => {
        [Archive.fieldDefs] = Model.__init(Archive);
    },

    getRecords: async (req, res) => {
        return await Model.getRecords(req, res, Archive);
    },

    getRecord: async (req, res) => {
        return await Model.getRecord(req, res, Archive);
    },

    archiveConversion: async (req, res) => {
        await Model.archiveConversion(req, res, Archive, 'Bill');
    },
}

module.exports = Archive;