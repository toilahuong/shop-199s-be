const express = require('express');
const router = express.Router();
router.get('/user/login', (req, res) => {
    console.log('login');
});
module.exports =  router;