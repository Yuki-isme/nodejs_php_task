require('dotenv').config();
require('./src/config/database');
require('./src/services/DateTime');

//init app
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//config session
const sessionConfig = require('./src/config/sessionConfig');
sessionConfig(app);

//config view
const configViewEngine = require('./src/config/viewEngine');
configViewEngine(app);

//config route
const webRoutes = require('./src/routes/web');
app.use('/', webRoutes);

//assign port
const port = process.env.PORT;
const hostname = process.env.HOST_NAME;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});