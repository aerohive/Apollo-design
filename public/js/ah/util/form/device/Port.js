define(['dojo/_base/declare',
		'dojo/on',
		'dojo/_base/lang',
		'ah/util/form/device/PortBase',
		"dojo/mouse",
		"dojo/dom-geometry",
		'dojo/dom-class'],
	function( declare, on, lang, PortBase, mouse, domGeom, domClass){

		return declare('ah/util/form/device/Port',[ PortBase],{

			ptid : '1',

			position : 'up',

			type : 'access-port',

			pType: 'eth',

			theme : 'white',

			left : 0,

			selected : false,

			enabled : true,

			agg : false,

			lastModify : +new Date(),

			templateString : '<li class="port-ctn ${position}" style="left : ${left}px;right: ${right}px;">'+
								'<span class="port-desc">${desc} ${index}</span>'+
								'<div class="AH-ports-icons port-ethnet" data-index="${index}" data-dojo-attach-point="portEl">'+
									'<span class="port-type-${type}" data-dojo-attach-point="iconEl" data-ptid="${ptid}"></span>'+
								'</div>'+
							'</li>',


			_setTypeAttr : function(type){
				this.iconEl.className = 'port-type-' + type.jsonType;
				this._set('type',type);

				// TODO do we need change ptid
				// or type is {Object}
			},

			_setThemeAttr : function(theme){
				var f = theme == 'white',
					cla = f ? 'ethernet-port-' + this.position : 'sfp-port-gray';

				domClass.add(this.portEl, cla);
			},

			inRect : function(rect){
				var f = false,
					info = domGeom.position(this.domNode),
					p = {
						left : info.x,
						top : info.y,
						right : info.x + info.w,
						bottom : info.y + info.h
					};

				if(!(p.left > rect.x2 || p.top > rect.y2 || p.right < rect.x1 || p.bottom < rect.y1)){
					f = true;
				}

				return f;

			}

		});

});
