// Import
const configServer = require('./config/configServer');
const routers = require('./routers/routers.web');

const express = require('express');
const app = express();
const { sequelize } = require('./models');
require('dotenv').config();

// PORT
const PORT = process.env.PORT;

// Config Module and Export Upload
const upload = configServer(app, __dirname);

// Get all routers
routers(app, upload);

// Listen on PORT
app.listen(PORT, async () => {
    console.log("Listen on PORT:", PORT);
    try {
        await sequelize.authenticate();
        console.log('Connect database successfully!');
    } catch (err) {
        console.error('Cannot connect to database:', err);
    }
})