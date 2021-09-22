const subdomain = require('express-subdomain');
const express = require('express');
const router = express.Router();
const path = require("path");

const tests = require('./tests-main');

router.get('/robots.txt', (req,res)=>{
    res.type('text/plain')
    res.sendFile(path.join(__dirname, '..', 'robots.txt'));
})
router.use('/tests', tests);

router.use('/', (req,res)=>{
    res.status(404).send('Error 404 ;)');
})

module.exports = router;