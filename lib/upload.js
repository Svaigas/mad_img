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
			//console.log(image.imageName);
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
					.toBuffer()
					.then(data => {
						sharp(data)
							.resize(width, height)
							.toFile('f:/PRACA/!PROJECTS/mad_img/process/' + id + '_' + width + '_' + height + '.jpg', (err, info) => {
								reject(err)
							});
					})
					.catch(err => {
						reject(err);
					});
			}
			resolve('whatever');
		});
	}

}