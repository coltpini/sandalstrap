var ssIcon = function(){};

ssIcon.templates = {
	print: "NLMLM IJK",
    fit: "BA",
    fitWidth: "CA",
    fitHeight: "DA",
    actualSize: "EA",
    download: "G",
    menu: "P"
};

ssIcon.config = {
	tag: "ss-icon",
	template:	"",
	attributes: ["type","scheme"],
	init : function(elem){
		var text = elem.innerHTML,
			html = "",
			type = elem.getAttribute('type') || "";
		for (var i = 0; i < text.length; i++) {
			html += '<span class="icLayer ic' + i + '">' + text[i] + "</span>";
		}
		elem.innerHTML = html;
		elem.setAttribute('title',type.replace(/([A-Z])/g," $&").toLowerCase());
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