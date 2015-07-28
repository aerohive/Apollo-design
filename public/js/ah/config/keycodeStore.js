define([
		"dojo/_base/lang"
		], function(lang){

		var keyUnitMap = {
			'name' : function(key){ return key == 32 || key == 34 || key == 63},
					/*[33,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,
                      51,52,53,54,55,56,57,58,59,60,61,62,64,65,66,67,68,69,
                      70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,
                      89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,
                      106,107,108,109,110,111,112,113,114,115,116,117,118,119,
                      120,121,122,123,124,125,126],*/
			
			'textChar' : function(key){
				return key < 65 || (key > 90 && key < 97) || key > 122;
			},

			'num' : function(key, e){
				return !((key >= 48 && key <= 57) || key == 8 || e.which && key == 0 || !e.which && key == 46);
			},
			
			'floatNum' : function(key, e){
				return !((key >= 48 && key <= 57) || key == 8 || key == 46);
			}
		};

		
		return function(type, keyCode, e){
			var d = keyUnitMap[type];

			if(!d) return;

			switch(true){
				case Array.isArray(d):
					return d.indexOf(keyCode) == -1;

					break;
				case 'function' === typeof d:
					return d(keyCode, e);

					break;
				default:
					break;
			}

		}
		
});
