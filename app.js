const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRoutes = require('./routes/user');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// CORS middleware
app.use((req,res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(userRoutes);

// error middleware
app.use((error, req, res, next) =>{
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({error:message});
});

app.listen(PORT, ()=>{
    console.log(`server running on port:${PORT}`);
});