define([ "dojo/_base/declare", 
		"dojo/on",
		"dojo/_base/lang",  
		"dojo/_base/array",
		"dojo/Deferred",
		"dojo/when",
		"ah/util/layout/list/__SelectItemNode",
		"ah/util/common/Base",
        "dijit/_TemplatedMixin",
		"dijit/_WidgetBase"],function(declare, on, lang, array, Deferred, when, ItemNode, Base, _TemplateMixin, _WidgetBase){
			
		return declare('ah/util/layout/list/SelectList', [_WidgetBase, _TemplateMixin, Base], {

			templateString : '<div><ul data-dojo-attach-point="listArea"></ul></div>',

			//target : '',
			//listType : '',

			displayName : 'name',
			
			__urlMap : {
				'schedule' : 'services/config/common/schedules',
				'macAddress' : 'services/config/common/macobjectprofiles/filter?jsonType=mac-address-profile,mac-oui-profile',
				'osDhcp' : 'services/config/common/osobjects/allosobjects?type=2',
				'osVersion' : 'services/config/common/osobjects/allosobjects?type=3'
			},

			noItemMsg : 'No Records found.',

			getSelected : function(){
				return array.filter(this._list, function(item){
					return item.get('selected');
				});
			},

			getSelectedData : function(){
				return array.map(this.getSelected(), function(item){ return item.data; });
			},


			/**
			 *@Param arr {Array} [{id:121}] or [id, id]
			 */
			_setSelectedAttr : function(arr){
				if(!arr || !arr.length) return;
				
				when(this._deferred, lang.hitch(this, function(){
					array.forEach(arr, function(item){
						var id = 'object' == typeof item ? item.id : item;
						this._itemMap[id].set('selected', true);
					}, this);
				}));
			},

			postMixInProperties : function(){
				this.inherited(arguments);
				
				this._deferred = new Deferred();
			},

			buildRendering : function(){
				this.inherited(arguments);

				this._createLoading();

			},

			postCreate : function(){
				this.inherited(arguments);

				this._list = [];
				this._itemMap = {};
				
				if(this.listType || this.target){
					this._fetchList();
				}else if(this.items){
					this._rendList(this.items);
				}else{
					this._rendList([]);
				}
			},

			add : function(data){
				this.listArea.insertBefore(this._makeNode(data).domNode, this.listArea.firstElementChild);
				this._noItemEl && (this._noItemEl.style.display = 'none');
			},

			_fetchList : function(){
				this.$get(this.target || this.__urlMap[this.listType], this._rendList);
			},

			_rendList : function(data){
				var items = lang.isArray(data) ? data : data.data,
					frag = document.createDocumentFragment(),
					li = document.createElement('li');

				li.innerHTML = this.noItemMsg;

				if(items && items.length){
					array.forEach(items, function(item){
					
						frag.appendChild(this._makeNode(item).domNode);

					},this);
					
					this.listArea.appendChild(frag);
				}else{
					
					this.listArea.appendChild(this._noItemEl = li);

				}


				this.loadEl.style.display = 'none';

				this._deferred.resolve();
			},

			_makeNode : function(item){
				var node;

				node = this._itemMap[item.id] = new ItemNode({itemName : item[this.displayName], data : item});

				this._list.push(node);

				return node;
			},

			_createLoading : function(){
				var div = document.createElement('div');			
				div.className = 'grid-mark';

				this.loadEl = div;

				this.domNode.style.position = 'relative';
				this.domNode.style.minHeight = '150px';
				this.domNode.appendChild(div);
			}

		});

});
