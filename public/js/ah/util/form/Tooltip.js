define(['dojo/_base/declare',
		'dijit/_WidgetBase',
		'dijit/_TemplatedMixin',
		'ah/util/common/Base',
		'dojo/on',
        'dojo/Deferred',
        'dojo/when',
        'dojo/mouse',
		'dojo/_base/lang',
		'dojo/dom-geometry',
		'dojo/dom-style',
		'dojo/dom-attr'],function(declare, _WidgetBase, _TemplatedMixin, Base, on, Deferred, when, mouse, lang, domGeom, domStyle, domAttr){

		var Tooltip = declare('ah/util/form/Tooltip',[_WidgetBase,_TemplatedMixin, Base],{

			title: '',
			content: '',
			arrowPos: 'up',
			theme: 'dark',

            delayHide: false,
            loadingTmpl: '<div style="width: 200px;height:100px;background-color: #676767;" class="preload">',
			templateString:
				'<div class="ui-tooltip ui-tooltip-${theme}">'+
					'<div class="ui-tooltip-title" data-dojo-attach-point="titleEl"></div>'+
					'<div class="ui-tooltip-content" data-dojo-attach-point="contentEl"></div>'+
					'<div class="ui-tooltip-arrow" data-dojo-attach-point="tipArrow">'+
					'</div>'+
				'</div>',

			postCreate : function(){
				this.inherited(arguments);
				this._renderUI();
                this._attachEvent();
			},

			startup: function(){
				this.inherited(arguments);
			},

			_renderUI: function(){
				this.titleEl.style.display = !!this.title ? '' : 'none';
			},

            _attachEvent: function(){
                this.own(
                    on(this.domNode, mouse.enter, lang.hitch(this, function(){
                        this.mouseIn = true;
                    })),
                    on(this.domNode, mouse.leave, lang.hitch(this, function(){
                        this.mouseIn = false;
                        this._hide();
                    }))
                );
            },

			compBox: function(obj){
				this.domNode.style.display = '';
				var curPos = domGeom.position(this.domNode), x, y, orien, arrowX, arrowY;
				switch (obj.arrowPos){
					case 'up':
						x = obj.x + (obj.w - curPos.w)/2;
						y = obj.y + obj.h + 10;
						arrowX = curPos.w/2 - 10;
						arrowY = -20;
						break;
					case 'down':
						x = obj.x + (obj.w - curPos.w)/2;
						y = obj.y - (curPos.h + 10);
						arrowX = curPos.w/2 - 10;
						arrowY = curPos.h - 10;
						break;
					case 'left':
						x = obj.x + obj.w + 10;
						y = obj.y + (obj.h - curPos.h)/2;
						arrowX = -15;
						arrowY = curPos.h/2 - 10;
						break;
					case 'right':
						x = obj.x - (curPos.w + 10);
						y = obj.y + (obj.h - curPos.h)/2;
						arrowX = curPos.w - 10;
						arrowY = curPos.h/2 - 10;
						break;
					default: break;
				}
				domStyle.set(this.domNode, {left: x + 'px', top: y + 'px', position:'absolute'});
				domStyle.set(this.tipArrow, {left: arrowX + 'px', top: arrowY + 'px'});
				domAttr.set(this.tipArrow, 'class', 'ui-tooltip-arrow ' + obj.arrowPos);

			},

			tipHide: function(e){
                if(this.delayHide){
                    var that = this;
                    this.timeout = setTimeout(function(){
                        if(!that.mouseIn){
                            that._hide();
                        }
                    }, 1000);
                }else{
                    this._hide();
                }
			},
            _hide: function(){
                this.promise && this.promise.cancel();
                this.$fadeOut(this.domNode);
            },

			tipShow: function(obj, deferShow){
                this.delayHide = obj.delayHide;
                this.timeout && clearTimeout(this.timeout);
                if(deferShow){
                    var promise = this.promise = deferShow(obj.el);
                    obj.content = this.loadingTmpl;
                    if(promise.then){
                        promise.then(lang.hitch(this, function(data){
                            this.contentEl.innerHTML = data;
                            this.compBox(obj);
                        }));
                    }
                }
                this._show(obj);

			},
            _show: function(obj){
                obj && (this.contentEl.innerHTML = obj.content);
                obj && (this.titleEl.innerHTML = obj.title);
                domStyle.set(this.domNode, 'visibility', 'hidden');
                this.$fadeIn(this.domNode, {'onEnd': lang.hitch(this, function(){
                    this.compBox(obj);
                    domStyle.set(this.domNode, 'visibility', 'visible');
                })});

                domStyle.set(this.titleEl, 'display', obj && obj.title ? '' : 'none');
            }
        });


		var inst = lang.mixin(Tooltip, {
            show: function(obj, deferShow){
                this.instance = this.instance || this.getInstance();
                this.instance.tipShow(obj, deferShow);
            },
            hide: function(e){
                this.instance && this.instance.tipHide(e);
            },
            refresh: function(data){
            	this.instance.contentEl.innerHTML = data;
            },
			getInstance: function(){
				if(! this.instance){
					this.instance = new this();
					domStyle.set(this.instance.domNode, 'left', '-99999px');
					document.body.appendChild(this.instance.domNode);
				}
				return this.instance;
			}
		});

		return inst;

});