const Model = {
    defaultFieldDef: [
        {field: 'id', label: 'ID', type: 'int', validate: null, display: false, hidden: true, orderable: false, onlySelect: true, select: true, insert: false, relation: false}
    ],

    actionFieldDef: [
        {field: 'action', label: 'Action', type: 'action', validate: null, display: true, hidden: false, orderable: false, onlySelect: false, select: false, insert: false, relation: false}
    ],

    __init: async (model, defaultFieldDef = true, actionFieldDef = true) => {
        if (actionFieldDef) {
            await model.fieldDefs.unshift(...Model.actionFieldDef);
        }
        if (defaultFieldDef) {
            await model.fieldDefs.unshift(...Model.defaultFieldDef);
        }

        model.fieldDefs = await Model.setIndex(model.fieldDefs);

        return [model.fieldDefs];
    },

    setIndex: async (fieldDefs) => {
        let fieldIndex = 0;
        await fieldDefs.forEach((field) => {
            if (field.display) {
                field.index = fieldIndex++;
            } else {
                field.index = null;
            }
        });

        return fieldDefs;
    },

    generateActionHTML: (req, model) => {
        let concatList = [];

        concatList.push(`'<div class="action-column">'`);

        //checkbox
        concatList.push(`'<input type="checkbox" class="${model.module}-checkbox-item" value="'`);
        concatList.push(`${model.table}.id`);
        concatList.push(`'"'`);
        if (typeof req.session.module[model.module].listing.selected !== 'undefined' && req.session.module[model.module].listing.selected.length > 0) {
            concatList.push(`CASE WHEN ${model.table}.id IN (${req.session.module[model.module].listing.selected.map(item => `'${item}'`).join(',')}) THEN ' checked' ELSE '' END`);
        }
        concatList.push(`'>'`);

        //edit button
        concatList.push(`'<div class="edit-record"><a href="${process.env.HTTP}${process.env.HOST_NAME}:${process.env.PORT}/${model.module}/edit/'`);
        concatList.push(`${model.table}.id`);
        concatList.push(`'"><i class="fa fa-pencil"></i></a></div>'`);

        //delete button
        concatList.push(`'<div class="delete-record"><button onclick="listJs.deleteRecord('`);
        concatList.push(`${model.table}.id`);
        concatList.push(`')"><i class="fa-solid fa-trash-can"></i></button></div>'`);

        concatList.push(`'</div>'`);
        // console.log(concatList);
        let concat = ``;
        concatList.forEach((value) => {
            concat += concat === `` ? `CONCAT(${value}` : `, ${value}`;
        });
        concat += `)`;

        return concat;
    },

    generateFieldHTML: (req, model, field) => {
        let dateFormat = DateTime.dateFormats.find(format => format.format === DateTime.dateFormat)?.db;
        let timeFormat = DateTime.timeFormats.find(format => format.format === DateTime.timeFormat)?.db;
        let select = ``;
        if (field.quick_edit) {
            let concatList = [];
            let customSelect, asField;
            concatList.push(`'<div class="quick-edit" data-field="${field.field}" data-relation="${field.relation === false ? field.relation : JSON.stringify(field.relation)}">'`);
            concatList.push(`'<div class="">'`);

            if (field.relation === false) {
                if (field.type === 'datetime') {
                    customSelect = `${DateTime.queryConvertFromDb(field.field)}`;
                } else {
                    customSelect = `${field.field}`;
                }
                asField = `AS ${field.field}`;
            } else {
                customSelect = `${field.relation.table}.${field.relation.field}`;
                asField = `AS ${field.relation.alias_name}`;
            }

            concatList.push(`'<p class="">'`);
            concatList.push(`${customSelect}`);
            concatList.push(`'</p>'`);
            concatList.push(`'<span class="edit-icon"></span>'`);

            concatList.push(`'</div>'`);
            concatList.push(`'</div>'`);

            concatList.forEach((value) => {
                select += select === `` ? `CONCAT(${value}` : `, ${value}`;
            });
            select += `) ${asField}`;
        } else {
            if (field.relation === false) {
                if (field.type === 'datetime') {
                    select = `${DateTime.queryConvertFromDb(field.field)} AS ${field.field}`;
                } else {
                    select = `${field.field}`;
                }
            } else {
                select = `${field.relation.table}.${field.relation.field} AS ${field.relation.alias_name}`;
            }
        }

        return select;
    },

    buildQueryGetRecords: async (req, model, type) => {
        let select = ``;
        let from = `\r\nFROM ${model.table}`;
        let where = ``;
        let search = ``;
        let order = typeof req.body.order === 'undefined' ? `` : `\r\nORDER BY ${req.body.columns[req.body.order[0]['column']]['data']} ${req.body.order[0]['dir']}`;
        let limit = typeof req.body.length === 'undefined' ? `` : `\r\nLIMIT ${req.body.length}`;
        let offset = typeof req.body.start === 'undefined' ? `` : `\r\nOFFSET ${req.body.start}`;

        if (type === 'listing') {
            req.session.module[model.module].listing.search = req.body.search.value;
        }

        await model.fieldDefs.forEach((field) => {
            if (select) {
                select += `, `;
            } else {
                select += `SELECT `;
            }
            if (field.onlySelect) {
                select += `${model.table}.${field.field}`;
            } else if (field.field === 'action') {
                select += `${Model.generateActionHTML(req, model)} AS action`;
            } else {
                // console.log(`\r\n${Model.generateFieldHTML(req, model, field)}`);
                select += Model.generateFieldHTML(req, model, field);
                if (field.relation === false) {
                    if (typeof req.body.columns !== 'undefined') {
                        if (req.body.columns[field.index].search.value !== ``) {
                            where += where === `` ? `\r\nWHERE ` : ` AND `;
                            if (field.type === 'datetime') {
                                where += `${DateTime.queryConvertFromDb(req.body.columns[field.index].data)} LIKE '%${req.body.columns[field.index].search.value}%'`;
                            } else {
                                where += `${req.body.columns[field.index].data} LIKE '%${req.body.columns[field.index].search.value}%'`;
                            }
                        }
                        if (type === 'listing') {
                            req.session.module[model.module].listing.filter[field.index] = req.body.columns[field.index].search.value;
                        }
                    }
                    if (typeof req.body.search !== 'undefined' && req.body.search.value !== ``) {
                        search += search === `` ? search : ` OR `;
                        if (field.type === 'datetime') {
                            search += `${DateTime.queryConvertFromDb(req.body.columns[field.index].data)} LIKE '%${req.body.search.value}%'`;
                        } else {
                            search += `${req.body.columns[field.index].data} LIKE '%${req.body.search.value}%'`;
                        }
                    }
                } else {
                    from += `\r\nINNER JOIN ${field.relation.table} ON ${field.relation.table}.id = ${model.table}.${field.field}`;
                    if (typeof req.body.columns !== 'undefined') {
                        if (req.body.columns[field.index].search.value !== ``) {
                            where += where === `` ? `\r\nWHERE ` : ` AND `;
                            where += `${field.relation.table}.${field.relation.field} LIKE '%${req.body.columns[field.index].search.value}%'`;
                        }
                        if (type === 'listing') {
                            req.session.module[model.module].listing.filter[field.index] = req.body.columns[field.index].search.value;
                        }
                    }
                    if (typeof req.body.search !== 'undefined' && req.body.search.value !== ``) {
                        search += search === `` ? search : ` OR `;
                        search += `${field.relation.table}.${field.relation.field} LIKE '%${req.body.search.value}%'`;
                    }
                }
            }
        });

        if (search !== ``) {
            where = where === `` ? `\r\nWHERE ${search}` : `${where} AND (${search})`;
        }

        let query = `${select} ${from} ${where} ${order} ${limit} ${offset}`;
        let queryCount = `SELECT COUNT(*) ${from} ${where}`;

        req.session.module[model.module].listing.query.from = from;
        req.session.module[model.module].listing.query.where = where === `` ? '\r\nWHERE 1=1' : where;

        // console.log(query);
        // console.log();
        return [query, queryCount];
    },

    getRecords: async (req, res, model) => {
        const [query, queryCount] = await Model.buildQueryGetRecords(req, model, 'listing');
        const [results] = await pool.query(query);
        const [amount] = await pool.query(queryCount);
        let checkedAll = typeof req.session.module[model.module].listing.selected !== 'undefined' && amount[0]['COUNT(*)'] === req.session.module[model.module].listing.selected.length;
        res.json({session: req.session, data: results, recordsTotal: amount[0]['COUNT(*)'], recordsFiltered: amount[0]['COUNT(*)'], checkedAll: checkedAll, selected: req.session.module[model.module].listing.selected.length});
    },

    getFullRecords: async (req, res, model) => {
        const [query] = await Model.buildQueryGetRecords(req, model);
        const [results] = await pool.query(query);
        return results;
    },

    store: async (req, res, model) => {
        let query = ``;
        let values = ``;
        for (const field of model.fieldDefs) {
            if (typeof field.value !== 'undefined' && field.insert === true) {
                if (field.type === 'datetime') {
                    field.value = await DateTime.convertToDb(field.value);
                }
                if (query === ``) {
                    query = `INSERT INTO ${model.table} (${field.field}`;
                } else {
                    query += `, ${field.field}`;
                }
                if (values === ``) {
                    values = `VALUES ('${field.value}'`;
                } else {
                    values += `, '${field.value}'`;
                }
            }
        }
        query += `) ${values})`;

        await pool.query(query);
        return true;
    },

    getRecord: async (req, res, model) => {
        let id = req.params.id;
        let select = ``;

        model.fieldDefs.forEach((field) => {
            if (field.select === true) {
                select += select === `` ? `SELECT ` : `, `;
                if (field.type === 'datetime') {
                    select += `${DateTime.queryConvertFromDb(field.field)} AS ${field.field}`
                } else {
                    select += `${field.field}`;
                }
            }
        });
        let query = `${select}\r\nFROM ${model.table}\r\nWHERE id = '${id}'`;

        const [results] = await pool.query(query);
        return results;
    },

    update: async (req, res, model) => {
        let id = req.params.id;
        let query = ``;
        for (const field of model.fieldDefs) {
            if (typeof field.value !== 'undefined' && field.insert === true) {
                if (field.type === 'datetime') {
                    field.value = DateTime.convertToDb(field.value);
                }
                if (query === ``) {
                    query = `UPDATE ${model.table} SET ${field.field} = '${field.value}'`;
                } else {
                    query += `, ${field.field} = '${field.value}'`;
                }
            }
        }
        query += `\r\nWHERE id = '${id}'`;

        await pool.query(query);
        return true;
    },

    delete: async (req, res, model) => {
        let id = req.params.id;
        let ids = `'${req.params.id}'`;
        if (id === `${model.module}_delete`) {
            ids = req.session.module[model.module].listing.selected.map(item => `'${item}'`).join(',');
            req.session.module[model.module].listing.selected = [];
        }
        let query = `DELETE FROM ${model.table} WHERE id IN (${ids})`;

        // await pool.query(query);
        res.json({status: true});
    },

    getAllIds: async (req, res, model) => {
        let query = `SELECT ${model.table}.id ${req.session.module[model.module].listing.query.from} ${req.session.module[model.module].listing.query.where}`;
        let [results] = await pool.query(query);
        return results;
    },

    archiveConversion: async (req, res, model, modelName) => {
        let status = false;
        if (req.session.module[model.module].listing.selected.length) {
            const toModel = require(`../models/${modelName}`);
            let ids = req.session.module[model.module].listing.selected.map(item => `'${item}'`).join(',');
            let columns = ``;
            await toModel.fieldDefs.forEach((field) => {
                if (field.insert === true) {
                    columns += columns === `` ? `${field.field}` : `, ${field.field}`;
                }
            });

            let queryArchive = `INSERT INTO ${toModel.table} (${columns}) \r\nSELECT ${columns} \r\nFROM ${model.table} \r\nWHERE id IN (${ids})`;
            let queryDelete = `DELETE \r\nFROM ${model.table} \r\nWHERE id IN (${ids})`

            await pool.query(queryArchive);
            await pool.query(queryDelete);

            req.session.module[model.module].listing.selected = [];
            status = true;
        }

        res.json({status: status});
    },

    checkExists: async (req, res) => {
        let id = req.body.id;
        let table = req.body.table;
        let tables = req.body.tables;
        let field = req.body.field;
        let value = req.body[field];

        let existsString = `WHEN EXISTS (SELECT 1 FROM ${table} WHERE ${field} = '${value}' AND id != '${id}')`;

        tables.forEach((table) => {
            existsString += ` OR EXISTS (SELECT 1 FROM ${table} WHERE ${field} = '${value}')`;
        });

        let query = `SELECT 
                                CASE 
                                    ${existsString}
                                    THEN true
                                    ELSE false
                                END AS existence_check`;

        console.log(query);

        [results] = await pool.query(query);

        res.json(results[0].existence_check === 0);
    },
}

module.exports = Model;