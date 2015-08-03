define(["dojo/_base/declare",
		'dojo/_base/lang',
		"dojo/text!./templates/tab.html",
	  	"ah/util/common/ModuleBase"], function(declare, lang, template, ModuleBase) {

	return declare("ah/app/design/components/tab", [ ModuleBase ], {

		templateString : template
	
	});

});
