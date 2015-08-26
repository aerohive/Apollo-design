define(["dojo/_base/declare",
		'dojo/_base/lang',
		"dojo/text!./templates/upload.html",
	  	"ah/app/design/__doc"], function(declare, lang, template, __doc) {

	return declare("ah/app/design/components/upload", [ __doc ], {

		templateString : template,

		cssFile: '/js/dijit/themes/dijit',

		postMixInProperties : function(){
			this.inherited(arguments);

			this.__changeFile = lang.hitch(this, this._changeFile);
		},
		_changeFile: function(){
			alert('File');
		}


	});

});
