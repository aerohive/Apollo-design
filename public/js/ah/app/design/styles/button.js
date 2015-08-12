define(['dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/text!./templates/button.html',
		'ah/app/design/__doc'],
		function(declare, lang, template, __doc) {

	return declare("ah/app/design/styles/button", [ __doc ], {

		templateString : template

	});

});
