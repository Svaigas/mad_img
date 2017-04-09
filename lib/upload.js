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
					imageName: Joi.string().required().description('Image Name to be saved'),
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
			return resizeImages(image.imageName, image.imagePath, image.sizeList);
		})
		.then(reply)
		.catch((error) => {
			return reply(error)
		});

	function resizeImages(imageName, imagePath, imageSizeList) {
		return new Promise(function(resolve, reject) {
			var id = shortid.generate();
			for (var im in imageSizeList) {
				let width = imageSizeList[im].width;
				let height = imageSizeList[im].height;

				sharp(imagePath)
					.resize(width, height)
					.toBuffer()
					.then(uploadAWS.bind(null, id, width, height))
					.catch(err => {
						reject(err);
					});
			}
			resolve('example');
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
			s3.putObject(params, function(perr, pres) {
				if (perr) {
					console.log("Error uploading data: ", perr);
				} else {
					console.log("Successfully uploaded data to myBucket/myKey");
				}
			});

		});
		resolve(null);
	}

}