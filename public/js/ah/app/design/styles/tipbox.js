define(['dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/text!./templates/tipbox.html',
		'ah/app/design/__doc'],
		function(declare, lang, template, __doc) {

	return declare("ah/app/design/styles/tipbox", [ __doc ], {

		templateString : template

	});

});
