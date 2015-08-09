define(["dojo/_base/declare",
		'dojo/_base/lang',
        'ah/vendor/markdown',
	  	"ah/util/common/ModuleBase"], function(declare, lang, marked, ModuleBase) {

	return declare("ah/app/design/__doc", [ ModuleBase ], {
            
        postCreate : function(){
            this.inherited(arguments);

            var markdownEl = this.markdown || this.$query('article')[0],
                txt = this.$text(this.$query('xmp')[0]);

            if(marked){
                markdownEl.innerHTML = marked(txt);
            }
               
        }
	
	});

});
