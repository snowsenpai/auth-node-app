const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const dotEnv = require('dotenv').config();

const userRoutes = require('./routes/user');

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));


app.use(userRoutes);

app.use((error, req, res, next) =>{
    res.render('error',{
        pageTitle:'Error'
    });
});

app.listen(PORT, ()=>{
    console.log(`server running on port:${PORT}`);
});