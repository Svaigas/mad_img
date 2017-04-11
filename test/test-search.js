var Code = require('code')
var Glue = require('glue')
var Fs = require('fs')
var Path = require('Path')

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var expect = Code.expect
var before = lab.before
var after = lab.after
var describe = lab.experiment
var it = lab.test

var manifest = null
var server = null
var prefix = '/image/v1'

before((done) => {
	var manifestFile = Path.join(__dirname, 'manifest.json')
	manifest = JSON.parse(Fs.readFileSync(manifestFile))
	Glue.compose(manifest, {
		relativeTo: process.cwd()
	}, (err, serv) => {
		expect(err).to.not.exist();
		if (server == null) {
			server = serv
			done();
		}
	})
})

describe('Search.js: @testing ', function() {
	it('Should return object, when given correct example id', (done) => {
		server.inject({
			method: 'GET',
			url: prefix + '/image/58ec7b5b9f09af17c069f8aa',
			credentials: {}
		}, (res) => {
			expect(res.statusCode).to.equal(200);
			done();
		})
	})

	it('Should return Bad Request, when given wrong example id', (done) => {
		server.inject({
			method: 'GET',
			url: prefix + '/image/58ec6b5b9f09af17c069f8aa',
			credentials: {}
		}, (res) => {
			expect(res.statusCode).to.equal(400);
			done();
		})
	})
})