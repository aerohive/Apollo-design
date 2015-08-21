define(["dojo/_base/declare",
		'dojo/_base/lang',
		"dojo/text!./templates/chosen.html",
	  	"ah/app/design/__doc"], function(declare, lang, template, __doc) {

	return declare("ah/app/design/components/chosen", [ __doc ], {

		templateString : template

	});

});
