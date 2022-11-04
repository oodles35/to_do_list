const mongoose = require('mongoose');

async function connectDb() {
    try {
        await mongoose.connect(process.env.dbUrl);
        console.log('Successfully connected to the database');
    } catch(error) {
        console.log('Could not connect to the database. Exiting now...', error);
    }
}

module.exports = { connectDb }