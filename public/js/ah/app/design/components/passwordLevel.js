define(["dojo/_base/declare",
		'dojo/_base/lang',
		"dojo/text!./templates/passwordLevel.html",
	  	"ah/app/design/__doc"], function(declare, lang, template, __doc) {

	return declare("ah/app/design/components/passwordLevel", [ __doc ], {

		templateString : template

	});

});
