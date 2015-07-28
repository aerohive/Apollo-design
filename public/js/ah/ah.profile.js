var profile = (function(){
 
    return {
        resourceTags: {
            amd: function(filename, mid){
                return /\.js$/.test(filename);
                // If it isn't a test resource, copy only,
                // but is a .js file, tag it as AMD
            }
        }
    };
})();
