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
                            '<ul class="search-result" data-dojo-attach-point="ulEl"></ul>'+
                         '</div>',

        placeholder : 'search component...',

        //bOpen : false,

        events : [
            ['searchEl', 'focus', '_toggleResult', true],
            ['searchEl', 'keyup', '_changeResult'],
            [document, 'click', function(e){
                if(e.target !== this.searchEl){
                    this._toggleResult(false);
                }
            }],
            ['domNode', '.search-list-item:click', '_handleGotoWidget']
        ],

        postMixInProperties : function(){
            this.inherited(arguments);

            data.search.items.forEach(function(item, i){
                var label = item.label, reg = /\s+/;

                (this._dataMap || (this._dataMap = {}))[label.split(reg)[0].toLowerCase()] = item;
            }, this);
        },    

        postCreate : function(){
            this.inherited(arguments);

            this._keyMaps = {};
            
            this._makeResult(data.search.items);
        },

        startup : function(){
            this.inherited(arguments);

            var p = domGeo.position(this.searchEl, false),
                w = p.w;

            this.ulEl.style.width = w + 'px';
        },

        _toggleResult : function(f){
            domClass[f ? 'add' : 'remove'](this.ulEl, 'search-result-open');

            //this.set('bOpen', f);
        },
        
        _makeResult : function(d, key){
            var str = '', key = key || 'all';
            
            d.forEach(function(item, i){
                str += '<li class="search-list-item" data-w="'+item.widget+'">'+item.label+'</li>';
            });

            this.ulEl.innerHTML = this._keyMaps[key] = str;
        },

        _handleGotoWidget : function(e){
            this.onClickItem(e.target.getAttribute('data-w'));
        },

        _changeResult : function(e){
            var t = e.target,
                val = t.value.trim().toLowerCase(),
                reg = new RegExp('^'+val), html;

            this._timer && this._timer.remove();
            
            this._timer = this.defer(function(){
                var i, arr = [];

                if(html = this._keyMaps[val]){
                    this.ulEl.innerHTML = html;
                    return;
                }

                for(i in this._dataMap){
                    reg.test(i) &&
                        arr.push(this._dataMap[i]);       
                }

                this._makeResult(arr, val);

            }, 1e2);

        },

        onClickItem : function(){}

    });

});
