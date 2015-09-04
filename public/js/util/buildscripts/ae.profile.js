var profile = (function(){
    return {
        basePath: "../../",
        releaseDir: "./dist",
        releaseName: "lib",
        action: "release",

        packages:[{
            name: "dojo",
            location: "dojo"
        },{
            name: "dijit",
            location: "dijit"
        },{
            name: "dojox",
            location: "dojox"
        },{
            name: "ah",
            location: "ah"
        },{
			name : "dgrid",
			location : "dgrid"
		},{
			name : 'dstore',
			location : 'dstore'
		}],

        layers: {
            "dojo/dojo": {
                include: [ "dojo/dojo", "dojo/parser", "dojo/selector/acme"],
                customBase: true,
                boot: true
            },
            "ah/ae" : {
                include : ["ah/app/common/home"],
                exclude : ["ah/layers/util"],
            },
            "ah/util" : {
                include : ["ah/layers/util"]
            }
        }
    };
})();
