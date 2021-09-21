const express = require('express');
const router = express.Router();
const path = require('path');

router.use(express.static(path.join(__dirname, '../tests-react/build')));
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../tests-react/build', 'index.html'));
});

module.exports = router;