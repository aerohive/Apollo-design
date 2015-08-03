define(["dojo/_base/declare",
		'dojo/_base/lang',
		'ah/vendor/highlight',
	  	"ah/util/common/ModuleBase"], function(declare, lang, hjs, ModuleBase) {

	return declare("ah/app/common/DemoArea", [ ModuleBase ], {

		templateString : '<div>'+
                            '<div>${!demoTpl}</div>'+
                            '<pre data-dojo-attach-point="codeArea">${codeTpl}</pre>'+
                        '</div>',

		events : [],

		postMixInProperties : function(){
			this.inherited(arguments);

            var firstEl = this.srcNodeRef.firstElementChild;

			this.demoTpl = firstEl.outerHTML;
			this.codeTpl = firstEl.nextElementSibling.outerHTML;

            this.srcNodeRef.removeChild(firstEl);
		},

		postCreate : function(){
			this.inherited(arguments);

			hjs.highlightBlock(this.codeArea);
		}
	
	});

});
