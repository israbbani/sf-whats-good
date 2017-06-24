let moment = require('moment')
	momentTz = require('moment-timezone')

let eventbriteEvents = require('./app/services/eventbrite-events.service')(),
	meetupEvents = require('./app/services/meetup-events.service')();

let start = moment().startOf('day').tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm:ss'),
	end = moment().endOf('day').tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm:ss');

// eventbriteEvents.addEvents({ start, end })
// .then(res => {
// 	console.log('Migration from Eventbrite completed');
// })
// .catch(err => {
// 	console.log(err);
// });

meetupEvents.addEvents({})
.then(res => {
	console.log('Migration from Meetup completed');
})
.catch(err => {
	console.log(err);	
})