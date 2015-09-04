define(["dojo/_base/declare",
        "dojo/_base/lang",
		"dojo/text!./templates/home.html",
		"dojo/dom-class",
	  	"ah/util/common/ModuleBase",
		"ah/app/common/stage",
		"ah/app/common/why",
		"ah/app/common/components",
		"ah/app/common/experience",
        "ah/config/preload",
        "ah/layers/util"], function(declare, lang, template, domCla, ModuleBase, Stage, Why, Component, Experience) {

	return declare("ah/app/common/home", [ ModuleBase ], {

		templateString : template,

		events : [
			['stage', 'click', '_handleMods', 'stage'],
			['why', 'click', '_handleMods', 'why'],
			['component', 'click', '_handleMods', 'component'],
			['experience', 'click', '_handleMods', 'experience'],

            ['searchObj', 'clickItem', '_handleSearch']
		],

        postMixInProperties : function(){
            this.inherited(arguments);

            this.__gotoComp = lang.hitch(this, this._handleMods, 'component');
        },

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

			var cla = 'active', cur = this.get(cla),
				isStage = type === 'stage';

			domCla[isStage ? 'add' : 'remove'](this.content, 'main');
			domCla[isStage ? 'add' : 'remove'](this.domNode, 'overflow-hidden');

			domCla.remove(this[cur], cla);
			domCla.add(this[type], cla);

			this._set('active', type);
		},

		_handleMods : function(type, e){
			e.preventDefault();

			if(e.target.className.indexOf('active') != -1) return;

			this._makeMods(type);
		},

        _handleSearch : function(widget){
            var type = 'component',
                obj = this._mods[type],
                cur = this.get('active'),
                isActive = cur === type;

            if(obj && !isActive){
                this._makeMods(type);
                obj.setCurrent(widget);
                return;
            }

            if(obj && isActive){
                obj.setCurrent(widget);
                return;
            }

            if(!obj){
                this._makeMods(type, {'__current':widget});
                return;
            }
            
        },

        _makeMods : function(type, opt){
            var mods = this._mods, obj, m;

            mods[this.get('active')].domNode.style.display = 'none';

			if(!(obj = mods[type])){
				m = mods[type] = new this._maps[type](opt || {});
				m.placeAt(this.content, 'last');
			}else{
				obj.domNode.style.display = '';
			}

			this.set('active', type);
        }

	});

});
