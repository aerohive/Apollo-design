var profile = (function(){
 
    return {
        resourceTags: {
			copyOnly : function(filename, mid){
				return /(png|jpg|jpeg|gif|tiff)$/.test(filename);		
			},

            amd: function(filename, mid){
                return /\.js$/.test(filename);
                // If it isn't a test resource, copy only,
                // but is a .js file, tag it as AMD
            }
        }
    };
})();
