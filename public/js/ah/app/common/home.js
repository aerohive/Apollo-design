define(["dojo/_base/declare",
		"dojo/text!./templates/home.html",
	  	"ah/util/common/ModuleBase"], function(declare, template, ModuleBase) {

	return declare("ah/app/common/home", [ ModuleBase ], {

		templateString : template
	
	});

});
