define(['dojo/_base/declare',
        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'ah/util/common/Base',
        'dojo/on',
        "dojo/fx",
        'dojo/_base/lang',
        "dojo/dom-geometry",
        'dojo/dom-style',
        'dojo/dom-class',
        'dojo/dom-attr'],function(declare, _WidgetBase, _TemplatedMixin, Base, on, fx, lang, domGeom, domStyle, domClass, domAttr){

        return declare('ah/util/Carousel',[_WidgetBase, _TemplatedMixin, Base],{

            showNum: 1,
            _startCount: 0,
            templateString:
                '<div class="clearfix pt-r" style="visibility:hidden" data-dojo-attach-point="ctn">'+
                    '<div class="ui-carousel" data-dojo-attach-point="optIcon">'+
                        '<span class="ui-carousel-icon ui-carousel-left disabled" data-type="left"></span>'+
                        '<span class="ui-carousel-icon ui-carousel-right" data-type="right"></span>'+
                    '</div>'+
                    '<div class="ui-carousel-list-ctn" data-dojo-attach-point="listCtn">'+
                        '<ul class="ui-carousel-list" data-dojo-attach-point="elList"></ul>'+
                    '</div>'+
                '</div>',

            postCreate : function(){
                this.inherited(arguments);

                this._attachEvent();
            },
            _attachEvent: function(){
                this.own(
                    on(this.$query('.ui-carousel-icon', this.domNode), 'click', lang.hitch(this, function(e){
                        this._move(e);
                    }))
                );
            },

            buildRendering: function(){
                this.inherited(arguments);
                var refNode = this.content = dojo.toDom(this.srcNodeRef && this.srcNodeRef.innerHTML || this.content);
            },

            startup: function(){
                this.inherited(arguments);
                this._renderUI();
            },

            _renderUI: function(){
                this.elList.appendChild(this.content);
                this._list = this.$query('li', this.elList);
                var flag = this.showNum >= this._list.length;
                domStyle.set(this.listCtn, {'left': (flag ? 0 : '18px')});
                this.optIcon.style.display = flag ? 'none' : '';

                this._list.length > 0 && this._calculateDom();
                this.ctn.style.visibility = 'visible';
            },

            refresh: function(data){
                this.content = data;
                this.elList.innerHTML = '';
                this._renderUI();
            },
            _isStopAct: function(){
                return {right: (this._list.length - this._startCount <= this.showNum), left: (this._startCount == 0)};
            },
            _setDisableAttr: function(el, flag){
				var dt = el.getAttribute('data-type'),
					fn = (flag || this._isStopAct()[dt]) ? 'add' : 'remove';
				domClass[fn](el, 'disabled');
            },

            _move: function(e){
                var scrollList = this.$query('.ui-carousel-icon'),
					orig = e.target.getAttribute('data-type'),
                    stopObj = this._isStopAct();
                if(stopObj[orig] || domClass.contains(e.target, 'disabled')){
                    return;
                }
                this._startCount = orig == 'right' ? (this._startCount + 1) : (this._startCount - 1);
                scrollList.forEach(lang.hitch(this, function(el){
                    this._setDisableAttr(el,true);
                }));

                var pos = domGeom.getMarginBox(this.elList),
                    l = orig == 'right' ? (pos.l - this._sinWidth) : (pos.l + this._sinWidth);
                fx.slideTo({
                    node: this.elList,
                    top: domGeom.getMarginBox(this.elList).t.toString(),
                    left: l,
                    units:"px",
                    onEnd: lang.hitch(this, function(){
						scrollList.forEach(lang.hitch(this, function(el){
							this._setDisableAttr(el);
						}));
                    })
                }).play();
            },
            _calculateDom: function(){
                var el = this._list[0],
                    width = this._sinWidth = domGeom.getMarginBox(el).w,
                    totalWidth = width * this.showNum;
                this.listCtn.style.width = totalWidth + 'px';

            }

        });

});