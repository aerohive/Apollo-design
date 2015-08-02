define(["dojo/_base/declare",
		"dojo/text!./templates/home.html",
		"dojo/dom-class",
	  	"ah/util/common/ModuleBase",
		"ah/app/common/stage",
		"ah/app/common/why",
		"ah/app/common/components",
		"ah/app/common/experience",
		// preload
		"ah/app/common/DemoArea"], function(declare, template, domCla, ModuleBase, Stage, Why, Component, Experience) {

	return declare("ah/app/common/home", [ ModuleBase ], {

		templateString : template,

		events : [
			['stage', 'click', '_handleMods', 'stage'],
			['why', 'click', '_handleMods', 'why'],
			['component', 'click', '_handleMods', 'component'],
			['experience', 'click', '_handleMods', 'experience']
		],

		postCreate : function(){
			this.inherited(arguments);

			this._mods = {'stage' : this.stageObj};

			this._maps = {
				'stage' : Stage,
				'why' : Why,
				'component' : Component,
				'experience' : Experience
			};
		},

		active : 'stage',
		_setActiveAttr : function(type){
			if(!type) return;

			var cla = 'active', cur = this.get(cla);

			domCla[type === 'stage' ? 'add' : 'remove'](this.content, 'main');

			domCla.remove(this[cur], cla);
			domCla.add(this[type], cla);

			this._set('active', type);
		},

		_handleMods : function(type, e){
			e.preventDefault();

			var mods = this._mods, obj, m;

			if(e.target.className.indexOf('active') != -1) return;
			
			mods[this.get('active')].domNode.style.display = 'none';

			if(!(obj = mods[type])){
				m = mods[type] = new this._maps[type]();
				m.placeAt(this.content, 'last');
			}else{
				obj.domNode.style.display = '';
			}

			this.set('active', type);
		}
	
	});

});
