const path = require('path');
require('dotenv').config({path:path.join(__dirname,"/.env")})

const mongoose = require('mongoose');

console.log(process.env.ATLAS_URI)
mongoose.connect(process.env.ATLAS_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;