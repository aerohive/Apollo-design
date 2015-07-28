define([
		'dojo/_base/declare', 'ah/util/common/ModuleBase','dojo/on','dojo/_base/lang',
		"dojo/_base/array", "dojo/dom-class", 'ah/util/layout/Tag'
		],function(declare, ModuleBase, on, lang, array, domClass, Tag){

		return declare('ah/util/layout/list/TagList',[ModuleBase],{

			templateString : '<div><ul class="ui-tag clearfix" data-dojo-attach-point="tagEl"></ul><a href="#" data-dojo-attach-point="revertEl" style="display:none">Revert</a></div>',

			items : [
				{name : 'Applications', value : 'apps', icon : 'app'},
				{name : 'Models', value: 'model', icon : 'model'}
			],

			target : '',

			/*
			_setBRevertAttr : function(n){
				this.revertEl.style.display = n ? '' : 'none'
			},
			*/

			events : [
				//['revertEl', 'click', '_handleRevert']
			],


			_getValueAttr: function(){
				var arr = [];
				array.forEach(this._tags, function(i){
					arr.push(i.get('value'));
				});
				return arr.join(',');
			},

			postMixInProperties: function () {
				this.inherited(arguments);

				//this._fns = [];
			},

			postCreate : function(){
				this.inherited(arguments);

				this._tags = [];

				this.rendUI();
			},

			rendUI : function(){
				if(this.target){
					this.$get(this.target, function(resp){
						var data = resp.data;

						this.makeTags(data);
					});
				}else if(this.items){
					this.makeTags(this.items);
				}
			},

			refresh: function(data){
				this.tagEl.innerHTML = '';
				this._tags = [];
				this.makeTags(data);
			},

			makeTags : function(items){

				array.forEach(items, function(item, i){

					var tag = new Tag({
						value: item.value,
						name : item.name,
						icon : item.icon
					});

					tag.placeAt(this.tagEl, 'last');

					tag.on('mouseEnter', lang.hitch(this, function(value){this.onMouseEnter(value)}));
					tag.on('mouseLeave', lang.hitch(this, function(value){this.onMouseLeave(value)}));
					tag.on('itemClose', lang.hitch(this, function(tag){this.onItemClose(tag.value)}));
					tag.on('itemRevert', lang.hitch(this, function(tag){this.onItemRevert(tag.value)}));

					this._tags.push(tag);

				}, this);

			},

			/*
			_handleTagClose : function(tag){
				this.onItemClose(tag.name);

				this._addActions(lang.hitch(this,function(){tag.show(); this.onRevert(tag.name);}));
			},

			_handleRevert : function(e){
				e.preventDefault();
				this._fns.pop()();

				this.set('bRevert', this._fns.length);
			},

			_addActions : function(fn){
				this._fns.push(fn);

				this.set('bRevert', this._fns.length);
			},
			*/

			destroy : function(){
				this.inherited(arguments);

				array.forEach(this._tags, function(tag){
					tag.destroy();
				});
			},

			onMouseEnter : function(){},
			onMouseLeave : function(){},
			onItemClose : function(){},
			onItemRevert : function(){}

		});

	});
