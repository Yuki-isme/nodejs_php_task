const Model = require('../models/Model');

const PaymentStatus = {
    fieldDefs: [
        {field: 'name', label: 'Payment Status', type: 'varchar',  hidden: false, query: true, relation: false},
    ],

    module: 'paymentStatus',
    module_name: 'Payment Status',
    table: 'payment_statuses',

    __init: () => {
        [PaymentStatus.fieldDefs] = Model.__init(PaymentStatus, true, false);
    },

    getFullRecords: async (req, res) => {
        return await Model.getFullRecords(req, res, PaymentStatus);
    }
}

module.exports = PaymentStatus;