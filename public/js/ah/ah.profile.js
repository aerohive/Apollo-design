var profile = (function(){

    var copyOnly = function(filename, mid){
        var list = {
            "ah/ah.profile": true,
            "ah/package": true
        };
        return (mid in list) || /(png|jpg|jpeg|gif|tiff)$/.test(filename);
    };
 
    return {
        resourceTags: {
			copyOnly : function(filename, mid){
				return copyOnly(filename, mid);		
			},

            amd: function(filename, mid){
                return /\.js$/.test(filename);
                // If it isn't a test resource, copy only,
                // but is a .js file, tag it as AMD
            }
        }
    };
})();
