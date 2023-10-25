const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
let ejs = require('ejs');
const mongoose = require('mongoose');
const seedDb= require('./seed.js');

mongoose.connect('mongodb://127.0.0.1:27017/Blogging-App').then(() => {
    console.log('db connected');
}).catch((err) => {
    console.log("DB Error");
    console.log(err);
})

app.set('view engine', 'ejs');

app.set('views', path.join('__dirname', 'views')); // views folder
app.use(express.static(path.join(__dirname, 'public'))); // public folder


app.get('/', (req, res) => {
    res.send('Welcome to our blogging app');
})

app.listen(port, () => {
    console.log('listening at port 8080');
})

// seeding database (running only for fisrt tym)
// seedDb();

