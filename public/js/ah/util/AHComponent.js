/**
 *@This Class would be relate with business
 *@Later we may got some Class about business
 */
define([
	'dojo/_base/declare',
	'dojo/on',
	"dojo/_base/lang",
	'ah/util/common/ModuleBase',
	'dojo/window',
	'dojox/date/timezone',
	"ah/util/Formatter"
], function (
	declare, on, lang, ModuleBase, win, timezone, Formatter
) {
		return declare('ah/util/AHComponent',[ModuleBase],{

            startup: function () {
                this.inherited(arguments);

            },

			/**
			 *@Method
			 *@For raido checked value
			 *@Not use query :checked
			 */
			radioVal : function(els,v){
				var val,el;

				if(typeof v !== 'undefined'){
					dojo.forEach(els,function(radio){
						if(radio.value == v){
							radio.checked = true;
							el = radio;
							return false;
						}
					});

					return el;
				}else{
					dojo.forEach(els,function(radio){
						if(radio.checked){
							val = radio.value;
							return false;
						}
					});

					return val;
				}
			},


			toTime : function(v){
				var time = v ? new Date(v) : new Date();
				return time.getTime();
			},

			/**
			 *@Method
			 *@For formate time, unity time display
			 */
			formatTime : function(timestamp, cfg) {
				return Formatter.formatTime(timestamp, cfg)
			},

			_getOffset: function(dateObject, timezone){
				var dateObject = new Date(dateObject);
				var tzInfo = dojox.date.timezone.getTzInfo(dateObject, timezone);
				var offset = dateObject.getTimezoneOffset() - tzInfo.tzOffset;
				return offset;
			},

			// Get date object according to vhm timezone
			calOffsetTime: function(dateObject, timezone){
				var offset = this._getOffset(dateObject, timezone);
				dateObject = new Date(dateObject + (offset * 60 * 1000));
				return dateObject;
			},
			calOriginTime: function(dateObject, timezone){
				var offset = this._getOffset(dateObject, timezone);
				dateObject = new Date(dateObject - (offset * 60 * 1000));
				return dateObject;
			},

			/**
			 *@For attach id, createdAt, updatedAt to edit json
			 */
			attachId : function(data,json){
				if(data && !json.id){
					data.id && (json.id = data.id);
					data.createdAt && (json.createdAt = data.createdAt);
					data.updatedAt && (json.updatedAt = data.updatedAt);
				}

				return json;
			},


			/**
			 *@For entity pop up
			 */
			_popEntity : function(entityFactory){

				return function(dialogCfg, entityCfg, callback){
					var entity = entityFactory(entityCfg),
						h = win.getBox().h,
						sTop = document.body.scrollTop || document.documentElement.scrollTop,
						threshold = 'ActiveXObject' in window ? 110 : 100,
						style, dialog;

					if(style = dialogCfg.style){
						!/height/.test(style) && (dialogCfg.style = 'height:' + (h-threshold) + 'px;' + style);
					}

					dialog = this.$pop(dialogCfg, entity, callback);

					// @TODO need unify this
					dialog.domNode.style.top = sTop+80+'px';

				};

			},

			popEntity : function(dialogCfg, entityCfg, callback){
				var that = this;

				require(['ah/comp/entities/EntityFactory'], function(EntityFactory){
					that._popEntity(EntityFactory).call(that, dialogCfg, entityCfg, callback);

					that.popEntity = that._popEntity(EntityFactory);
				});

			}


		});

})
