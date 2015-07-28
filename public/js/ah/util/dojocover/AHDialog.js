define(['dojo/_base/declare',
		'dojo/on', 
		"dijit/Dialog",
		"dojo/_base/lang",
		"dojo/dom-construct",
		"dojo/aspect",
		"ah/util/dojocover/__AHDialogCache",
		'ah/util/message/StatusMsg',
		'ah/util/common/Base'],function(declare, on, Dialog, lang, domCon, aspect, dialogCache, StatusMsg, Base){

		return declare('ah/util/dojocover/AHDialog',[Dialog, Base],{

			autofocus : false,

			refocus : false,

			bDefHide : false,

			_setContentHeightAttr : function(height){
				var contentEl = this.$query('.ui-dialog-content')[0],
					bottomEl = this.$query('.ui-dialog-bottom')[0],
					height = parseInt(height);
				
				if(isNaN(height)) return;
		
				if(contentEl){
					contentEl.style.height = (!bottomEl ? height + 50 : height) + 'px';
				}
			},

			buildRendering : function(){
				this.inherited(arguments);

				this._createLoading();

			},

			focus: function(){
				if(this.autofocus){
					this._getFocusItems(this.domNode);
					focus.focus(this._firstFocusItem);
				}
			},

			postCreate : function(){
				this.inherited(arguments);

				this._registerIndex = dialogCache.push(this) - 1;

				aspect.before(this, 'show', lang.hitch(this, this._toggleOverflow, 'hidden'));
				aspect.after(this, 'hide', lang.hitch(this, this._toggleOverflow, 'visible'));
				aspect.after(this, 'destroy', lang.hitch(this, this._toggleOverflow, 'visible'));

				// handle with customer title bar
				//TODO After clean all dialog style, we need remove note
				/*
				if(!lang.trim(this.title)){
					this._customTitle();
				}
				*/
			},

			show : function(){
				this.inherited(arguments);

				var reg = /height:([^;]+);?/,
					style = this.get('style'),
					arr = style.match(reg);

				if(arr){
					this.set('contentHeight', parseInt(arr[1]) - 150 + 'px');
				}
			},

			hide : function(){
				if(this.bDefHide){
					this.inherited(arguments);
				}else{
					this.destroy();
				}
			},

			_customTitle : function(){
				domCon.place(this.closeButtonNode, this.domNode, 'first');
				domCon.destroy(this.titleBar);
			},

			msgSucc : function(txt){
				this.showMsg('success',txt);
			},

			msgErr : function(txt){
				this.showMsg('error',txt);
			},

			msgWarn : function(txt){
				this.showMsg('warning',txt);
			},

			showMsg : function(type,txt){
				StatusMsg.show(type, txt, this.containerNode, 'first');
			},

			_toggleOverflow : function(type){
				document.body.style.overflow = type;
			},

			toggleLoading : function(f){
				var flag = 'undefined' == typeof f ? this.loadEl.style.display == 'none' : f;

				this.loadEl.style.display = flag ? '' : 'none';
			},

			destroy : function(){
				this.inherited(arguments);

				dialogCache.splice(this._registerIndex, 1);
			},

			_createLoading : function(){
				var div = document.createElement('div');			
				div.className = 'grid-mark';
				div.style.display = 'none';

				this.loadEl = div;

				this.domNode.style.position = 'relative';
				this.domNode.style.minHeight = '150px';
				this.domNode.appendChild(div);
			}
		
		});

});
