const express = require('express');
const router = express.Router();

const testsApi = require('./tests-api');
const testsFront = require('./tests-front');

router.use('/api', testsApi);
router.use('/', testsFront);

module.exports = router;