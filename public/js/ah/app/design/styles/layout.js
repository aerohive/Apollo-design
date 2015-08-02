define(["dojo/_base/declare",
		'dojo/_base/lang',
		"dojo/text!./templates/layout.html",
	  	"ah/util/common/ModuleBase"], function(declare, lang, template, ModuleBase) {

	return declare("ah/app/design/styles/layout", [ ModuleBase ], {

		templateString : template
	
	});

});
