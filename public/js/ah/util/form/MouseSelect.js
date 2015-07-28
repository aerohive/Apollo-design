define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-class",
        "dojo/dom-attr",
        "dojo/dom-geometry",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/on"],function(declare, lang, array, domClass, domAttr, domGeom, domCon, domStyle, on){

		return declare('ah/util/form/MouseSelect',[],{

			emitCfg : {
				bubbles: true,
    			cancelable: true
			},

			postscript : function(el,opts){
				this.el = el;

				for(var i in opts){
					this[i] = opts[i];
				}

				this._bindUI();
			},

			_bindUI : function(){
				this._own(
					on(this.el,'mousedown',lang.hitch(this,this._mouseStart)),
					on(this.el,'start',lang.hitch(this,this.mouseStart)),
					on(this.el,'drag',lang.hitch(this,this.mouseDrag)),
					on(this.el,'stop',lang.hitch(this,this.mouseStop))
				)
			},

			_mouseStart : function(e){
				//e.preventDefault();

				this.dragable = true;

				this.isClick = true;

				this.ops = [e.clientX,e.clientY];

				// create helper and set style to it
				domStyle.set(this.helper = this._createHelper(),{
					width : 0,
					height : 0/*,
					left : e.clientX + 'px',
					top : e.clientY + 'px'*/
				});

				// attach events
				this._moveEv = on(document,'mousemove',lang.hitch(this,this._mouseDrag));
				this._upEv = on(document,'mouseup',lang.hitch(this,this._mouseStop));

				// fire start event
				on.emit(this.el,'start', this.emitCfg);
			},

			_mouseDrag : function(e){
				e.preventDefault();

				if(!this.dragable) return;

				this.isClick = false;
				//console.log('move');
				var x1 = this.ops[0],
					y1 = this.ops[1],
					x2 = e.clientX,
					y2 = e.clientY,tmp;

				if(x1 > x2){tmp = x2; x2 = x1; x1 = tmp;}
				if(y1 > y2){tmp = y2; y2 = y1; y1 = tmp;}
				domStyle.set(this.helper,{
					width : x2 - x1 + 'px',
					height : y2 - y1 + 'px',
					left : x1 + 'px',
					top : y1 + 'px'
				});

				// for interface data use
				this._rect = {x1 : x1, y1 : y1, x2 : x2, y2 : y2};

				// fire drag events
				on.emit(this.el,'drag', this.emitCfg);

			},

			_mouseStop : function(e){
				e.preventDefault();

				this._destroyHelper();
				this.dragable = false;

				// unattach events
				this._moveEv.remove();
				this._upEv.remove();

				// fire stop listener
				!this.isClick && on.emit(this.el,'stop',{rect : this._rect});
			},

			_createHelper : function(){
				var help = domCon.create('div',{className : 'ui-selectable-helper'});

				document.body.appendChild(help);

				return help;
			},

			_own : function(){
				array.forEach(arguments,lang.hitch(this,function(handler){
					(this._events || (this._events = [])).push(handler);
				}));
			},

			_destroyHelper : function(){
				domCon.destroy(this.helper);
			},

			destroy : function(){
				//this._downEv.remove();
				array.forEach(this._events,function(handler){ handler.remove(); });
				this._destroyHelper();
			},

			mouseStart : function(){},

			mouseDrag : function(){},

			mouseStop : function(){}

		});

});

