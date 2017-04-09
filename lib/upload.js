/**
 * @module upload
 * @description Implementation of upload API that provides a mechanism
 * to import and resize image object 
 */
'use strict'
var Joi = require('joi');
var Path = require('path');
var Promise = require('bluebird');
var Fs = require('fs');
var sharp = require('sharp');
var shortid = require('shortid');
var AWS = require('aws-sdk');
var Boom = require('boom');
var _ = require('lodash');

exports.routes = [{
	method: 'POST',
	path: '/uploadImages/{batchID}',
	config: {
		handler: uploadHandler,
		description: 'Upload image handler',
		tags: ['api'],
		validate: {
			params: {
				batchID: Joi.number().required()
			},
			payload: Joi.array().items(
				Joi.object().keys({
					imagePath: Joi.string().required().description('Whole path to image'),
					sizeList: Joi.array().items(
						Joi.object().keys({
							width: Joi.number().positive().required().description('width'),
							height: Joi.number().positive().required().description('height'),
						})).description('List of sizes')
				})
			)
		}
	}
}]

function uploadHandler(request, reply) {
	return Promise.map(request.payload, function(image) {
			var id = shortid.generate();
			return resizeImages(id, image.imagePath, image.sizeList)
		})
		.then(reply)
		.catch((error) => {
			return reply(error)
		});

	function resizeImages(id, imagePath, imageSizeList) {
		return new Promise.map(imageSizeList, function(size) {
			let width = size.width;
			let height = size.height;

			return sharp(imagePath)
				.resize(width, height)
				.toBuffer()
				.then(uploadAWS.bind(null, id, width, height))
				.catch(err => {
					reject(err);
				});
		});
	}

	function uploadAWS(id, width, height, buffer) {
		return new Promise(function(resolve, reject) {
			AWS.config.update({
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_TOKEN,
				signatureVersion: 'v4'
			});

			let params = {
				Bucket: process.env.MAD_IMG_BUCKET,
				Key: id + '_' + width + '_' + height + '.jpg',
				Body: buffer
			};

			let s3 = new AWS.S3();
			s3.putObject(params, function(err, inf) {
				if (err) {
					reject("Error uploading data: ", err);
				} else {

				}
			});
			let url = 'https://' + params.Bucket + '.' + s3.endpoint.host + '/' + params.Key;
			var responseObject = {
				"url": url,
				"width": width,
				"height": height
			};
			resolve(responseObject);
		});
	}

}