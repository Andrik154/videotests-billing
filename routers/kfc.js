const express = require('express');
const path = require('path');
const router = express.Router();

router.use(express.static(path.join(__dirname, '..', 'kfc-free', 'build')));
router.use('/*', (req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'kfc-free', 'build', 'index.html'));
})

module.exports = router;