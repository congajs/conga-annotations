var Annotation = require('../../lib/annotation');

module.exports = Annotation.extend({

	annotation: 'Nested',

	targets: [Annotation.METHOD],

	aString: null,
	anArray: [],
	anObject: {}

});