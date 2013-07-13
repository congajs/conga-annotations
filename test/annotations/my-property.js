var Annotation = require('../../lib/Annotation');

module.exports = Annotation.extend({

	annotation: 'MyProperty',

	targets: [Annotation.PROPERTY],

	something: null,
	foos: null
	
});