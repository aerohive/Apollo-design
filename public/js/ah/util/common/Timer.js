define([],function(){
	
	var Timer = {
		
		_cache : {},

		add : function(fn, time, type){
			var time = +time;

			this._cache[time] || (this._cache[time] = []);

			this._cache[time].push(fn);

			this.start(time);

			/*
			 	var name = undefined === type ? time : (time + '_' + type | type);

				(this._cache[name] || ........).push(fn);

				this._cache[name].timeout = +time;

				this.start(name);
			*/
		},

		start : function(time, newTime){
			var _self = this;

			if(this._cache[time] && this._cache[time].timeID)
				return;

			(function(){
				
				var i = 0, events = _self._cache[time], len;

				if(!events) return;

				len = events.length;
				
				for(; i < len; i++ ){

					if(events[i]() === false){

						events.splice(i, 1);
						
						i--;

					}

				}

				events.timeID = setTimeout(arguments.callee, newTime || time);

			})();

			/*
			 	_self._cache[name].length
			 		
				
				_self._cache[name].timeID = setTimeout(arguments.callee, newTime || _self._cache[name].timeout);
			 
			 */

		},

		stop : function(time){
			if(this._cache[time]){
				clearTimeout(this._cache[time].timeID);
				this._cache[time].timeID = 0;
			}
		},

		changeTime : function(oldTime, newTime){
			this.stop(oldTime);
			this.start(oldTime, newTime);
		}

	};

	return Timer;

});
