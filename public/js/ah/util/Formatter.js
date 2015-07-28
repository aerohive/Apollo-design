define(['dojo/date/locale',"dojo/_base/lang"],
	function(locale, lang){

		return {

			/*
				convertBytes(int bytes)
			*/

			convertBytes: function(bytes) {
				var kb = 1024,
					mb = kb * 1024,
					gb = mb * 1024,
					tb = gb * 1024,
					formatedUsage = bytes,
					label = 'B';

				dojo.forEach([
					[kb, 'KB'],
					[mb, 'MB'],
					[gb, 'GB'],
					[tb, 'TB']
					], function(unit, idx) {
						if(bytes > unit[0]) {
							formatedUsage = Math.round(bytes / unit[0] * 100) / 100;
							label = unit[1];
						}
				});
				return { value: formatedUsage, label: label};
			},

			/**
			 *@ convert time
			 *@ value {Number}
			 *@ type {String}  "m-h" minutes to hours
			 */
			convertTime : function(value, type){

				var arr = type.split(/\W/),
					from = arr[0],to = arr[1],
					maps = {
						s : 1,
						m : 60,
						h : 60*60,
						d : 60*60*24
					},secs,result;

				if(from === to) return value;

				secs = maps[from] * value;

				result = secs/maps[to];

				return result;

			},

			/**
			 *@Method
			 *@For formate time, unity time display
			 */
			formatTime : function(timestamp, cfg){
				var time = new Date(timestamp),
				defaultCfg = {selector:'date', datePattern : 'yyy-MM-dd HH:mm:ss'};

				if(!arguments.length || 'undefined' === typeof timestamp){
					time = new Date();
				}

				if('object' === typeof timestamp && !(timestamp instanceof Date)){
					cfg = timestamp;
					time = new Date();
				}

				cfg = lang.mixin(defaultCfg, cfg || {});

				return locale.format(time, cfg);
			}

		};
	}
);
