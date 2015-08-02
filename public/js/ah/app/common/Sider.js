define(["dojo/_base/declare",
		'dojo/_base/lang',"dojo/_base/array", "dojo/dom-construct","dojo/dom-class",
	  	"ah/util/common/ModuleBase"], function(declare, lang, array, domCon, domClass, ModuleBase) {

	return declare("ah/app/common/Sider", [ ModuleBase ], {

		templateString : '<div></div>',

		items : [
			{category : 'Components', list : [
				{label : 'Tab', type : '', current : true, widget : 'components/tab'},
			]},
			{category : 'Styles', list : [
				{label : 'Layout', widget : 'styles/layout'}
			]}
		],

		_setItemsAttr : function(items){
			if(!items || !items.length) return;

			this._makeList(items);
		},

		_setCurrentAttr : function(el){
			if(!el) return;
			var cur = this.get('current');

			cur && domClass.remove(cur, 'cur');
			domClass.add(el, 'cur');

			this._set('current', el);
		},

		events : [
			['domNode', 'li a:click', '_handleClickItem']	
		],

		_makeList : function(items){
			var n = 0, frag = document.createDocumentFragment();

			array.forEach(items, function(item){
				var div = document.createElement('div'),
					h3 = document.createElement('h3'),
					ul = document.createElement('ul');

				this.$text(h3, item.category);
				div.appendChild(h3);
				div.appendChild(ul);

				array.forEach(item.list, function(obj){
					var li = document.createElement('li'),
						a = document.createElement('a'),
						label = obj.label,
						type = obj.type || this._normalize(label);

					this.$text(a, label);
					//a.setAttribute('data-type', type);
					a.mod = obj.widget;

					if(obj.current && n === 0){
						this.set('current', a);
						this.onClickItem(obj.widget);
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

			this.set('current', t);
			this.onClickItem(t.mod);
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
