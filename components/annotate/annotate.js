var ssAnnotate = function(){};
ssAnnotate.config = {
	tag: "ss-annotate",
	template:	'<span class="number"></span><p class="container"></p>',
	attributes: [""],
	init: function(elem){
        var annotate = new Annotate(elem);
        sandlestrap.insertionHandlers.push(annotate.add);
    }
};

sandlestrap.register(ssAnnotate);


var Annotate = function(elem){
    this.elem = elem;
    this.annotationNumber = elem.find('span.number');
    this.annotationContainer = elem.find('p.container')
    this.list = this.getList();
    this.counter = 0;
    this.run();
};

Annotate.prototype.getList = function(){
    return document.body.find('[[annotation]]');
};

Annotate.prototype.run = function(){
    var func = fw.proxy(this.add,this);
    this.list.forEach(func);
};
Annotate.prototype.clickerHandler = function(e){
    fw.stopCancel(e);
    var elem = e.target,
        parent = elem.parentElement,
        message = "";
    while(parent.getAttribute('annotation') === null)
        parent = parent.parentElement;
    
    message = parent.getAttribute('annotation');
    this.annotationContainer.innerHTML = message;
    this.annotationNumber.innerHTML = elem.innerHTML;
};

Annotate.prototype.add = function(elem){
    
    if(elem.getAttribute('annotation') !== null && !elem.containsClass('annotated')){
        elem.addClass('annotated');
        var clicker = elem.createChild('span');
        clicker.addListener('click',this.clickerHandler,false,this);
        clicker.addClass('clicker');
        this.counter += 1;
        clicker.innerHTML = this.counter; 
    }
};