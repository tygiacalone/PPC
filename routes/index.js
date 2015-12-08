var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('indexSmall', { intro: 'Macronutrient and nutrition data for your favorite foods and restaurants' });
});

/* GET home page. */
router.get('/bootstrap', function(req, res, next) {
  res.render('indexSmall', { intro: 'Macronutrient and nutrition data for your favorite foods and restaurants' });
});

/* GET home page. */
router.get('/search', function(req, res, next) {
    res.render('search');
});

module.exports = router;
