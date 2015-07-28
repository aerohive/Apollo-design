define([
		'dojo/_base/declare', 'ah/util/common/ModuleBase', "dojo/mouse",
		'dojo/on','dojo/_base/lang',"dojo/_base/array", "dojo/dom-construct","dojo/dom-class","dojo/dom-geometry"
		],function(declare, ModuleBase, mouse, on, lang, array, domCon, domClass, domGeo){

		return declare('ah/util/layout/Tag',[ModuleBase],{

			templateString : '<li class="ui-tag-item">'+
								'<span class="ui-tag-icon" data-dojo-attach-point="iconEl" style="display:none"></span>${name}'+
								'<span class="ui-tag-ac ui-tag-close" data-dojo-attach-point="xEl"></span>'+
							'</li>',

			closeMode : 'exchange',  // abandon

			isClosed: false,

			_setIconAttr : function(icon){
				var map = {};

				if(!map[icon]) return;

				this.iconEl.style.display = '';
				domClass.add(this.iconEl, 'ui-tag-icon-'+map[icon]);
			},

			_setActiveAttr : function(f){
				domClass[f ? 'add' : 'remove'](this.domNode,'ui-tag-item-active');
				this._set('active', f);
			},

			_getValueAttr : function(){
				// @TODO
				return this.value;
			},

			events : [
				['domNode', mouse.enter, '_handleEnter'],
				['domNode', mouse.leave, '_handleLeave'],
				['xEl', 'click', '_handleClose']
			],

			postCreate : function(){
				this.inherited(arguments);
			},

			_handleEnter : function(e){
				this.set('active', true);

				// should not be name later
				this.onMouseEnter(this.value);
			},

			_handleLeave : function(e){
				this.set('active', false);

				// should not be name later
				this.onMouseLeave(this.value);
			},

			_handleClose : function(e){
				//this.hide();

				//this.onItemClose(this);

				this['_'+this.closeMode](e);
			},

			_exchange : function(e){
				var t = e.target,
					cla = t.className,
					isClose = domClass.contains(t,'ui-tag-close');

				domClass.toggle(t,'ui-tag-close');
				domClass.toggle(t,'ui-tag-revert');

				if(isClose){
					this.onItemClose(this);
					this.isClosed = true;
				}else{
					this.onItemRevert(this);
					this.isClosed = false;
				}

			},

			_abandon : function(e){
				this.onItemClose(this);
				this.destroy();
			},


			/*
			hide : function(){
				this.domNode.style.display = 'none';
			},

			show : function(){
				this.domNode.style.display = '';
			},
			*/


			onMouseEnter : function(){},
			onMouseLeave : function(){},
			onItemClose : function(){},
			onItemRevert : function(){}

		});

	});
