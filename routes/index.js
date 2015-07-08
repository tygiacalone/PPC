var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Protein per Calorie' });
});

/* GET home page. */
router.get('/bootstrap', function(req, res, next) {
  res.render('indexSmall', { intro: 'Macronutrient and nutrition data for your favorite foods and restaurants' });
});


module.exports = router;
