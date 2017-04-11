/**
 * @module search
 * @description Implementation of API to retrieve information about
 * mongo DB object 
 */
'use strict'
var Promise = require('bluebird');
var Joi = require('joi');
var mongodb = require('mongodb');
var Boom = require('boom');

exports.routes = [{
	method: 'GET',
	path: '/image/{imageID}',
	config: {
		handler: getImage,
		description: 'helloworld handler',
		tags: ['api'],
		validate: {
			params: {
				imageID: Joi.string().min(24).max(24).required()
			}
		}
	}
}]

/**
 * @description Handler for the search file on mongoDB
 */
function getImage(request, reply) {

	// 1. get imageID from request params  
	// 2. connect to DB and search for object, by id
	// 3. return DB object
	return getImageInfo(request.params.imageID)
		.then(reply)
		.catch((error) => {
			return reply(error)
		});

	/*
	 * @description get image object, by imageID
	 * @params {String} imageID - 24 length string
	 * @returns A promise that resolves to the resolve or reject
	 */
	function getImageInfo(imageID) {
		return new Promise(function(resolve, reject) {
			var MongoClient = mongodb.MongoClient;
			var url = process.env.MAD_IMG_MONGO;

			MongoClient.connect(url, function(err, db) {
				if (err)
					reject('Unable to connect DataBase', err)
				else {
					var collection = db.collection('images');
					var ObjectId = require('mongodb').ObjectID;
					collection.findOne({
						"_id": new ObjectId(imageID)
					}, function(err, res) {
						if (!res)
							reject(Boom.badRequest('Unable to get object from DataBase, id : ' + imageID));
						else
							resolve(res);
					});
				}
			})
		})
	}
}