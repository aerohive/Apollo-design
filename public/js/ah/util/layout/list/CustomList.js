define([ "dojo/_base/declare", 
		"dojo/on",
		"dojo/_base/lang",  
		"dojo/_base/array",
		"dojo/Deferred",
		"dojo/when",
		"dojo/dom-class",
		"ah/util/common/ModuleBase"
		],function(declare, on, lang, array, Deferred, when, domClass, ModuleBase){
			
		return declare('ah/util/layout/list/CustomList', [ModuleBase], {

			templateString : '<div class="ui-ip">'+
								'<div data-dojo-attach-point="ipElWrap" style="position:relative">'+
									'<input type="text" class="ui-ip-input" data-dojo-attach-point="ipEl" />'+
									'<span class="ui-ip-mark ui-ip-inactive" data-dojo-attach-point="ipMark"></span>'+
								'</div>'+
								'<div class="ui-ip-list" data-dojo-attach-point="ipList" style="display:none"></div>'+
							'</div>',

			_setClassAttr : {node : 'ipEl', type : 'class'},

			//listType : '',
			__typeMap : {
				'osDhcp' : 'services/config/common/osobjects/ostypes?type=2',
				'osHttp' : 'services/config/common/osobjects/ostypes?type=3'
			},

			noItemMsg : 'No Records found',

			scrollLimit : 12,
				
			//items : [],
			
			_setValueAttr : function(v){
				this.ipEl.value = v;
			},

			_getValueAttr : function(){
				return this.ipEl.value;
			},

			_setLenAttr : function(len){

				domClass[len > this.scrollLimit ? 'add' : 'remove'](this.ipList,'ui-ip-list-scroll');

				if(this.scrollHeight){
					this.ipList.style.height = len > this.scrollLimit ? this.scrollHeight + 'px' : 'auto';
				}

				this._set('len',len);
			},

			events : [
				['ipMark', 'click', '_handleToggleList'],
				['domNode', '.J-ip-item:click', '_handleClickItem'],
				[document, 'click', function(e){
					if(this !== this) return;
					if(this.$contains(this.domNode,e.target)) return;
					
					this._toggleList(0);
				}]
			],

			postCreate : function(){
				this.inherited(arguments);

				var url;

				if(this.listType && (url = this.__typeMap[this.listType])){
					this.$get(url, this._rendList);
				}else if(this.items){
					this._rendList(this.items);
				}else{
					this._rendList([]);
				}
			},

			_rendList : function(resp){
				var data = Array.isArray(resp) ? resp : resp.data;

				this.set('len', data.length);
				this.set('datas', data);
				
				this.fetchData(data, lang.hitch(this,this._makeList));
			},

			_makeList : function(data){

				var ul = document.createElement('ul');

				ul.className = 'item-area';


				if(data.length){
					array.forEach(data, function(item){
						var li = document.createElement('li');
						li.className = 'J-ip-item';
						li.innerHTML = item;
						li.setAttribute('data-val', item);

						ul.appendChild(li);
					});
				}else{
					ul.innerHTML = '<li>'+this.noItemMsg+'</li>';
				}

				this.ipList.appendChild(ul);

			},

			_handleToggleList : function(e){
				this._toggleList();	
			},

			_handleClickItem : function(e){
				var val = e.target.getAttribute('data-val');
				
				this.set('value', val);
				this._toggleList(0);

				this.onItemClick(val);
			},

			_toggleList : function(f){
				var flag = 'undefined' == typeof f ? this.$isHidden(this.ipList) : f;

				this.ipList.style.display = flag ? '' : 'none';

				domClass[flag ? 'add' : 'remove'](this.ipMark, 'ui-ip-active');

			},

			isPredefined : function(v){
				var datas = this.get('datas');

				if(!datas) return;

				//TODO just for ['',''] now, may need [{},{}]
				return datas.indexOf(v) !== -1;
			},
			
			fetchData : function(data, callback){
					
				callback(data);
			},

			onItemClick : function(){}

		});

});
