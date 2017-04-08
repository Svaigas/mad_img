exports.routes = [{
	method: 'GET',
	path: '/helloWorld',
	config: {
		handler: handlerHW,
		description: 'helloworld handler'
	}
}]

function handlerHW(request, reply)
{
	reply('Hello World');
}