define([
		'dojo/_base/declare',"dojox/widget/ColorPicker",
		"dojo/fx",'dojo/on','dojo/_base/lang',"dojo/store/Memory","dijit/_base/focus"
		],function(declare, ColorPicker, fx, on, lang, Memory,FocusManager){

		return declare('ah/util/dojocover/AHColorPicker',[ColorPicker],{
			
			_setPoint: function(/* Event */evt){
				// summary:
				//		set our picker point based on relative x/y coordinates

				//	evt.preventDefault();
				var satSelCenterH = this.PICKER_SAT_SELECTOR_H/2;
				var satSelCenterW = this.PICKER_SAT_SELECTOR_W/2;
				var newTop = evt.offsetY - satSelCenterH;
				var newLeft = evt.offsetX - satSelCenterW;
				
				if(evt){ FocusManager.focus(evt.target); }

				if(this.animatePoint){
					fx.slideTo({
						node: this.cursorNode,
						duration: this.slideDuration,
						top: newTop,
						left: newLeft,
						onEnd: lang.hitch(this, function(){ this._updateColor(true); FocusManager.focus(this.cursorNode); })
					}).play();
				}else{
					html.style(this.cursorNode, {
						left: newLeft + "px",
						top: newTop + "px"
					});
					this._updateColor(false);
				}
			},
			_setHuePoint: function(/* Event */evt){
				// summary:
				//		set the hue picker handle on relative y coordinates
				var selCenter = this.PICKER_HUE_SELECTOR_H/2;
				var ypos = evt.offsetY - selCenter;
				if(this.animatePoint){
					fx.slideTo({
						node: this.hueCursorNode,
						duration:this.slideDuration,
						top: ypos,
						left: 0,
						onEnd: lang.hitch(this, function(){ this._updateColor(true); FocusManager.focus(this.hueCursorNode); })
					}).play();
				}else{
					html.style(this.hueCursorNode, "top", ypos + "px");
					this._updateColor(false);
				}
			}
		});
		
});
