define(["dojo/_base/declare",
		'dojo/_base/lang',
		"dojo/text!./templates/tab.html",
	  	"ah/util/common/ModuleBase"], function(declare, lang, template, ModuleBase) {

	return declare("ah/app/design/components/tab", [ ModuleBase ], {

		templateString : template,

		postMixInProperties : function(){
			this.inherited(arguments);

			this.__demoTpl = '<div>Hello world.</div>';
			this.__codeTpl = 'var x = 0;'
		}
	
	});

});
