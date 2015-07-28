define(['dojo/_base/declare',
		'dojo/on',
		'dojo/query',
		"dojo/dom-style",
		"dojo/dom-construct",
		"dojo/_base/lang",
		"dijit/form/HorizontalSlider"],function(declare, on, query, domStyle, domConstruct, lang, HorizontalSlider){
	
		return declare('ah/util/dojocover/AHSlider',[HorizontalSlider],{

			tooltip : true,

			tipunit : '',
			
			canDirectInput: true,

			tipConnector : '&nbsp;',
			
			postCreate : function(){
				this.inherited(arguments);
				this.manageEvent();
				this._initToolTip();
			},
			
			manageEvent : function() {
				this.own(
					on(this, "dblclick", lang.hitch(this, function(event) {
						this._tipDblclick(event);
					})),
					
					on(this, "blur", lang.hitch(this, function(event) {
						this._inputOverEvent(event);
					})),

					on(this, "keydown", function(event) {
					    if (13 == event.keyCode) {
					    	this._inputOverEvent(event);
					    }
					})
				);
			},
			
			_inputOverEvent: function(event) {
				if (this.canDirectInput && this._isShow(this.inputNode)) {
					var val = /^(-)?\d+$/.test(this.inputNode.value) ? parseInt(this.inputNode.value, 10) : parseInt(this.getValue(), 10);
					val = val > this.maximum ? this.maximum : (val < this.minimum ? this.minimum : val);
	                this._showTipNode();
	                this.tipNode.innerHTML = val + this.tipConnector + this.tipunit;
	                this.setValue(val);
					this._changeTipPosition();
				}
			},
			
			_onBarClick: function(event) {
				if (this.canDirectInput && this._isShow(this.inputNode)) {
					return false;
				}
				
				this.inherited(arguments);
			},
			
			_isShow: function(dom) {
				return dom && dom.style.display == "";
			},
			
			_tipDblclick: function(event) {
				if (this.canDirectInput) {
					if (!this.inputNode) {
						this.inputNode = domConstruct.create('input', {
							type: "text",
							className: 'direct-input'
						}, this.wrapperNode, "last");
					}
					
					this.inputNode.value = parseInt(this.value, 10);
					this.inputNode.focus();
					this._showInputNode();
					this._changeTipPosition();
				}
			},
			
			_showInputNode: function() {
				if (this.canDirectInput) {
					if (this.tipNode) {
						this.tipNode.style.display = "none";
					}
					
					if (this.inputNode) {
						this.inputNode.style.display = "";
					}
				}
			},
			
			_showTipNode: function() {
				if (this.canDirectInput) {
					if (this.inputNode) {
						this.inputNode.style.display = "none";
					}
					
					if (this.tipNode) {
						this.tipNode.style.display = "";
					}
				}
			},

			_initToolTip : function(){
				if (!this.tooltip) { return; }
				
				this.wrapperNode = domConstruct.create('div', {
					innerHTML: "<span>" + this.value + this.tipConnector + this.tipunit + "</span>", 
					className : 'tip-default toolTip-up'
				}, dojo.body(), "last");
				
				this.tipNode = query("span", this.wrapperNode)[0];

		    	this._changeTipPosition();
		    	domConstruct.place(this.wrapperNode, this.progressBar, "last");
			},

			onChange : function(newValue){
				if (!this.tooltip) return;
				this.tipNode.innerHTML = parseInt(newValue, 10) + this.tipConnector + this.tipunit;
				this._showTipNode();
                this._changeTipPosition();
			},

			_changeTipPosition : function() {
				var w = this.wrapperNode.offsetWidth;
				domStyle.set(this.wrapperNode, "right", -Math.floor(w / 2) + "px");
			}

		});
});
