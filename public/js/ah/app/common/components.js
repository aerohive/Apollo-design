define(["dojo/_base/declare",
		"dojo/text!./templates/components.html",
	  	"ah/util/common/ModuleBase"], function(declare, template, ModuleBase) {

	return declare("ah/app/common/component", [ ModuleBase ], {

		templateString : template
	
	});

});
