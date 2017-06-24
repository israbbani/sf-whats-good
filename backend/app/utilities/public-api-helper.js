const Promise = require('bluebird'),
	  request = require('request');

const credentials = require('../../config/public-api-credentials.json');

const apis = {
	eventbrite: {
		base: 'https://www.eventbriteapi.com/v3/',
		search: 'events/search'
	}
}

function publicApiHelper() {

	function requestHandler(resolve, reject) {
		return (err, data) => {
			if (err) throw reject(err);
			resolve(data.body);
		}
	}

	function getApiSecret(clientName) {
		try {
			return credentials[clientName].secret;
		} catch(err) {
			return err;
		}
	}

	function search(apiName, callback = undefined) {
		return new Promise((resolve, reject) => {
			request({
				method: 'GET',
				uri: apis[apiName].base + apis[apiName].search,
				qs: {
					'location.address': 'San Francisco',
					'location.within': '10mi',
					'token': 'GGRLE35HJKNCYCWADU5C',	
					'start_date.keyword': 'today'
				}
			}, requestHandler(resolve,reject))
		}).nodeify(callback)
	}

	return {
		search
	}

}

module.exports = publicApiHelper;