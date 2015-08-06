define(["dojo/_base/declare",
		'dojo/_base/lang',
		"dojo/text!./templates/base.html",
	  	"ah/util/common/ModuleBase"], function(declare, lang, template, ModuleBase) {

	return declare("ah/app/design/components/base", [ ModuleBase ], {

		templateString : template
	
	});

});
