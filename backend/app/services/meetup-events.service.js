import doWhilst from 'async/doWhilst';

let Promise = require('bluebird'),
	request = require('request'),
	parseLinkHeaders = require('parse-link-header'),
	databaseHelper = require('../utilities/database-helper')();

const credentials = require('../../config/public-api-credentials.json');

const urls = {
	events: 'https://api.meetup.com/find/events'
};

function meetupEvents() {

	function addEvents(params, callback = undefined) {
		return new Promise((resolve, reject) => {
			doWhilst((err, res, getEvents) => {
				if (err) reject(err);		
				getEvents(params)
				console.log(data);
			}, (res) => {
				if (res.data.length > 0) return true;
				return false
			}, (err, data) => {
				if (err) reject(err);
				resolve(data);
			})
		}).nodeify(callback);


	function paginationTest(response) {
		if 
	}

	function getEvents(params, callback = undefined) {
		return new Promise((resolve, reject) => {
			request({
				method: 'GET',
				uri: urls.events,
				qs: {
					'lat': 37.770841,
					'lon': -122.468359,
					'radius': '20',
					'sign': true,
					'key': '683374798055957322910172013695d'	
				}
			}, (err, response, body) => {
				if (err) reject(err);
				try {
					resolve({
						link: response.headers.link,
						events: JSON.parse(body)
					});
				} catch(err) {
					reject(err);
				}
			});
		}).nodeify(callback);
	}

	function addEvents2(params, callback = undefined) {
		return new Promise((resolve, reject) => {
			getEvents(params, (err, data) => {
				if (err) reject(err);
				let promises = [];
				let link = parseLinkHeaders(data.link);
				request(link.next.url, (err, res, body) => {
					try {
						let data = JSON.parse(body);
						if (body.length > 0) {

							// add to database
							// request again
						}
					}
					if (err) throw err;
					console.log(res);
				});
				// let headers = parseHeaders(data.headers);
				// console.log(headers);	
				// request(data.headers.link, (err, data) => {
				// 	if (err) throw err;
				// 	console.log(data);
				// })
				// console.log(data);
				// if (data.headers && data.headers.link) {

				// }
				resolve(data);
			});
			// 	var promises = []
			// 	for (var i = 1; i <= data.pagination.page_count; i++) {	
			// 		params.page = i;
			// 		promises.push(new Promise((resolve, reject) => {
			// 			getEvents(params, (err, data) => {
			// 			let events = data.events;
			// 				console.log('Attempting insertion of ' + events.length + ' events from Eventbrite');
			// 				databaseHelper.write({
			// 					collectionName: 'events'
			// 				}, events)	
			// 				.then(res => {
			// 					console.log(res.insertedCount + ' records inserted successfully for Eventbrite');	
			// 					resolve(res);
			// 				})
			// 				.catch(err => {
			// 					reject(err);
			// 				});						
			// 			});
			// 		}))
			// 	}
			// 	Promise.all(promises)
			// 	.then(res => {
			// 		resolve(res);
			// 	})
			// 	.catch(err => {
			// 		reject(err);
			// 	});
			// });
		}).nodeify(callback);
	}

	return {
		addEvents
	};

}

module.exports = meetupEvents;