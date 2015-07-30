define(["dojo/_base/declare",
		"dojo/text!./templates/why.html",
	  	"ah/util/common/ModuleBase"], function(declare, template, ModuleBase) {

	return declare("ah/app/common/why", [ ModuleBase ], {

		templateString : template
	
	});

});
