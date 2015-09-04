define(["dojo/_base/declare",
		'dojo/_base/lang',
		"dojo/text!./templates/tab.html",
        "dojo/i18n!./nls/tab",
	  	"ah/app/design/__doc"], function(declare, lang, template, i18n, __doc) {

	return declare("ah/app/design/components/tab", [ __doc ], {

		templateString : template,

        i18n : i18n
	
	});

});
