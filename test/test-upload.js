var Code = require('code')
var Glue = require('glue')
var Fs = require('fs')
var Path = require('Path')
var FormData = require('form-data')
var streamToPromise = require('stream-to-promise')

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

describe('Upload.js: @testing', function() {
	it('S123431242n', (done) => {

		var image = {
			filedata: Fs.readFileSync(Path.join(__dirname, '1920x1080test.jpg')).toString('base64'),
			sizeList: '[{"width":320,"height":640},{"width":600,"height":600}]'
		};

		var form = new FormData();

		// Fill the form object
		Object.keys(image).forEach(function(key) {
			form.append(key, image[key]);
		});
		streamToPromise(form).then(function(payload) {
			server.inject({
				method: 'POST',
				url: prefix + '/uploadImages/metadata',
				headers: form.getHeaders(),
				payload: payload
			}, (res) => {
				expect(res.statusCode).to.equal(200);
				done();
			})
		})
	})

})