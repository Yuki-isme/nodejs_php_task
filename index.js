require('dotenv').config();
require('./src/config/database');
require('./src/services/DateTime');
require('./src/services/Common');

//init app
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: `${process.env.HTTP}${process.env.HOST_NAME}:${process.env.PORT}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

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