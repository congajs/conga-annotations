var Annotation = require('../../lib/annotation');

module.exports = Annotation.extend({

	annotation: 'MyProperty',

	targets: [Annotation.PROPERTY],

	something: null,
	foos: null
	
});