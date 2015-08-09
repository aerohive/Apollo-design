define(["dojo/_base/declare",
		'dojo/_base/lang',
		"dojo/text!./templates/components.html",
	  	"ah/util/common/ModuleBase",
        "ah/config/siderConfig",
        "ah/app/common/__doctpl"], function(declare, lang, template, ModuleBase, configs, __doctpl) {

	return declare("ah/app/common/component", [ ModuleBase, __doctpl ], {

		templateString : template,

		events : [
		],

		postMixInProperties : function(){
			this.inherited(arguments);

			this._mods = {};

            this.__items = configs.components.items;
			this.__siderClickItem = lang.hitch(this, this._handleToggleMod);
		}
	
	});

});
