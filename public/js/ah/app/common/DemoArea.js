define(["dojo/_base/declare",
		'dojo/_base/lang',
		'ah/vendor/highlight',
	  	"ah/util/common/ModuleBase"], function(declare, lang, hjs, ModuleBase) {

	return declare("ah/app/common/DemoArea", [ ModuleBase ], {

		templateString : '<div>${demoTpl}<pre><code>${codeTpl}</code></pre></div>',

		demoTpl : '',

		codeTpl : '',

		events : [],

		startup : function(){
			this.inherited(arguments);

			hjs.highlightBlock(this.$query('code')[0]);
		}
	
	});

});
