define(['dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/text!./templates/title.html',
		'ah/app/design/__doc'],
		function(declare, lang, template, __doc) {

	return declare("ah/app/design/styles/title", [ __doc ], {

		templateString : template

	});

});
