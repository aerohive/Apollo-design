define(["dojo/_base/declare",
		'dojo/_base/lang',
		"dojo/text!./templates/obscureInput.html",
	  	"ah/app/design/__doc"], function(declare, lang, template, __doc) {

	return declare("ah/app/design/components/obscureInput", [ __doc ], {

		templateString : template

	});

});
