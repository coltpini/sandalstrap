var SandleStrap=function(){this.elementTypes=[],this.elements={}};SandleStrap.prototype.register=function(a){document.createElement(a.config.tag),this.elementTypes.push(a.config.tag),this.elements[a.config.tag]=a,this.updateStyle()},SandleStrap.prototype.updateStyle=function(){var a=fw("#insertedStyle"),b=" { animation-duration: 0.001s;-o-animation-duration: 0.001s;-ms-animation-duration: 0.001s;-moz-animation-duration: 0.001s;-webkit-animation-duration: 0.001s;animation-name: nodeInserted;-o-animation-name: nodeInserted;-ms-animation-name: nodeInserted;-moz-animation-name: nodeInserted;-webkit-animation-name: nodeInserted;}",c="{opacity: 0}",d="{display:block}",e="";if("undefined"==typeof a){a=document.createElement("style"),a.setAttribute("id","insertedStyle");var f=document.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}for(var g=this.elementTypes.length;g--;)e+=this.elementTypes[g]+", ";e=e.substring(0,e.lastIndexOf(", ")),a.appendChild(document.createTextNode(e+b)),a.appendChild(document.createTextNode(e+c)),a.appendChild(document.createTextNode(e+d))},SandleStrap.prototype.inserted=function(a){if("nodeInserted"==a.animationName){var b=a.target;this.inject(b),a.target.addClass("rendered")}},SandleStrap.prototype.ssChangeAttribute=function(a,b){var c="."+this.tagName.toLowerCase()+"-"+a;if("undefined"!=typeof this.find(c)){this.setAttribute(a,b);var d=this.find(c);d.innerHTML=b}else console.error('There is no bound attribute "'+a+'" for this element.')},SandleStrap.prototype.ssInnerHTML=function(a){var b=this.find("content");"object"==typeof b&&"undefined"==typeof b.length?b.innerHTML=a:console.error("There needs to be one <content> in this control in order to use the ssInnerHTML function.")},SandleStrap.prototype.inject=function(elem){if(!elem.containsClass("rendered")){var tagName=elem.tagName.toLowerCase(),obj=this.elements[tagName],html=elem.innerHTML;elem.ssChangeAttribute=this.ssChangeAttribute,elem.ssInnerHTML=this.ssInnerHTML;var temp=obj.config.template,matches=obj.config.attributes;if(matches)for(var i=matches.length;i--;){var attr=matches[i],reg=new RegExp("{{"+attr+"}}");"type"===attr&&elem.getAttribute(attr)&&(temp=obj.templates[elem.getAttribute(attr)]),temp=temp.replace(reg,'<span class="'+tagName+"-"+attr+'">'+elem.getAttribute(attr)+"</span>")}elem.innerHTML=temp,temp.indexOf("<content>")>=0&&elem.ssInnerHTML(html),obj.config.init&&obj.config.init(elem);var onrender=elem.getAttribute("onrender");if(onrender)if("string"==typeof onrender){var onR=function(){eval(onrender),console.log(this)};fw.proxy(onR,elem)()}else"function"==typeof onrender&&fw.proxy(onrender,elem)()}};var sandlestrap=new SandleStrap;document.addEventListener("animationstart",fw.proxy(sandlestrap.inserted,sandlestrap),!1),document.addEventListener("MSAnimationStart",fw.proxy(sandlestrap.inserted,sandlestrap),!1),document.addEventListener("webkitAnimationStart",fw.proxy(sandlestrap.inserted,sandlestrap),!1),document.createElement("content");