define(['dojo/_base/declare','dijit/_WidgetBase',
		'dijit/_TemplatedMixin','dojo/on',
		'dojo/_base/lang', 'dojo/dom-class',
		"dojo/mouse", "dojo/dom-geometry"],
	function( declare, _WidgetBase, _TemplateMixin, on, lang, domClass, mouse, domGeom ){

		return declare('ah/util/form/device/PortBase',[ _WidgetBase, _TemplateMixin ],{

			index : '1',

			selected : false,

			enabled : true,

			lastModify : +new Date(),

			_setSelectedAttr : function(f){
				domClass[f ? 'add' : 'remove'](this.portEl,'active');
				this._set('selected',f);
			},

			_setDisabledAttr: function(f){
				domClass[f ? 'add' : 'remove'](this.portEl,'disabled');
				this._set('disabled',f);
			},


			postCreate : function(){

				this._bindUI();
			},

			startup : function(){
				this.inherited(arguments);

				//this.info();
			},

			_bindUI : function(){
				this.own(
					on(this.portEl,'click',lang.hitch(this, this.toggleSelected)),
					on(this.portEl, mouse.enter, lang.hitch(this, this.enterPort)),
					on(this.portEl, mouse.leave, lang.hitch(this, this.leavePort))
				);
			},

			toggleSelected : function(){
				if(this.disabled) return;
				this.set('selected', !this.get('selected'));
			},

			enterPort : function(e){
				if(!this.portTip) return;

				var p = domGeom.position(this.domNode);

				this.timer && clearTimeout(this.timer);

				this.timer = setTimeout(lang.hitch(this, function(){
					var params = {
						title : ( this.pType + '' + this.index + ' details').toUpperCase(),
						type : this.type.name,
						'status' : this.enabled ? 'enabled' : 'disabled',
						modify : new Date(this.lastModify),
						xy : [p.x, p.y]
					};
					if(this.agg) {
						params.agg = this.aggPorts;
					}
					this.portTip.show(params);
				}), 500);

			},

			leavePort : function(){
				if(!this.portTip) return;

				this.timer && clearTimeout(this.timer);

				this.portTip.hide();
			}


		});

});
