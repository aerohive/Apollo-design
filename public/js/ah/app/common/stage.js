define(["dojo/_base/declare",
		"dojo/text!./templates/stage.html",
	  	"ah/util/common/ModuleBase",
        "ah/app/stage/word"], function(declare, template, ModuleBase) {

	return declare("ah/app/common/stage", [ ModuleBase ], {

		templateString : template
	
	});

});
