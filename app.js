var express = require('express');

var _ = require('lodash');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var requestify = require('requestify');

// Set up nutritionix API
var NutritionixClient = require('nutritionix');
var nutritionix = new NutritionixClient({
  appId: 'dadd6670',
  appKey: 'e2e2b0dfbeeebfe033dc7cf07b1d0dca'
});

// Routes
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
console.log('Listening on port 3000! \n');

app.set('port', process.env.PORT || 3700);

// Set up socket.io
var io = require('socket.io').listen(app.listen(app.get('port')));

io.sockets.on('query', function (data){
    console.log('Just received query: ');
    console.log(data);
});

io.sockets.on('connection', function (socket) {
  console.log('Connection established to socket.io\n');

    // Getting autocomplete suggestion list from Nutritionix API
    socket.on('suggestion', function (data) {
        console.log('suggestion received from frontend\n');
        console.log('Suggestion: ' + data);

        nutritionix.autocomplete(data).then(sendResults, RequestErrorHandler);
    });

    // Fetching food information from Nutritionix API
    socket.on('search', function (searchTerm) {
        console.log('search received from frontend\n');
        console.log('searchTerm is: ' + searchTerm + '\n');
/*
        var response = request.post('https://api.nutritionix.com/v1_1/search/').form({
            "appId":"dadd6670",
            "appKey":"e2e2b0dfbeeebfe033dc7cf07b1d0dca",
            "query": searchTerm
        });
*/
        requestify.request('https://api.nutritionix.com/v1_1/search/', {
            method: 'POST',
            body: {
                "appId":"dadd6670",
                "appKey":"e2e2b0dfbeeebfe033dc7cf07b1d0dca",
                "query": searchTerm,
                "fields": [
                    "item_name",
                    "brand_name",
                    "upc",
                    "nf_calories"
                ]
            },
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        }).then( function(response) {
            //response.getBody();
            //socket.emit('suggestion', response.getBody());
            var hits = response.getBody().hits;

            console.log(hits[0]);
            console.log(hits[0].fields.brand_name);
            socket.emit('testings', hits[0].fields );
            console.log('response sent to frontend');
        });

        /*
        requestify.get('https://api.nutritionix.com/v1_1/search/')
            .then(function(response) {
                // Get the response body (JSON parsed or jQuery object for XMLs)
                response.getBody();
            }
        );*/

        console.log('emitted request');
        /*
        nutritionix.natural({
            q: searchTerm,
            // use these for paging
            limit: 10,
            offset: 0,
            // controls the basic nutrient returned in search
            search_nutrient: 'calories'
        }).then(sendSearchResults, RequestErrorHandler);
        */
    });

});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var query = {};
var q;
var window = this;

function autoSuccess(autoResults){
    q = autoResults[0].text;
    query = autoResults;
    console.log('autocomplete successful searching items using: %s'.green, q);
    save(autoResults);

    return query;
}

function sendResults(results) {
    console.log(results);
    console.log('emitting autocomplete results\n');
    io.sockets.emit('results', results);
    return results;
}

function sendSearchResults(nRes) {
    console.log(nRes);
    console.log('emitting search results\n');
    io.sockets.emit('searchResults', nRes);

    console.log('executed natural search: %d hits'.green, nRes.results.length);

    _.forEach(nRes.results, function(r){

        var query = r.parsed_query.query;
        var calories = _.find(r.nutrients, {attr_id: 208}) || {
                attr_id: null,
                value: null,
                unit: null,
                usda_tag: null
            };

        console.log(' - %s calories=%d'.green, query, calories.value);
    });

    return results;
}

function RequestErrorHandler(msg) {
    console.log('Request Error Handler!\n');
    console.log(msg);
    return function reqErrHndlr(e) {
        console.error(msg.red);

        if (_.isObject(e) && !(e instanceof Error)) {
            logJson(e);
        } else {
            console.error(e);
        }

        process.exit(1);

    };
}

function printLater(){
  setTimeout(function () {
    console.log(query);
    io.sockets.emit('query', query);
    console.log('I have emitted in printLater');
  }, 3000);
}

function save(result) {
  query = result;
  console.log('inside save\n');
  console.log(query);
  io.sockets.emit('query', query);
  console.log('emit the value: ');
  console.log(query);
}

//console.log('Logging query: ' + query);
//console.log('Logging q: ' + q);

module.exports = app;
