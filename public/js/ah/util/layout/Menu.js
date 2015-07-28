define([
		'dojo/_base/declare',"dijit/_WidgetBase", 'ah/util/common/Base', "dojo/Evented","dojo/mouse",
		'dojo/on','dojo/_base/lang',"dojo/_base/array", "dojo/dom-construct","dojo/dom-class","dojo/dom-geometry",'dojo/window'
		],function(declare, _WidgetBase, Base, Evented, mouse, on, lang, array, domCon, domClass, domGeo, win){

		return declare('ah/util/layout/Menu',[_WidgetBase, Evented, Base],{

			bReplace : true,

			wrapEl : '<div></div>',

			_typeMap : {
				'medium' : ['ui-menu-medium', 200],
				'large' : ['ui-menu-large',240]
			},

			//theme : '',

			/*items : [
				{name : 'Port Type', title : true, icon : 'wired'},
				{name : 'Reboot', children : [{name : 'AP123'}]},
				{name : 'Assign Location', children : [{name : 'AP230'}]},
				{name : 'Bootstrap Config'}
			],*/

			items : {
				'ap' : [
					{name : 'Reboot', children : [{name : 'AP123'}, {name : 'AP220'}]},
					{name : 'Assign Location', children : [{name : 'AP230'}]},
					{name : 'Bootstrap Config'}
				],
			   	'switch' : [
					{name : 'Switch re', children : [{name : 'Switch123'}]},
					{name : 'Switch Config'}
				]
			},

			btnText : 'Test',


			type : '__',


			action : 'mouse',

			/*_setHiddenAttr : function(list){
				var list = lang.isArray(list) ? list : [list];

				if(!list || !list.length) return;

				array.forEach(list, function(name){
					this._child[name].style.display = 'none';
				}, this);
			},*/

			_setTypeAttr : function(type){
				if(!this._list) return;

				if(!this._list[type]) return;

				if(this._curUl && !this.$isHidden(this._curUl)){
					this._curUl.style.display = 'none';
				}

				this._curUl = this._list[type];

				this._set('type', type);
			},

			

			buildRendering : function(){

				this.domNode = domCon.toDom(this.wrapEl);
				domClass.add(this.domNode, 'ui-menu');

				if(this.bReplace){
					this._btn = domCon.toDom('<button class="ui-menu-btn">'+this.btnText+'</button>');
				}else{
					this._btn = this.srcNodeRef.cloneNode(true);
				}

				this.domNode.appendChild(this._btn);

				this._list = {};

				if(lang.isArray(this.items)){
					this.domNode.appendChild(this._list.__ = this._makeMenu(this.items));
				}else{
					for(var i in this.items){
						this.domNode.appendChild(this._list[i] = this._makeMenu(this.items[i],i));
					}
				}

			},

			postCreate : function(){
				this.inherited(arguments);

				// hack for bReplace false not need extra class
				if(!this.bReplace){
					this.domNode.className = 'ui-menu';
				}

				if(this.theme){
					domClass.add(this.domNode,this._typeMap[this.theme][0] || '');
					this._trlWidth = this._typeMap[this.theme][1];
				} else {
					this._trlWidth = 150;
				}

				this._bindUI();
			},

			_bindUI : function(){
				this.own(
					on(this._btn, 'click', lang.hitch(this, this._disMenu)),
					on(document, 'click', lang.hitch(this, function(e){
						if(e.target === this._btn) return;

						this._curUl && this._curUl.style.display != 'none'/*!this.$isHidden(this._curUl)*/ && (
								this._curUl.style.display = 'none',
								this.$query('.ui-menu-list', this._curUl).style('display', 'none')
							)
					}))
				);
			},

			_makeMenu : function(items, i){
				if(!items) return;

				var ul = domCon.toDom('<ul class="ui-menu-list"></ul>'),
					d;

				array.forEach(items, function(item){
					var name = item.name,
						arr = name.split(/\s+/),
						type, link, dd;

					arr[0] = arr[0].toLowerCase();
					type = item.type || arr.join('');

					d = domCon.toDom('<li class="ui-menu-item"></li>');

					if(!item.title){
						d.appendChild(link = domCon.toDom('<a>'+name+'</a>'));
					}else{
						d.appendChild(domCon.toDom('<span class="ui-menu-title"><span class="ui-menu-icon ui-menu-'+item.icon+'-icon"></span>'+name+'</span>'));
					}

					if(item.children){

						(this._parentStore || (this._parentStore = {}))[type] = item.children;
						(this._parent || (this._parent = {}))[(i ? i+'_' : '') + type] = d;

						domClass.add(d, 'ui-menu-item-pa');
						link.appendChild(domCon.toDom('<span class="ui-icon ui-icon-next"></span>'));
						d.appendChild(dd = this._makeMenu(item.children));

						if(this.action == 'click'){
							link && this.own(on(link, 'click', lang.hitch(this, this._toggleArea, dd)));
						}else if(this.action == 'mouse'){
							link && this.own(on(d, mouse.enter, lang.hitch(this, this._enterMenu, dd)));
							link && this.own(on(d, mouse.leave, lang.hitch(this, this._leaveMenu, dd)));
						}

					}else{
						(this._child || (this._child = {}))[type] = d;
						link && this.own(on(link, 'click', lang.hitch(this,this._handleAction, type)));
					}

					ul.appendChild(d);

				}, this);

				return ul;

			},

			getChildrenData : function(type){
				return this._parentStore[type] || [];
			},

			hide : function(list){
				this._toggle(list, true);
			},

			show : function(list){
				this._toggle(list);
			},

			_toggle : function(list, f){
				var list = lang.isArray(list) ? list : [list];

				if(!list || !list.length) return;

				array.forEach(list, function(item){
					var el = this._child[item] || this._parent[item];
					//this._child[item] && (this._child[item].style.display = f ? 'none' : 'block');
					el && (el.style.display = f ? 'none' : 'block');
				}, this);
			},

			_enterMenu : function(ul, e){
				ul.style.display = 'block';
			},

			_leaveMenu : function(ul, e){
				ul.style.display = 'none';
			},

			_toggleArea : function(ul, e){
				e.preventDefault();
				//e.stopPropagation();

				var	isA = e.target.tagName == 'A',
					f = this.$isHidden(ul),
					dis = f ? 'block' : 'none';

				if(f && this._ul && this._ul !== ul && isA){
					this._ul.style.display = 'none';
				}

				ul.style.display = dis;

				!f && this.$query('.ui-menu-list',ul).style('display',dis);

				isA && (this._ul = ul);

				

			},

			_disMenu : function(e){
				var w = win.getBox().w, obj;

				this.emit('btn',{}); 
				this._toggleArea(this._curUl, e);

				// decide lt or rt
				obj = domGeo.position(this._curUl);
				f = w < obj.x + obj.w + this._trlWidth;

				domClass[f ? 'add' : 'remove'](this.domNode, 'ui-menu-lt');
				domClass[f ? 'remove' : 'add'](this.domNode, 'ui-menu-rt');
			},

			_handleAction : function(type, e){
				this.emit('hook', type);
				this.emit(type, {});
			}



		});
});
