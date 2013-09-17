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
		globalStyle = "{display:block; -moz-box-sizing: border-box; box-sizing: border-box;}",
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

SandleStrap.prototype.inserted = function(e){
	if (e.animationName == "nodeInserted") {
		var elem = e.target;
		this.inject(elem);
		e.target.addClass('rendered');

	}
};

SandleStrap.prototype.ssChangeAttribute = function(attr,val){
	var selector = '.' + this.tagName.toLowerCase() + '-' + attr;
	if(typeof(this.find(selector)) !== "undefined"){
		this.setAttribute(attr,val);
		var tagElem = this.find(selector);
		tagElem.innerHTML = val;
	}
	// else if() {
		//TODO: if I want to be able to change injected attributes on the fly.
	// }
	else{
		console.error('There is no bound attribute "' + attr + '" for this element.');
	}
};

SandleStrap.prototype.ssInnerHTML = function(html){
	var content = this.find('content');
	if(typeof(content) === "object" && typeof(content.length) === "undefined"){
		content.innerHTML = html;
	}
	else{
		console.error('There needs to be one <content> in this control in order to use the ssInnerHTML function.');
	}
};

SandleStrap.prototype.inject = function(elem){
	if(!elem.containsClass('rendered')){
		var tagName = elem.tagName.toLowerCase(),
			obj = this.elements[tagName],
			children = [],
			i;
	
		for (i = 0; i < elem.childNodes.length; i++) {
			children.push(elem.childNodes[i]);
		}
		elem.ssChangeAttribute = this.ssChangeAttribute;
		elem.ssInnerHTML = this.ssInnerHTML;
		var temp = obj.config.template;
		var matches = obj.config.attributes;
		if(matches){
			i = matches.length;
			while(i--){
				if(matches[i] === 'type'){
					temp = obj.templates[elem.getAttribute(matches[i])] || temp;
				}
			}
			matches.push('content');
			// TODO LATER: I might need to unescape the {{}} if this is being used with a framework like angular or handlebars. 
			// This shouldn't be a problem because you need to register your attributes. But I want to keep this in here for a note to b sure to test it.
			i = matches.length;
			while(i--){
				var attr = matches[i],
					reg = new RegExp("{{" + attr + "}}", 'g'),
					attrReg = new RegExp('="{{' + attr + '}}"', 'g');
				if(attrReg.test(temp) && elem.getAttribute(attr)){
					temp = temp.replace(attrReg,'="' + elem.getAttribute(attr) + '"');
				}
				else {
					var replacement = elem.getAttribute(attr) || "";
					temp = temp.replace(reg,'<span class="' + tagName + '-' + attr + '">' + replacement + '</span>');
				}
			}
		}
		elem.innerHTML = temp;
		if(temp.indexOf('<content>') !== -1){
			//elem.ssInnerHTML(html);
			var cont = elem.find('[content]')[0];
			for (i = 0; i < children.length; i++) {
				cont.appendChild(children[i]);
			}
		}
		
		if(obj.config.init)
			obj.config.init(elem);

		// var onrender = elem.getAttribute("onrender");
		// if(onrender){
		//	if(typeof(onrender) === "string"){
		//		var onR = function(){eval(onrender); console.log(this);};
		//		fw.proxy(onR,elem)();//Make sure this use of eval is ok.
		//	}
		//	else if (typeof(onrender) === "function"){
		//		fw.proxy(onrender,elem)();
		//	}
		// }
	}
};

var sandlestrap = new SandleStrap();

// Here we are going to listen for insertion via animation listeners. This way we can inject right away without waiting for document.ready.
// Substitution for mutation events.
document.addEventListener("animationstart", fw.proxy(sandlestrap.inserted, sandlestrap), false); // standard + firefox
document.addEventListener("MSAnimationStart", fw.proxy(sandlestrap.inserted, sandlestrap), false); // IE10
document.addEventListener("webkitAnimationStart", fw.proxy(sandlestrap.inserted, sandlestrap), false); // Chrome + Safari

//set up the content element
document.createElement('content');
