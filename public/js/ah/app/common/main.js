require(['dojo/parser', 'ah/app/common/home'],function(parser){
	parser.parse();

    var spinner = document.getElementById('spinner');

    spinner.parentNode.removeChild(spinner);
})
