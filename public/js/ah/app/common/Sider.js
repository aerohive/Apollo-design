define(["dojo/_base/declare",
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/dom-construct',
		'dojo/dom-class',
		'ah/util/common/ModuleBase'], function(declare, lang, array, domCon, domClass, ModuleBase) {

	return declare('ah/app/common/Sider', [ ModuleBase ], {

        _flag : false,

		templateString : '<div class="cat-list-area"></div>',

		items : [
			{category : 'Components', list : [
				{label : 'Tab', type : '', current : true, widget : 'components/tab'},
				{label : 'Grid', type : '', widget : 'components/tab'}
			]},
			{category : 'Styles', list : [
				{label : 'Layout', widget : 'styles/layout'}
			]}
		],

		_setItemsAttr : function(items){
			if(!items || !items.length) return;

			this._makeList(items);
		},

        _getCurrentAttr : function(){
            return !this._flag ? null : this._get('current');
        },

		_setCurrentAttr : function(mod){
			if(!mod) return;

            if(!this._aMaps) return;

			var curMod = this.get('current'),
                cur = this._aMaps[curMod],
                el = this._aMaps[mod];

            if(curMod === mod) return;

			cur && domClass.remove(cur, 'cur');
			el && domClass.add(el, 'cur');
            
			this.onClickItem(mod);

			this._set('current', mod);

            this._flag = true;
		},

		events : [
			['domNode', 'li a:click', '_handleClickItem'],
            ['domNode', '.cat-title:click', '_toggleArea']
		],

		_makeList : function(items){
			var n = 0, frag = document.createDocumentFragment();

			array.forEach(items, function(item){
				var div = domCon.create('div', {class: 'mb20'}),
					h3 = domCon.create('h3', {class: 'cat-title'}),
					ul = domCon.create('ul', {class: 'cat-list'});

				this.$text(h3, item.category);
				div.appendChild(h3);
				div.appendChild(ul);

				array.forEach(item.list, function(obj, idx){
					var li = domCon.create('li', {class: 'cat-list-item'}),
						a = domCon.create('a'),
						label = obj.label,
						type = obj.type || this._normalize(label);

					this.$text(a, label);
					//a.setAttribute('data-type', type);
					a.mod = obj.widget;

                    (this._aMaps || (this._aMaps = {}))[obj.widget] = a;

					if(obj.current && n === 0 && !this.current){
						this.set('current', a.mod);
						//this.onClickItem(obj.widget);
						n++;
					}

					li.appendChild(a);
					ul.appendChild(li);
				}, this);

				frag.appendChild(div);

			}, this);

			// TODO should empty domNode,then append
			this.domNode.appendChild(frag);
		},

		_handleClickItem : function(e){
			var t = e.target,
				type = t.getAttribute('data-type');

			if(t === this.get('current')) return;

			this.set('current', t.mod);
			//this.onClickItem(t.mod);
		},

        _toggleArea : function(e){
            var t = e.target;

            this.$toggleWipe(t.nextElementSibling);
        },

		_normalize : function(txt){
			var arr = txt.split(/\s+/),
				dd;

			if(arr.length === 1) {
				dd = arr[0];
				return /[A-Z]/.test(dd.charAt(0)) ? dd.toLowerCase() : dd;
			}

			arr = array.map(arr, function(item, i){
				return i === 0 ? item.toLowerCase() :
							item.charAt(0).toUpperCase() + item.substring(1);
			});

			return arr.join('');
		},

		onClickItem : function(){}

	});

});
