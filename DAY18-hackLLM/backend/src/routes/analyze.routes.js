const router = require('express').Router();
const { analyze } = require('../controllers/analyze.controller');
router.post('/thi', analyze);
module.exports = router;