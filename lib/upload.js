'use strict'
var Joi = require('joi');
var Promise = require('bluebird');

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
							size: Joi.string().required().description('Size to resize')
						})).description('List of sizes')
				})
			)
		}
	}
}]

function uploadHandler(request, reply) {
	reply('test');
}