define(['dojo/_base/declare', 'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dojo/on', 'dojo/_base/lang', 'dojo/fx', 'dojo/window'],
    function (declare, _WidgetBase, _TemplateMixin, on, lang, fx, win) {

        var Msg = declare([_WidgetBase, _TemplateMixin], {

                templateString: '<div>' +
                    '<div class="ui-tipbox ${msgClass}" data-dojo-attach-point="wrapEl">' +
                    '<i class="ui-tipbox-icon"></i>' +
                    '<i class="ui-tipbox-close" data-dojo-attach-point="xEl"></i>' +
                    '<div class="ui-tipbox-con"><h3 class="ui-tipbox-title" data-dojo-attach-point="textEl">${msgText}</h3></div>' +
                    '</div></div>',

                msgClass: 'ui-tipbox-success',

                animation: 'wipe',

				style : {'width' : '100%', 'min-width' : '450px'},

                _setMsgClassAttr: function (v) {
                    var name = 'ui-tipbox ui-tipbox-' + v;

                    if (v) {
                        this.wrapEl.className = name;
                        this._set('msgClass', name);
                    }
                },

                msgText: 'Task accomplished with success!',

                _setMsgTextAttr: function (txt) {
                    if (txt) {
                        this.textEl.innerHTML = txt;
                        this._set('msgText', txt);
                    }
                },

                postCreate: function () {
                    this.bindUI();
                },

                bindUI: function () {
                    this.own(
                        on(this.xEl, 'click', lang.hitch(this, this._closeMsg)),
						on(window, 'resize', lang.hitch(this, this._handleResize))
                    );
                },

                _closeMsg: function () {
                    this._timer && this._timer.remove();

                    if (this.animation && !this.isHidden()) {
                        fx[this.animation + 'Out']({node: this.domNode}).play();
                    } else {
                        this.domNode.style.display = 'none';
                    }
                },

				_handleResize : function(){
					this.resizeTime && clearTimeout(this.resizeTime);
					this.resizeTime = setTimeout(lang.hitch(this, function(){
						var w = win.getBox().w, m = 1220;

						this.set('style', {width : w > m ? '100%' : w + 'px'});
					}), 100);
				},

				isHidden : function(){
					return this.domNode.style.display == 'none';
				},
                /**
                 * For Hiding if its already open
                 */
                hide: function () {
                    this._closeMsg();
                },

                show: function (className, text, holder, position) {
                    this._timer && this._timer.remove();
                    if (className == 'success') {
                        this._timer = this.defer(this._closeMsg, 4e3);
                    }

                    this.set('msgClass', className);
                    this.set('msgText', text);

                    this.domNode.style.display = 'none';

                    if (holder) {
                        try {
                            dojo.place(this.domNode, holder, position);
                        } catch (e) {

                        }
                    }

                    if (this.animation) {
                        fx[this.animation + 'In']({
                            node: this.domNode
                        }).play();
                    } else {
                        this.domNode.style.display = '';
                    }
                }

            }),
            msgInstance = null;


        return {
            _placeMap: {
                'J-msg-holder': 'first',
                'main': 'first'
            },

            _placeArr: ['J-msg-holder', 'main'],

            setOptions: function () {
                // for Msg property
            },
            hide: function () {
            	msgInstance && msgInstance.domNode && msgInstance.hide();
            },
            show: function (status, text, holder, position) {
                var i, dd, p, exit, len = this._placeArr.length;

                if (!holder) {
                    for (i = 0; i < len; i++) {
                        dd = this._placeArr[i];
                        if ((p = document.getElementById(dd)) && p.offsetWidth) {
                            holder = dd;
                            position = this._placeMap[dd];
                            break;
                        }
                    }
                }
				
				
                if (!msgInstance || (exit = !document.getElementById(msgInstance.id))) {

                    if (exit) {
                        msgInstance.destroy();
                        msgInstance = null;
                    }

                    msgInstance = new Msg().placeAt(holder, position);
                }

                msgInstance.show(status, text, holder, position);
            }
        };
    })
;
