define(['dojo/json', "ah/util/DataMgr"], function (JSON, DataMgr) {
	var wrap = function (store) {
		return {
			get: function (key, ret) {
				key = (DataMgr.ownerId || 102) + '_'+key;
				try {
					return JSON.parse(ret = store.getItem(key));
				} catch (e) {
					return ret;
				}
			},

			set: function (key, value, obj) {
				key = (DataMgr.ownerId || 102) + '_'+key;
				if (typeof (obj = key) === 'object') {
					for (key in obj) {
						this.set(key, obj[key]);
					}
				} else {
					store.setItem(key, JSON.stringify(value));
				}
			},

			remove: function (key) {
				key = (DataMgr.ownerId || 102) + '_'+key;
				store.removeItem(key);
			}
		};
	};

	return {
		'wrap': wrap
	};
});
