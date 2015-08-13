define(["dojo/_base/declare",
		'dojo/_base/lang',
		"dojo/text!./templates/menu.html",
		"ah/config/MenuData",
	  	"ah/app/design/__doc"], function(declare, lang, template,MenuData, __doc) {

	return declare("ah/app/design/components/menu", [ __doc ], {

		templateString : template,

		postMixInProperties : function(){

			this.__utilitesItems = MenuData.device.utility;

			this.__actionItems = MenuData.device.actions.items;

		}
	
	});

});
