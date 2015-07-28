define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dojo/on",
    "dojo/dom",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-geometry"
], function (declare, _WidgetBase, on, dom, domClass, domStyle, domConstruct, domGeom) {
    return declare("ah/util/AHImageCropper", [_WidgetBase],
        {
    		minWidth: 20,
    		
    		minHeight: 20,

            imageSize: [0, 0],
    		
    		//gap between crop region border and container border
    		gap: 50,
    		
    		//the initial crop region size
    		cropSize: 0,
    		
    		//whether to keep crop region as a square
    		keepSquare: false,
        
            postCreate: function() {
                this.inherited(arguments);
                this.updateUI();
                this.connect(this.cropNode, 'onmousedown', '_onMouseDown');
                this.connect(document, 'onmouseup', '_onMouseUp');
                this.connect(document, 'onmousemove', '_onMouseMove');
                document.ondragstart = function() {
                    return false;
                }
                dom.setSelectable(this.domNode, false);
                domClass.add(this.domNode, 'image-cropper');
                if (this.image) this.imageNode = domConstruct.create('img', {
                    src: this.image
                }, this.domNode, 'first');
            },
            
            buildRendering: function() {
                this.inherited(arguments);
                this._archors = {};
                this._blockNodes = {};

                this.cropNode = domConstruct.create('div', {
                    className: 'crop-node'
                }, this.domNode, 'last');

                var arr = ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l'];
                for (var i = 0; i < 8; i++) {
                    var img = domConstruct.create('img', {
                        className: arr[i]
                    });
                    img.src = this._blankGif;
                    this.cropNode.appendChild(img);
                    this._archors[arr[i]] = img;
                }

                arr = ['l', 't', 'r', 'b'];
                for (var i = 0; i < 4; i++) {
                    this._blockNodes[arr[i]] = domConstruct.create('div', {
                        className: 'block block-' + arr[i]
                    }, this.domNode, 'last');
                }
            },
            
            setImage: function(url) {
                var img = new Image();
                img.src = url;
                this.image = url;
                if (!this.imageNode) {
                    this.imageNode = domConstruct.create('img', {
                        src: this.image
                    }, this.domNode, 'first');
                }
                this.imageNode.src = url;
                if (!this.imageNode.offsetWidth) {
                    var self = this;
                    this.imageNode.onload = function() {
                        self.setSize(self.imageNode.offsetWidth, self.imageNode.offsetHeight);
                    }
                } else {
                    this.setSize(this.imageNode.offsetWidth, this.imageNode.offsetHeight);
                }
            },
            
            setSize: function(w, h) {
                this.domNode.style.width = w + 'px';
                this.domNode.style.height = h + 'px';
                this.imageSize = [w, h];

                if (this.cropSize) {
                    var m = Math.min(w, h, this.cropSize);

                    domStyle.set(this.cropNode, {
                        width: m - 2 + 'px',
                        height: m - 2 + 'px'
                    });
                } else {
                	domStyle.set(this.cropNode, {
                        width: w - this.gap * 2 - 2 + 'px',
                        height: h - this.gap * 2 - 2 + 'px'
                    });
                }
                var l = (w - this.cropNode.offsetWidth) / 2,
                    t = (h - this.cropNode.offsetHeight) / 2;
                if (l < 0) l = 0;
                if (t < 0) t = 0;
                domStyle.set(this.cropNode, {
                    left: l + 'px',
                    top: t + 'px'
                });
                this.posArchors();
                this.posBlocks();
                this.onChange(this.getInfo());
            },

            getSize: function() {
                return this.imageSize;
            },
            
            updateUI: function() {
                this.posArchors();
                this.posBlocks();
            },
            
            posArchors: function() {
                var a = this._archors,
                    w = this.cropNode.offsetWidth,
                    h = this.cropNode.offsetHeight;

                a.t.style.left = a.b.style.left = w / 2 - 4 + 'px';
                a.l.style.top = a.r.style.top = h / 2 - 4 + 'px';
            },
            
            posBlocks: function() {
                var p = this.startedPos,
                    b = this._blockNodes;
                var l = parseInt(this.cropNode.style.left || domStyle.set(this.cropNode, 'left'));
                var t = parseInt(this.cropNode.style.top || domStyle.set(this.cropNode, 'top'));
                var w = this.cropNode.offsetWidth;
                var ww = this.domNode.offsetWidth;
                var h = this.cropNode.offsetHeight;
                var hh = this.domNode.offsetHeight;

                b = this._blockNodes;
                b.t.style.height = b.l.style.top = b.r.style.top = t + 'px';

                b.l.style.height = b.r.style.height = h + 'px';
                b.l.style.width = l + 'px';

                b.r.style.width = ww - w - l + 'px';
                b.b.style.height = hh - h - t + 'px';
            },
            
            _onMouseDown: function(e) {
                this.dragging = e.target == this.cropNode ? 'move' : e.target.className;
                var pos = domGeom.position(this.cropNode);
                var pos2 = domGeom.position(this.domNode);
                this.startedPos = {
                    x: e.pageX,
                    y: e.pageY,
                    h: pos.h - 2 //2 is border width
                    ,
                    w: pos.w - 2,
                    l: pos.x - pos2.x,
                    t: pos.y - pos2.y
                }
                var c = domStyle.set(e.target, 'cursor');
                domStyle.set(document.body, {
                    cursor: c
                });
                domStyle.set(this.cropNode, {
                    cursor: c
                });
            },
            
            _onMouseUp: function(e) {
                this.dragging = false;
                domStyle.set(document.body, {
                    cursor: 'default'
                });
                domStyle.set(this.cropNode, {
                    cursor: 'move'
                });
                this.onDone(this.getInfo());
            },
            
            getInfo: function() {
                return {
                    w: this.cropNode.offsetWidth - 2,
                    h: this.cropNode.offsetHeight - 2,
                    l: parseInt(this.cropNode.style.left || domStyle.set(this.cropNode, 'left')),
                    t: parseInt(this.cropNode.style.top || domStyle.set(this.cropNode, 'top')),
                    cw: this.domNode.offsetWidth //container width
                    ,
                    ch: this.domNode.offsetHeight //container height
                };
            },
            
            _onMouseMove: function(e) {
                if (!this.dragging) return;

                if (this.dragging == 'move') this.doMove(e);
                else this.doResize(e);
                this.updateUI();

                this.onChange(this.getInfo());
            },
            
            doMove: function(e) {
                var s = this.cropNode.style,
                    p0 = this.startedPos;
                var l = p0.l + e.pageX - p0.x;
                var t = p0.t + e.pageY - p0.y;
                if (l < 0) l = 0;
                if (t < 0) t = 0;
                var maxL = this.domNode.offsetWidth - this.cropNode.offsetWidth;
                var maxT = this.domNode.offsetHeight - this.cropNode.offsetHeight;
                if (l > maxL) l = maxL;
                if (t > maxT) t = maxT;
                s.left = l + 'px';
                s.top = t + 'px'
            },
            
            onChange: function() {
                //Event:
                //    When the cropping size is changed.
            },
            
            onDone: function() {
                //Event:
                //    When mouseup.
            },
            
            doResize: function(e) {
                var m = this.dragging,
                    s = this.cropNode.style,
                    p0 = this.startedPos;
                //delta x and delta y
                var dx = e.pageX - p0.x,
                    dy = e.pageY - p0.y;

                if (this.keepSquare) {
                    if (m == 'l') {
                        dy = dx;
                        if (p0.l + dx < 0) dx = dy = -p0.l;
                        if (p0.t + dy < 0) dx = dy = -p0.t;
                        m = 'lt';
                    } else if (m == 'r') {
                        dy = dx;
                        m = 'rb';
                    } else if (m == 'b') {
                        dx = dy;
                        m = 'rb';
                    } else if (m == 'lt') {
                        dx = dy = Math.abs(dx) > Math.abs(dy) ? dx : dy;
                        if (p0.l + dx < 0) dx = dy = -p0.l;
                        if (p0.t + dy < 0) dx = dy = -p0.t;
                    } else if (m == 'lb') {
                        dy = -dx;
                        if (p0.l + dx < 0) {
                            dx = -p0.l;
                            dy = p0.l;
                        }
                    } else if (m == 'rt' || m == 't') {
                        dx = -dy;
                        m = 'rt';
                        if (p0.t + dy < 0) {
                            dy = -p0.t;
                            dx = -dy;
                        }
                    }
                }
                if (/l/.test(m)) {
                    dx = Math.min(dx, p0.w - this.minWidth);
                    if (p0.l + dx >= 0) {
                        s.left = p0.l + dx + 'px';
                        s.width = p0.w - dx + 'px';
                    } else {
                        s.left = 0;
                        s.width = p0.l + p0.w + 'px';
                    }
                }
                if (/t/.test(m)) {
                    dy = Math.min(dy, p0.h - this.minHeight);
                    if (p0.t + dy >= 0) {
                        s.top = p0.t + dy + 'px';
                        s.height = p0.h - dy + 'px';
                    } else {
                        s.top = 0;
                        s.height = p0.t + p0.h + 'px';
                    }
                }
                if (/r/.test(m)) {
                    dx = Math.max(dx, this.minWidth - p0.w);
                    if (p0.l + p0.w + dx <= this.domNode.offsetWidth) {
                        s.width = p0.w + dx + 'px';
                    } else {
                        s.width = this.domNode.offsetWidth - p0.l - 2 + 'px';
                    }
                }
                if (/b/.test(m)) {
                    dy = Math.max(dy, this.minHeight - p0.h);
                    if (p0.t + p0.h + dy <= this.domNode.offsetHeight) {
                        s.height = p0.h + dy + 'px';
                    } else {
                        s.height = this.domNode.offsetHeight - p0.t - 2 + 'px';
                    }
                }

                if (this.keepSquare) {
                    var min = Math.min(parseInt(s.width), parseInt(s.height));
                    s.height = s.width = min + 'px';
                }
            }
            
        });
});
