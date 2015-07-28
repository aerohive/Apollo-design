define(['dojo/_base/declare','dijit/_WidgetBase','dijit/_TemplatedMixin','dojo/on','dojo/_base/lang',"dojo/dom-class","dojo/Evented"],
	function(declare,_WidgetBase,_TemplateMixin,on,lang,domClass, Evented){
		var cla = {
			'inac' : 'ui-tab-inactive',
			'ac' : 'ui-tab-active'
		};

		return declare('ah/util/Tab',[_WidgetBase, Evented],{

			tabTitles : null,

			cur : 0,

			theme : '',

			_themeMap : {
				'gray' : 'ui-gray-tab'
			},

			position : 'horizontal',
			
			postCreate : function(){
				this.rendUI();
				this.bindUI();
			},

			startup : function(){
				this.inherited(arguments);

				var i = this.cur;
				
				this.emit('tabClick', this.tabArr[i], this.tabConArr[i], i);
			},

			rendUI : function(){
				var title = this.tabTitles.split(','),
					tab = tabPanel = '',that = this,
			   		hasNode = this.domNode.children.length,
					fragment = document.createDocumentFragment();

				this.tabArr = [];
				this.tabConArr = [];
				this.sum = title.length;
				
				this.domNode.removeAttribute('data-dojo-type');
				this.domNode.removeAttribute('data-dojo-props');

				if(this.position == 'vertical'){
					domClass.add(this.domNode,'tab-vertical');
				}

				this.tabEl = dojo.create('div',{'class' : 'line clearfix'});

				if(this.theme && this._themeMap[this.theme]){
					domClass.add(this.tabEl, this._themeMap[this.theme]);
				}

				dojo.forEach(title,function(item,i){
					var f = i == that.cur;

					that.tabArr[i] = dojo.create('div',{'class' : 'ui-tab ui-tab-'+(f ? '':'in')+'active clearfix'});
					that.tabArr[i].innerHTML = '<div class="arrow-left"></div><div class="lower-tab"><a href="javascript:void(0)">'+item+'</a></div>'
					f && that.position != 'vertical' && (domClass.add(that.tabArr[i], 'ui-tab-first'));
					that.tabEl.appendChild(that.tabArr[i]);

					if(!hasNode){
						that.tabConArr[i] = dojo.create('div',{'class': 'ui-tab-panel','style':f ? '' : 'display:none'});
						fragment.appendChild(that.tabConArr[i]);
					}

				});

				if(hasNode){
					this.tabConEl = this.domNode.children[0];
					this.tabConArr = [].slice.call(this.tabConEl.children,0);
					dojo.forEach(dojo.filter(this.tabConArr,function(cur,i){return that.cur != i}),function(con){con.style.display = 'none';});
				}else{
					this.tabConEl = dojo.create('div',{'class':'ui-tab-panel-wrap clearfix'});
					this.tabConEl.appendChild(fragment);
					this.domNode.appendChild(this.tabConEl);
				}

				this.domNode.insertBefore(this.tabEl,this.tabConEl);

			},

			bindUI : function(){
				var that = this;
				dojo.forEach(this.tabArr,function(tab,i){
					that.own(
						on(tab,'click',lang.hitch(that,that._handleToggle,i))
					);
				});
			},

			_handleToggle : function(i,e){
				var t = e.currentTarget,
					f = dojo.hasClass(t,cla.ac);

				if(f) return;

				dojo.forEach(this.tabArr,function(tab){
					domClass.remove(tab,cla.ac);
					domClass.add(tab,cla.inac);
				});
				domClass.remove(t,cla.inac);
				domClass.add(t,cla.ac);

				dojo.forEach(this.tabConArr,function(con){con.style.display = 'none'});
				this.tabConArr[i].style.display = '';


				this.emit('tabClick', t, this.tabConArr[i], i);

				this.set('cur',i);
			},

			hide : function(num){
				if(num >= this.sum) return;

				this._display(num,'none');
				
				if(num == this.get('cur')){

					for(var i = 0,tab, len = this.tabArr.length; i < len; i++){
						tab = this.tabArr[i];
						if(tab.style.display != 'none'){
							this._emit(tab);
							break;
						}
					}

				}
			},

			show : function(num){
				if(num >= this.sum) return;

				var tab = this.tabArr[num];

				tab.style.display = '';
				this._emit(tab);
			},

			_emit : function(el){
				on.emit(el,'click',{bubbles:true,cancelable : true});
			},

			_display : function(num,dis){
				this.tabArr[num].style.display = this.tabConArr[num].style.display = dis ? dis : '';
			},

			addEvent : function(fn,f){
				var that = this,
					i = this.cur;

				// for the first tab init
				if(f){
					fn(this.tabArr[i],this.tabConArr[i],i);
				}
				
				// now attach the expand event
				dojo.forEach(this.tabArr,function(tab,i){
					that.own(
						on(tab,'click',lang.hitch(that,function(e){
							fn(tab,that.tabConArr[i],i);
						}))
					);
				});
			}

		});
});
