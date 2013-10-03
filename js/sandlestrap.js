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
	this.loadingSelector = loadingSelector;
};
var ieStinks = false;
SandleStrap.prototype.inserted = function(e,elem){
	var fromEvent = false;
	if (e) {
		elem = e.target;
		fromEvent = true;
	}
	if(!fromEvent || e.animationName === "nodeInserted")
		this.inject(elem);
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
	if(elem.isFW && !elem.containsClass('rendered')){
		var tagName = elem.tagName.toLowerCase(),
			obj = this.elements[tagName],
			children = [],
			i,
			tempElem = fw('<div>');
		if(obj){
			elem.ssChangeAttribute = this.ssChangeAttribute;
			elem.ssInnerHTML = this.ssInnerHTML;
			var template = obj.config.template;
			var matches = obj.config.attributes;
			if(matches){
				i = matches.length;
				while(i--){
					if(matches[i] === 'type'){
						template = obj.templates[elem.getAttribute(matches[i])] || template;
					}
				}
				matches.push('content');
				// TODO LATER: I might need to unescape the {{}} if this is being used with a framework like angular or handlebars. 
				// This shouldn't be a problem because you need to register your attributes. But I want to keep this in here for a note to be sure to test it.
				i = matches.length;
				while(i--){
					var attr = matches[i],
						reg = new RegExp("{{" + attr + "}}", 'g'),
						attrReg = new RegExp('="{{' + attr + '}}"', 'g');
					if(attrReg.test(template) && elem.getAttribute(attr)){
						template = template.replace(attrReg,'="' + elem.getAttribute(attr) + '"');
					}
					else {
						var replacement = elem.getAttribute(attr) || "";
						template = template.replace(reg,'<span class="' + tagName + '-' + attr + '">' + replacement + '</span>');
					}
				}
			}

			while(elem.childNodes.length > 0){
				var cn = elem.childNodes[0];
				tempElem.appendChild(cn);
				children.push(cn);
			}
			elem.innerHTML = template;
			if(template.indexOf('<content>') !== -1){
				var cont = elem.find('[content]')[0];
				for (i = 0; i < children.length; i++) {
					cont.appendChild(children[i]);
				}
			}
			if(obj.config.init)
				obj.config.init(elem);

			elem.addClass('rendered');
		}
	}
};

var sandlestrap = new SandleStrap();

// Here we are going to listen for insertion via animation listeners. This way we can inject right away without waiting for document.ready.
// Substitution for mutation events.

var insertedProxy = fw.proxy(sandlestrap.inserted, sandlestrap),
	listener = ["animationstart","MSAnimationStart","oanimationstart","webkitAnimationStart"],
	i = listener.length,
	animationListenerSupport = false;

while(i--){
	if(fw.checkEventSupport(listener[i])){
		document.addEventListener(listener[i], insertedProxy, false);
		animationListenerSupport = true;
	}
}
//This should only be used if the animation event doesn't work.
var observeDOM = function(obj, callback){
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    if( MutationObserver ){
        // define a new observer
        var obs = new MutationObserver(function(mutations, observer){
            if( mutations[0].addedNodes.length){
				var i = mutations[0].addedNodes.length;
				while(i--){
					callback(undefined, mutations[0].addedNodes[i]);
				}
			}
        });
        // have the observer observe foo for changes in children
        obs.observe( obj, { childList:true, subtree:true });
    }
    else
		obj.addListener('DOMNodeInserted', callback);
};

// Observe a specific DOM element, only run if animationStart event doesn't work
if(!animationListenerSupport)
	observeDOM( document.documentElement , insertedProxy);

//set up the content element
document.createElement('content');

document.onreadystatechange = function (){
	if (document.readyState == "complete") {
		fw('[' + sandlestrap.loadingSelector + ']').forEach(function(elem){
			insertedProxy(undefined, elem);
		});
	}
};