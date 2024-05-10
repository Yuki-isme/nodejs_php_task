const pool = require('../config/database');
const DateTime = require("../services/DateTime");
const Bill = require("./Bill");

const Model = {
    defaultFieldDef: [
        {field: 'id', label: 'ID', type: 'int', validate: null, hidden: true, orderable: true, onlyQuery: true, insert: false, relation: false}
    ],

    actionFieldDef: [
        {field: 'action', label: 'Action', type: 'action', validate: null, hidden: false, orderable: false, onlyQuery: false, insert: false, relation: false}
    ],

    __init(model, defaultFieldDef = true, actionFieldDef = true) {
        if (actionFieldDef) {
            model.fieldDefs.unshift(...Model.actionFieldDef);
        }
        if (defaultFieldDef) {
            model.fieldDefs.unshift(...Model.defaultFieldDef);
        }
        model.fieldDefs = Model.setIndex(model.fieldDefs);

        return [model.fieldDefs];
    },

    setIndex: (fieldDefs) => {
        let fieldIndex = 0;
        fieldDefs.forEach((field) => {
            if (field.onlyQuery) {
                field.index = null;
            } else {
                field.index = fieldIndex;
                fieldIndex++;
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
            concatList.push(`CASE WHEN bills.id IN (${req.session.module[model.module].listing.selected.map(item => `'${item}'`).join(',')}) THEN ' checked' ELSE '' END`);
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

    buildQueryGetRecords: async (req, model) => {
        let select = ``;
        let from = `\r\nFROM ${model.table}`;
        let where = ``;
        let search = ``;
        let order = typeof req.body.order === 'undefined' ? `` : `\r\nORDER BY ${req.body.columns[req.body.order[0]['column']]['data']} ${req.body.order[0]['dir']}`;
        let limit = typeof req.body.length === 'undefined' ? `` : `\r\nLIMIT ${req.body.length}`;
        let offset = typeof req.body.start === 'undefined' ? `` : `\r\nOFFSET ${req.body.start}`;

        let dateFormat = DateTime.dateFormats.find(format => format.format === DateTime.dateFormat)?.db;
        let timeFormat = DateTime.timeFormats.find(format => format.format === DateTime.timeFormat)?.db;

        if (req.body.draw === '1' && typeof req.session.module[model.module].listing.search === 'string') {
            req.body.search.value = req.session.module[model.module].listing.search;
        }
        req.session.module[model.module].listing.search = req.body.search.value;

        await model.fieldDefs.forEach((field) => {
            if (select) {
                select += `, `;
            } else {
                select += `SELECT `;
            }
            if (field.onlyQuery) {
                select += `${model.table}.${field.field}`;
            } else if (field.field === 'action') {
                select += `${Model.generateActionHTML(req, model)} AS action`;
            } else if (field.relation === false) {
                if (field.type === 'datetime') {
                    select += `DATE_FORMAT(${field.field}, '${dateFormat} ${timeFormat}') AS ${field.field}`;
                } else {
                    select += `${field.field}`;
                }
                if (typeof req.body.columns !== 'undefined') {
                    if (req.body.draw === '1' && typeof req.session.module[model.module].listing.filter[field.index] !== 'undefined') {
                        req.body.columns[field.index].search.value = req.session.module[model.module].listing.filter[field.index];
                    }
                    if (req.body.columns[field.index].search.value !== ``) {
                        where += where === `` ? `\r\nWHERE ` : ` AND `;
                        if (field.type === 'datetime') {
                            where += `DATE_FORMAT(${req.body.columns[field.index].data}, '${dateFormat} ${timeFormat}') LIKE '%${req.body.columns[field.index].search.value}%'`;
                        } else {
                            where += `${req.body.columns[field.index].data} LIKE '%${req.body.columns[field.index].search.value}%'`;
                        }
                    }
                    req.session.module[model.module].listing.filter[field.index] = req.body.columns[field.index].search.value;
                }
                if (typeof req.body.search !== 'undefined' && req.body.search.value !== ``) {
                    search += search === `` ? search : ` OR `;
                    search += `${req.body.columns[field.index].data} LIKE '%${req.body.search.value}%'`;
                }
            } else {
                select += `${field.relation.table}.${field.relation.field} AS ${field.relation.alias_name}`;
                from += `\r\nINNER JOIN ${field.relation.table} ON ${field.relation.table}.id = ${model.table}.${field.field}`;
                if (typeof req.body.columns !== 'undefined') {
                    if (req.body.draw === '1' && typeof req.session.module[model.module].listing.filter[field.index] !== 'undefined') {
                        req.body.columns[field.index].search.value = req.session.module[model.module].listing.filter[field.index];
                    }
                    if (req.body.columns[field.index].search.value !== ``) {
                        where += where === `` ? `\r\nWHERE ` : ` AND `;
                        where += `${field.relation.table}.${field.relation.field} LIKE '%${req.body.columns[field.index].search.value}%'`;
                    }
                    req.session.module[model.module].listing.filter[field.index] = req.body.columns[field.index].search.value;
                }
                if (typeof req.body.search !== 'undefined' && req.body.search.value !== ``) {
                    search += search === `` ? search : ` OR `;
                    search += `${field.relation.table}.${field.relation.field} LIKE '%${req.body.search.value}%'`;
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
        const [query, queryCount] = await Model.buildQueryGetRecords(req, model);
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
            if (typeof field.value !== 'undefined') {
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
        let query = `SELECT *
                     FROM ${model.table}
                     WHERE id = '${id}'`;
        const [results] = await pool.query(query);
        return results;
    },

    update: async (req, res, model) => {
        let id = req.params.id;
        let query = ``;
        for (const field of model.fieldDefs) {
            if (typeof field.value !== 'undefined') {
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

    archive: async (req, res, model, toTable) => {
        let ids = req.session.module[model.module].listing.selected.map(item => `'${item}'`).join(',');
        let columns = ``;
        await model.fieldDefs.forEach((field) => {
            if (field.insert === true) {
                columns += columns === `` ? `${field.field}` : `, ${field.field}`;
            }
        });

        let queryArchive = `INSERT INTO ${toTable} (${columns}) \r\nSELECT ${columns} \r\nFROM ${model.table} \r\nWHERE id IN (${ids})`;
        let queryDelete = `DELETE \r\nFROM ${model.table} \r\nWHERE id IN (${ids})`

        await pool.query(queryArchive);
        await pool.query(queryDelete);

        req.session.module[model.module].listing.selected = [];

        res.json({status: true});
    },
}

module.exports = Model;