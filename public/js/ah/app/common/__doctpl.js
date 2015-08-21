define(["dojo/_base/declare",
		'dojo/_base/lang',
		"ah/app/common/Sider"], function(declare, lang) {

	return declare("ah/app/common/__doctpl", [], {

		_setActiveAttr : function(widget){
			if(!widget) return;
			
			var cur = this.get('active');

			cur && (cur.domNode.style.display = 'none');
			widget.domNode.style.display = '';

			this._set('active', widget);
		},

		_handleToggleMod : function(mod){
			var m = this._mods[mod],
                cur = this.get('active'),
                spinner = this.spinner,
				url = 'ah/app/design/'+mod;
			
			if(!m){
                if(cur){
                   cur.domNode.style.display = 'none';
                   spinner.style.display = '';
                }else{
                   spinner.style.display = '';
                }

				require([url], lang.hitch(this, function(Kla){
					var o;

                    this.spinner.style.display = 'none';

					this._mods[mod] = o = new Kla();
					o.placeAt(this.area, 'last');
                    o.domNode.style.opacity = 0;

                    this.$fadeIn(o.domNode);

					this.set('active', o);

				}));

				return;
			}
			
			this.set('active', m);

		},

        setCurrent : function(mod){
            this.sider && 
                this.sider.set('current', mod);
        }
	
	});

});
