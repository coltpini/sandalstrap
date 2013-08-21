var SandleStrap = function(){
	this.elementTypes = [];
	this.elements = {};
};
SandleStrap.prototype.register = function(obj){
	// for IE
	document.createElement(obj.config.tag);
	this.elementTypes.push(obj.config.tag);
	this.elements[obj.config.tag] = obj;
	this.updateStyle();
};

SandleStrap.prototype.updateStyle = function(){
	var style = fw('#insertedStyle'),
		loadingStyle = ' { '+
							"animation-duration: 0.001s;" +
							"-o-animation-duration: 0.001s;" +
							"-ms-animation-duration: 0.001s;" +
							"-moz-animation-duration: 0.001s;" +
							"-webkit-animation-duration: 0.001s;" +
							"animation-name: nodeInserted;" +
							"-o-animation-name: nodeInserted;" +
							"-ms-animation-name: nodeInserted;" +
							"-moz-animation-name: nodeInserted;" +
							"-webkit-animation-name: nodeInserted;" +
						'}',
		hideStyle = "{opacity: 0}",
		globalStyle = "{display:block}",
		loadingSelector = "";

	if(typeof(style) === "undefined"){
		style = document.createElement('style');
		style.setAttribute('id','insertedStyle');
		var ref = document.getElementsByTagName('script')[0];
		ref.parentNode.insertBefore(style, ref);
	}

	var i = this.elementTypes.length;
	while(i--){
		loadingSelector += this.elementTypes[i] + ", ";
	}
	loadingSelector = loadingSelector.substring(0,loadingSelector.lastIndexOf(', '));
	style.appendChild(document.createTextNode(loadingSelector + loadingStyle));
	style.appendChild(document.createTextNode(loadingSelector + hideStyle));
	style.appendChild(document.createTextNode(loadingSelector + globalStyle));
};

SandleStrap.prototype.inserted = function inserted(e){
	if (e.animationName == "nodeInserted") {
		var elem = e.target;

		//I need to inject the stuffs into the element;
		this.inject(elem);
		e.target.addClass('rendered');

	}
};

SandleStrap.prototype.ssChangeAttribute = function(attr,val){
	//TODO: need to test to see if this exists, if not then send an error that the attribute doesn't exist.
	var selector = '.' + this.tagName.toLowerCase() + '-' + attr;
	if(typeof(this.find(selector)) !== "undefined"){
		this.setAttribute(attr,val);
		var tagElem = this.find(selector);
		tagElem.innerHTML = val;
	}
	else{
		console.error('There is no bound attribute "' + attr + '" for this element.');
	}
};

SandleStrap.prototype.ssInnerHTML = function(html){
	//TODO: need to test to see if this exists, if not then send an error that the attribute doesn't exist.
	var content = this.find('content');
	if(typeof(content) === "object" && typeof(content.length) === "undefined"){
		console.debug(content,html);
		content.innerHTML = html;
	}
	else{
		console.error('There needs to be one <content> in this control in order to use the ssInnerHTML function.');
	}
};

SandleStrap.prototype.inject = function(elem){
	//TODO: what about sub components? Will this handle that, I actually think it might!
	if(!elem.containsClass('rendered')){
		var tagName = elem.tagName.toLowerCase(),
			obj = this.elements[tagName],
			html = elem.innerHTML;
		elem.ssChangeAttribute = this.ssChangeAttribute;
		elem.ssInnerHTML = this.ssInnerHTML;
		var temp = obj.config.template;
		// Need to look for attributes, and insert them in the {{}}, (should I replace this with an element to make it easier? Probably.)
		var matches = temp.match(/\{\{.*?\}\}/g);
		console.debug(matches);
		if(matches){
			// TODO LATER: I might need to unescape the {{}} if this is being used with a framework like angular or handlebars.
			var i = matches.length;
			while(i--){
				var attr = matches[i].replace(/\{/g, "").replace(/\}/g,""),
					reg = new RegExp("{{" + attr + "}}");
				temp = temp.replace(reg,'<span class="' + tagName + '-' + attr + '">' + elem.getAttribute(attr) + '</span>');
			}
			console.debug(temp);
		}
		elem.innerHTML = temp;
		if(temp.indexOf('<content>') >= 0)
			elem.ssInnerHTML(html);
	}
	

};

var sandlestrap = new SandleStrap();

//Here we are going to listen for insertion via animation listeners. This way we can inject right away without waiting for document.ready.
document.addEventListener("animationstart", fw.proxy(sandlestrap.inserted, sandlestrap), false); // standard + firefox
document.addEventListener("MSAnimationStart", fw.proxy(sandlestrap.inserted, sandlestrap), false); // IE10
document.addEventListener("webkitAnimationStart", fw.proxy(sandlestrap.inserted, sandlestrap), false); // Chrome + Safari

//set up the content element
document.createElement('content');

//sandlestrap.register(ssContent);
