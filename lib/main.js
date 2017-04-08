'use strict'
var Joi = require('joi');

exports.routes = [{
	method: 'GET',
	path: '/image/{imageID}',
	config: {
		handler: handlerHW,
		description: 'helloworld handler',
		tags: ['api'],
	}
}]

function handlerHW(request, reply) {
	reply('Hello World');
}