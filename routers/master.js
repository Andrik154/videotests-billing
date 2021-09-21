const subdomain = require('express-subdomain');
const express = require('express');
const router = express.Router();

const tests = require('./tests-main');

router.use('/tests/', tests);

router.use('/', (req,res)=>{
    res.status(404).send('Error 404 ;)');
})

module.exports = router;