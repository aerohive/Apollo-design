define([
		'dojo/_base/declare',
		"dojo/on",
		"dojo/_base/lang",
		'dojo/mouse',
		"dojo/aspect",
		"dojo/dom-geometry",
		'ah/config/keycodeStore',
		'ah/util/form/Tooltip'
		],function(declare, on, lang, mouse, aspect, domGeom , keyStore, Tooltip){

		var uniqueId = function (){
			var n = 0;

			return function(){
				return n++;
			}
		}();

		var _eval = function(str){
			return eval('(' + str + ')');
		};

		return declare('ah/util/common/_AhMixin',null, {

			_ahMap : {
				'ah-sin-wipe' : '_sinWipeFn',
				'ah-radios-wipe' : '_radiosFn',
			   	'ah-num' : '_allowNumFn',
			   	'ah-permit' : '_permitFn',
			   	'ah-pop-tip': '_popTipFn'
			},

			postMixInProperties : function(){
				this.inherited(arguments);
				this._ahCache = {};
			},

			_processTemplateNode : function(baseNode, getAttrFunc, attachFunc){
				var f, dd, i;

				f = this.inherited(arguments);

				for( i in this._ahMap ){
					if( dd = getAttrFunc(baseNode, i) ){
						this[this._ahMap[i]](baseNode, dd);
					}
				}


				return f;
			},

			/**
			 *@ah fns
			 */

			// sinWipe
			_sinWipeFn : function(baseNode, con){
				this.own(
					on(baseNode, 'click', lang.hitch(this, this._handleSinWipe, con))
				);
			},

			_handleSinWipe : function(con, e){
				var isInput = e.target.nodeName.toLowerCase() == 'input',
					f = isInput ? e.target.checked : undefined;

				//if(this.sinWipe){ this.sinWipe.status() == 'playing' && this.sinWipe.stop(true);}
				this._fxObj && this._fxObj.stop(true);
				this._fxObj = this.$toggleWipe(this[con].domNode || this[con], f);
			},


			// radiosWipe
			_radiosFn : function(baseNode, dd){
				var isQuery = /Qys$/.test(dd),
					isPoints = /,/.test(dd),
					points = dd.split(','),
					n = uniqueId(),dt;

				if(isQuery){
					els = dd;
				}else if(isPoints){
					// leave points first
				}else if((dt = this.$query('.'+dd,baseNode)).length){
					els = dt;
				}else{return;}


				// main event
				aspect.after(this, 'postCreate', lang.hitch(this, this._handleRadiosWipe, els, n));
			},

			_handleRadiosWipe : function(els, n){
				var els = typeof els == 'string' ? this[els] : els,
					checkedEl = els.filter(function(item){return item.checked})[0],
					con = checkedEl.getAttribute('ah-radios-con'),
					conStr = '_radioWiEl'+n, elStr = '_radioWiCheckedEl'+n;

				// init checked status
				this[con] && (this._ahCache[conStr] = this[con]);
				this._ahCache[elStr] = checkedEl;

				if(els.on){
					this.own(
					 els.on('click', lang.hitch(this, function(e){
						var t = e.target,
							con = t.getAttribute('ah-radios-con');

						if(t == this._ahCache[elStr]) return;

						this._ahCache[conStr] && this.$wipeOut(this._ahCache[conStr]);
						this[con] && this.$wipeIn(this[con]);

						this._ahCache[conStr] = this[con];
						this._ahCache[elStr] = t;
					 }))
					);
				}

			},

			_allowNumFn : function(baseNode){
				this.own(
					on(baseNode, 'keypress', function(e){
						var code = e.keyCode || e.which;

						if(!((code >= 48 && code <= 57) || code == 8 || e.which && code == 0 || !e.which && code == 46)){
							e.preventDefault();
							e.stopImmediatePropagation();
							return;
						}

					})
				);
			},

			_permitFn : function(node, type){
				this.own(
					on(node, 'keypress', function(e){

						if(keyStore(type, e.keyCode || e.which, e)){
							e.preventDefault();
							e.stopImmediatePropagation();
							return;
						}

					})
				);
			},

			_popTipFn : function(baseNode, con){
				con = _eval.call(this,"({" + con + "})");
				this.own(
					on(baseNode, mouse.enter, lang.hitch(this, function(e){
						this._handleTipShow(e, con);
					})),
					on(baseNode, mouse.leave, lang.hitch(this, this._handleTipHide))
				);
			},

			_handleTipShow: function(e, con){
				var ctn = con.content.innerHTML || con.content,
					arrowPos = con.arrowPos,
					pos = domGeom.position(e.currentTarget, true),
					cfg = lang.mixin({el: e.currentTarget, content: ctn, arrowPos: arrowPos, title: con.title, delayHide: con.delayHide || false}, pos);
				Tooltip.show(cfg, con.deferShow || false);
			},

			_handleTipHide: function(e){
				Tooltip.hide(e);
			},


			destroy : function(){
				this.inherited(arguments);

				// clean _ahCache
				for(var i in this._ahCache){
					this._ahCache[i] = null;
				}

				this._ahCache = {};
			}

		});

});
