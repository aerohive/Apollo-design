define(['dojo/_base/declare',
		'dijit/_WidgetBase',
		'dijit/_TemplatedMixin',
		'ah/util/common/Base',
		'dojo/on',
		'dojo/text!ah/util/form/device/templates/PortTip.html',
		'dojo/_base/lang',
		'dojo/dom-class',
		'dojo/dom-style',
		'dojo/dom-geometry'],
	function( declare, _WidgetBase, _TemplateMixin, Base, on, template, lang, domClass, domStyle, domGeom){

		return declare('ah/util/form/device/PortTip',[ _WidgetBase, _TemplateMixin, Base ],{

			templateString : template,

			postCreate : function(){
				document.body.appendChild(this.domNode);

				this.info = domGeom.position(this.domNode);

				this.domNode.style.display = 'none';
			},

			show : function(obj){

				this.changeSta(obj);
				this.$fadeIn(this.domNode);
			},

			hide : function(){
				this.$fadeOut(this.domNode);
			},

			changeSta : function(obj){
				var i,j,dd, xy = obj.xy;

				for( i in obj ){
					j = this.firstCharToUpper(i);
					if(obj.hasOwnProperty(i) && (dd = this['port'+j])){
						this.$text( dd, obj[i] );
					}
				}

				// set x and y croods
				domStyle.set(this.domNode,{
					'top' : xy[1] - this.info.h - 15 + 'px',
					left : xy[0] - 10 + 'px'
				});

				this.aggCtn.style.display = obj.agg ? '' : 'none';

			},

			firstCharToUpper : function(str){
				return str.charAt(0).toUpperCase() + str.slice(1);
			}

		});

});
