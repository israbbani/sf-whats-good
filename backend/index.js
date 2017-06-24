const express = require('express'),
	  app = express();

const apiHelper = require('./app/utilities/public-api-helper')(),
	databaseHelper = require('./app/utilities/database-helper')();

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/getEvents', function(req, res, next) {
	databaseHelper.read({
		collectionName: 'events',
		criteria: {},
		limit: 20
	}, (err, data) => {
		if (err) res.send(err);
		res.send(data);
	})
});

app.get('/migration', function(req, res, next) {
	apiHelper.search('eventbrite', (err, data) => {
		if (err) throw err;
		try {
			let events = JSON.parse(data).events;
			console.log('Attempting insertion of ', events.length, ' records');
			databaseHelper.write({
				collectionName: 'events'
			}, events, (err, data) => {
				if (err) throw err;
				console.log(data.insertedCount, ' inserted successfully!');
			})
		} catch(err) {
			throw err;
		}
	});
});

app.listen(8080, function () {
  console.log('Node server running at 8080');
});

