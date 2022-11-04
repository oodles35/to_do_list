const express = require('express');
const { connectDb } = require('./config/dbconfig');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 4000;
//const route = require('./app/routes/user');
const route = require('./app/routes');

// parse requests
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(express.json());

app.listen(PORT, () =>{
    console.log('server conneted on port', PORT);
});

connectDb();


// Initialize the route
route.routeToControllers(app);
module.exports = app;