const mongodb = require('mongodb').MongoClient,
	Promise = require('bluebird'),
	request = require('request');

const credentials = require('../../config/database-credentials');

function databaseHelper() {

	function handleError(db, reject, err) {
		db.close();
		reject(err);
	}

	function connect() {
		mongodb.connect(credentials.uri, (err, db) => {
			if (err) throw err;
			console.log("Connected successfully to server");
			db.close();
		});
	}

	function write(args, data, callback = undefined) {
		return new Promise((resolve, reject) => {
			mongodb.connect(credentials.uri, (err, db) => {
				if (err) handleError(db, reject, err);
				db.collection(args.collectionName).insertMany(data, (err, data) => {
					if (err) handleError(db, reject, err);
					db.close();
					resolve(data);
				})
			})
		}).nodeify(callback);
	}

	function read(args, callback = undefined) {
		return new Promise((resolve, reject) => {
			mongodb.connect(credentials.uri, (err, db) => {
				if (err) handleError(db, reject, err);
				db.collection(args.collectionName).find(args.criteria).limit(args.limit).toArray((err, data) => {
					if (err) handleError(db, reject, err);
					db.close();
					resolve(data);
				});
			});
		}).nodeify(callback);
	}

	return {
		connect,
		write,
		read
	};
}

module.exports = databaseHelper;