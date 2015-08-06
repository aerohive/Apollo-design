define(["dojo/_base/declare",
		'dojo/_base/lang',
		"dojo/text!./templates/experience.html",
        "ah/config/siderConfig",
	  	"ah/util/common/ModuleBase",
        "ah/app/common/__doctpl"], function(declare, lang, template, configs, ModuleBase, __doctpl) {

	return declare("ah/app/common/experience", [ ModuleBase, __doctpl], {

		templateString : template,

        postMixInProperties : function(){
			this.inherited(arguments);

			this._mods = {};

            this.__items = configs.experience.items;
			this.__siderClickItem = lang.hitch(this, this._handleToggleMod);
		}  
	
	});

});
