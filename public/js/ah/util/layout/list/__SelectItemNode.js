define([ "dojo/_base/declare", 
		"dojo/on","dojo/mouse",
		"dojo/_base/lang",  
		"dojo/_base/array",
		"dojo/dom-class",
        "dijit/_TemplatedMixin",
		"dijit/_WidgetBase"],function(declare, on, mouse, lang, array, domClass, _TemplateMixin, _WidgetBase){
			
		return declare('ah/util/layout/list/__SelectItemNode', [_WidgetBase, _TemplateMixin], {
		
			templateString : '<li><label class="checkbox">'+
								'<input type="checkbox" data-dojo-attach-point="checkEl" />'+
								'<span class="lbl">${itemName}</span>'+
							'</label></li>',

			selected : false,

			_setSelectedAttr : function(f){
				this.checkEl.checked = f;

				//this._set('selected', f);
			},

			_getSelectedAttr : function(){
				return this.checkEl.checked;
			},

			postCreate : function(){
				this._bindUI();
			},

			_bindUI : function(){
				this.own(
					on(this.domNode, mouse.enter, lang.hitch(this, this._handleEnter)),
					on(this.domNode, mouse.leave, lang.hitch(this, this._handleLeave))	
				);
			},

			_handleEnter : function(){
				domClass.add(this.domNode, 'select-item-hover');
			},

			_handleLeave : function(){
				domClass.remove(this.domNode, 'select-item-hover');
			}

		});

	});
