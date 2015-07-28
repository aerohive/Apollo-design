define([
		'dojo/_base/declare', 'ah/util/common/ModuleBase', "dojo/Evented","dojo/mouse",
		'dojo/on','dojo/_base/lang',"dojo/_base/array", "dojo/dom-construct","dojo/dom-class"
		],function(declare, ModuleBase, Evented, mouse, on, lang, array, domCon, domClass){

		return declare('ah/util/layout/list/SiderList', [ModuleBase], {

			items : [
				{category : 'Device Details', tmpl : '_makeDetailTmpl'},
				{category : 'Management Server', lists : [{name : 'NTP Server', href : '#/devices/configure-netdump', current : true}, {name : 'DNS Server', type : 'dnsServer'}]},
				{category : 'Policy Settings', lists : [{name : 'HIVE'}]}
			],

			bExpand : true,

			templateString : '<div>'+
								'<span class="ah-navsprite-icons ah-navsprite-menu active" data-dojo-attach-point="siderDot"></span>'+
								'<ul class="ui-nav-sider" data-dojo-attach-point="ulEl"></ul>'+
							'</div>',

			events : [
				['domNode', '.ui-nav-sider-title:click', '_toggleArea'],
				['domNode', '.ui-nav-sider-item:click', '_handleItemClick']
			],

			bDot : true,

			_setBDotAttr : function(b){
				this.siderDot.style.display = b ? '' : 'none';
			},

			_setCurrentAttr : function(type){
				var dd, curEl;

				if(!(dd = this._nodeCache[type])) return;

				curEl = this.$query('.cur')[0];

				domClass.remove(curEl, 'cur');
				domClass.add(dd.el, 'cur');

				this.onItemClick(type);

				this._set('current', type);
			},

			postMixInProperties : function(){
				this.inherited(arguments);

				this._nodeCache = {};
				this.__cache = {};
			},

			postCreate : function(){
				this.inherited(arguments);

				if(this.items && this.items.length){
					this._rendList(this.items);
				}

				if(this.hideArea){
					this.hide(this.hideArea);
				}

			},

			startup : function(){
				this.inherited(arguments);

				if(this.current){
					this.onItemClick(this.current);
				}

			},

			_rendList : function(items){
				var fragment = document.createDocumentFragment();

				array.forEach(items, function(item, i){
					var li = document.createElement('li');
					li.className = 'ui-nav-sider-item-ctn';

					// this may can be array for further thought
					this._nodeCache[i] = []; 
					this.__cache[i] = [];

					this._nodeCache[i].el = li;
					this.__cache[i].el = li;

					var h3 = document.createElement('h3');
					h3.className = 'ui-nav-sider-title';
					h3.innerHTML = item.category;

					var em = document.createElement('em');
					em.className = 'ui-nav-sider-arrow';

					h3.appendChild(em);

					li.appendChild(h3);

					if(item.lists && item.lists.length){
						var ul = document.createElement('ul');

						array.forEach(item.lists, function(dd){
							var d = document.createElement('li'), type, j;
							d.setAttribute('data-type', (type = dd.type || this._normalize(dd.name)));
							d.className = 'ui-nav-sider-item' + (dd.current ? ((this.current = type),' cur') : '');
							if(dd.href) {
								domClass.add(d, 'ui-nav-sider-item-link');
							}

							d.innerHTML = dd.href ? '<a href="'+dd.href+'">'+dd.name+'</a>' : dd.name;

							this._nodeCache[type] = {el : d, pa : i};
							this._nodeCache[i].push(type);
							this.__cache[i].push(type);

							ul.appendChild(d);

						}, this);

						if(!array.some(item.lists, function(dd){ return dd.current;}) && !this.bExpand){
							ul.style.display = 'none';
							domClass.add(em, 'ui-nav-sider-arrow-right');
						}else{
							domClass.add(em, 'ui-nav-sider-arrow-down');
						}

						/*
						 * Need or not need ?
						if(item.hidden){
							ul.style.display = 'none';
						}
						*/

						li.appendChild(ul);
					}

					if(item.tmpl && this[item.tmpl]){
						li.appendChild(domCon.toDom(this[item.tmpl]()));
						this._nodeCache[i].tmpl = true;
					}

					fragment.appendChild(li);

				}, this);

				this.ulEl.appendChild(fragment);
			},

			_toggleArea : function(e){
				var target = e.target.className == 'ui-nav-sider-title' ? e.target : e.target.parentNode,
					iconEl = this.$query('.ui-nav-sider-arrow', target), ctn = this.$query(target, true).next()[0],
					r = 'ui-nav-sider-arrow-right',
					d = 'ui-nav-sider-arrow-down';

				if (!ctn) return;

				var config = [
					{ wipe: 'wipeOut', add: r, remove: d },
					{ wipe: 'wipeIn',  add: d,  remove: r }
				], which = config[+(ctn.style.display === 'none')];

				dojo.fx[which.wipe]({
					node: ctn,
					onBegin: function () {
						iconEl.removeClass(which.remove).addClass(which.add);
					},
					onEnd: function () {
						iconEl.addClass(which.add);
					}
				}).play();
			},

			_handleItemClick : function(e){
				var tar = e.target,
					curEl = this.$query('.cur')[0],
					txt = tar.getAttribute('data-type') || this.$text(tar);
				if(tar.nodeName == "A") {
					tar = tar.parentNode;
				}

				if(tar === curEl) return;

				domClass.remove(curEl, 'cur');
				domClass.add(tar, 'cur');

				//this.onItemClick(this._normalize(txt));
				this.onItemClick(txt);
			},

			_normalize : function(txt){
				var arr = txt.split(/\s+/),
					dd;

				if(arr.length === 1) {
					dd = arr[0];
					return /[A-Z]/.test(dd.charAt(0)) ? dd.toLowerCase() : dd;
				}

				arr = array.map(arr, function(item, i){
					return i === 0 ? item.toLowerCase() :
								item.charAt(0).toUpperCase() + item.substring(1);
				});

				return arr.join('');
			},

			show : function(d){
				this._toggleLiArea(d, true);

				this._toggleTitleArea();
			},

			hide : function(d){
				var ret = this._toggleLiArea(d), i, dd, f;

				// TODO need think about
				// For example :  ntpServer is current, but if we hide ntpServer.
				// we need set a new current item and emit onItemclick.
				this._toggleTitleArea();

				f = array.some(ret, function(item){
					return this._isNumber(item) && 
							Array.isArray(this._nodeCache[item]) && this._nodeCache[item].indexOf(this.current);
				}, this);

				if(ret.indexOf(this.current) !== -1 || f){
					for(i in this._nodeCache){
						dd = this._nodeCache[i];
						if(!Array.isArray(dd) || !dd.length) continue;

						this.set('current', dd[0]);
						break;
					}
				}

			},

			_toggleLiArea : function(d, f){
				var d = lang.isArray(d) ? d : [d];

				array.forEach(d, function(key){
					var dd = this._nodeCache[key],
						pa = dd.pa, 
						arr, j;

					if(!dd) return;

					dd.el.style.display = f ? '' : 'none';

					if(!this._isNumber(key)){

						arr = this._nodeCache[pa];
						
						if(f){
							arr.indexOf(key) === -1 && arr.push(key);
						}else{
							arr.splice(arr.indexOf(key),1);
						}
					}else{
						arr = [];
						arr.el = dd.el;
						this._nodeCache[key] = f ? this.__cache[key] : arr;
					}

				}, this);

				return d;
			},

			_toggleTitleArea : function(){
				for(var i in this._nodeCache){
					dd = this._nodeCache[i];
					if(!Array.isArray(dd)) continue;
					if(dd.tmpl) continue;

					dd.el.style.display = dd.length ? '' : 'none';
				}			
			},

			_isNumber : function(key){
				return 'number' === typeof key || !isNaN(parseInt(key));
			},

			onItemClick : function(){}

		});
});
