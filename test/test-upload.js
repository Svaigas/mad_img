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
var prefix = '/images/v1'

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

describe('Upload.js: @testing', function() {

	it('returns true when 1 + 1 equals 2', (done) => {

		Code.expect(1 + 1).to.equal(2);
		done();
	});
});