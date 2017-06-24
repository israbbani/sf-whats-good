let Promise = require('bluebird'),
	request = require('request'),
	databaseHelper = require('../utilities/database-helper')();

const credentials = require('../../config/public-api-credentials.json');

const urls = {
	events: 'https://www.eventbriteapi.com/v3/events/search'
};

function eventbriteEvents() {

	function getEvents(params, callback = undefined) {
		console.log(params.page);
		return new Promise((resolve, reject) => {
			request({
				method: 'GET',
				uri: urls.events,
				qs: {
					'location.latitude': 37.770841,
					'location.longitude': -122.468359,
					'location.within': '10mi',
					'token': 'GGRLE35HJKNCYCWADU5C',	
					'start_date.range_start': params.start,
					'start_date.range_end': params.end,
					'page': params.page
				}
			}, (err, data) => {
				if (err) reject(err);
				try {
					resolve(JSON.parse(data.body));
				} catch(err) {
					reject(err);
				}
			});
		}).nodeify(callback);
	}

	function addEvents(params, callback = undefined) {
		return new Promise((resolve, reject) => {
			getEvents(params, (err, data) => {
				if (err) reject(err);
				var promises = []
				for (var i = 1; i <= data.pagination.page_count; i++) {	
					params.page = i;
					promises.push(new Promise((resolve, reject) => {
						getEvents(params, (err, data) => {
						let events = data.events;
							console.log('Attempting insertion of ' + events.length + ' events from Eventbrite');
							databaseHelper.write({
								collectionName: 'events'
							}, events)	
							.then(res => {
								console.log(res.insertedCount + ' records inserted successfully for Eventbrite');	
								resolve(res);
							})
							.catch(err => {
								reject(err);
							});						
						});
					}))
				}
				Promise.all(promises)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
			});
		}).nodeify(callback);
	}

	return {
		addEvents
	};

}

module.exports = eventbriteEvents;