define(["dojo/_base/declare",
		"dojo/text!./templates/word.html",
        "dojo/dom-class",
	  	"ah/util/common/ModuleBase"], function(declare, template, domCla, ModuleBase) {

	return declare("ah/app/stage/word", [ ModuleBase ], {

		templateString : template,

        events : [
            ['hEl', 'click', 'gotoComp']
        ],

        postCreate : function(){
            this.inherited(arguments);

            this.defer(function(){
                domCla.add(this.mEl, 'stage-word-matter-top');             
                this.defer(function(){
                    domCla.add(this.hEl, 'stage-word-help-top');             
                }, 6e2);
            }, 2e2);
        }
	
	});

});
