var ssIcon = function(){};

ssIcon.templates = {
	print: "NLMLMPIJK",
    fit: "AB",
    fitWidth: "AC",
    fitHeight: "AD",
    actualSize: "AE",
    download: "G"
};

ssIcon.config = {
	tag: "ss-icon",
	template:	"",
	attributes: ["type"],
	init : function(elem){
		var text = elem.innerHTML,
			html = "";
		for (var i = 0; i < text.length; i++) {
			html += '<span class="icLayer ic' + i + '">' + text[i] + "</span>";
		}
		elem.innerHTML = html;
		elem.addListener('click',function(e){
			var _t = this,
				    dur = 300;
				if(_t.getAttribute('type') === "print")
				    dur = 1500;

				_t.classList.add('active');
				setTimeout(function(){_t.classList.remove('active');}, dur);
		});
	}
};


sandlestrap.register(ssIcon);