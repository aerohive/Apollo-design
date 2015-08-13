define(["dojo/_base/declare",
		'dojo/_base/lang',
		'ah/vendor/highlight',
        'dojo/dom-class',
	  	"ah/util/common/ModuleBase"], function(declare, lang, hjs, domClass, ModuleBase) {

	return declare("ah/app/common/DemoArea", [ ModuleBase ], {

		templateString : '<div class="code-box">'+
                            '<div class="code-box-demo">${!demoTpl}</div>'+
                            '<div class="code-box-info">${info}<span data-dojo-attach-point="arrowEl" class="code-box-arrow fa fa-chevron-circle-down"></span></div>'+
                            '<div style="display:none" data-dojo-attach-point="hjsArea" class="code-box-hjs"><pre data-dojo-attach-point="codeArea">${codeTpl}</pre></div>'+
                        '</div>',

        info : '',

        arrowDir : 'down',

		events : [
            ['arrowEl', 'click', '_toggleCodeBox']
        ],

		postMixInProperties : function(){
			this.inherited(arguments);

            var firstEl = this.srcNodeRef.firstElementChild,
                secondEl = firstEl.nextElementSibling;

			this.demoTpl = firstEl.outerHTML.replace(/stype/g,'type');
			this.codeTpl = secondEl.outerHTML;

            if(secondEl.nextElementSibling){
                this.info = secondEl.nextElementSibling.innerHTML;
            }

            this.srcNodeRef.removeChild(firstEl);
		},

		postCreate : function(){
			this.inherited(arguments);

			hjs.highlightBlock(this.codeArea);
		},

        _toggleCodeBox : function(){

            this.$toggleWipe(this.hjsArea);

            domClass.toggle(this.domNode, 'code-box-rotate');
        }
	
	});

});
