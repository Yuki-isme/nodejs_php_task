const express = require("express");
const path = require("node:path");
const configViewEngine = (app) => {
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    app.use(express.static(path.join(__dirname, '../public')));
}

module.exports = configViewEngine;