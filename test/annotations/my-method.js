var Annotation = require('../../lib/annotation');

module.exports = Annotation.extend({

	annotation: 'MyMethod',

	targets: [Annotation.METHOD],

	singleHash: {},

	someHash: {},

	anArray: []
	
});