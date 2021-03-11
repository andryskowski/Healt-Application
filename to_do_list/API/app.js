const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

app.use(bodyParser.json());

//import Routes
const postsRoute = require('./routes/posts');

app.use('/posts', postsRoute);

// app.get('/', (req, res) => {
//     res.send('We are on home');
// });


//connect to db
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {console.log('connected to DB')})

//start listening to the server
app.listen(8000);