const Model = require('../models/Model');

const Service = {
    fieldDefs: [
        {field: 'name', label: 'Service ID', type: 'varchar',  hidden: false, query: true, relation: false},
    ],

    module: 'service',
    module_name: 'Service',
    table: 'services',

    __init: async () => {
        [Service.fieldDefs] = await Model.__init(Service, true, false);
    },

    getFullRecords: async (req, res) => {
        return await Model.getFullRecords(req, res, Service);
    }
}

module.exports = Service;

(async () => {
    await Service.__init();
})();