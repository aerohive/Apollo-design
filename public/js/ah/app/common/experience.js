define(["dojo/_base/declare",
		"dojo/text!./templates/experience.html",
	  	"ah/util/common/ModuleBase"], function(declare, template, ModuleBase) {

	return declare("ah/app/common/experience", [ ModuleBase ], {

		templateString : template
	
	});

});
