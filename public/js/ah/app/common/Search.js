define(["dojo/_base/declare",
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/dom-construct',
		'dojo/dom-class',
        'dojo/dom-geometry',
        'ah/config/siderConfig',
		'ah/util/common/ModuleBase'], function(declare, lang, array, domCon, domClass, domGeo, data, ModuleBase) {

	return declare('ah/app/common/Search', [ ModuleBase ], {

		templateString : '<div>'+
                            '<input type="text" data-dojo-attach-point="searchEl" class="search-text" placeholder="${placeholder}" />'+
                            '<span class="search-action"></span>'+
                            '<ul class="search-result" style="display:none" data-dojo-attach-point="ulEl"></ul>'+
                         '</div>',

        placeholder : 'search component...',

        events : [
            ['searchEl', 'focus', function(){this.$wipeIn(this.ulEl)}],
            ['searchEl', 'blur', function(){this.$wipeOut(this.ulEl)}],
            ['domNode', '.search-list-item:click', '_handleGotoWidget']
        ],

        postCreate : function(){
            this.inherited(arguments);
            
            this._makeResult();
        },

        startup : function(){
            this.inherited(arguments);

            var p = domGeo.position(this.searchEl, false),
                w = p.w;

            this.ulEl.style.width = w + 'px';
        },

        
        _makeResult : function(){
            var str = '';
            data.search.items.forEach(function(item, i){
                str += '<li class="search-list-item" data-w="'+item.widget+'">'+item.label+'</li>';
            });

            this.ulEl.innerHTML = str;
        },

        _handleGotoWidget : function(){
            //this.defer(function(){console.log('aaa');},2e2);
            console.log('aa');
        }

    });

});
