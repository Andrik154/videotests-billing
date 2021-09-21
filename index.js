const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const router = require('./routers/master');

app.use('/', router);

app.listen(process.env.PORT, console.log(`Starting server on port ${process.env.PORT}`));