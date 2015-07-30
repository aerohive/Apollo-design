define(["dojo/_base/declare",
		"dojo/text!./templates/stage.html",
	  	"ah/util/common/ModuleBase"], function(declare, template, ModuleBase) {

	return declare("ah/app/common/stage", [ ModuleBase ], {

		templateString : template
	
	});

});
