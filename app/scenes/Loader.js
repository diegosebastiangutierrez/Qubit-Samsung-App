function SceneLoader(options) {
    this.options = options;
   
}

SceneLoader.prototype.initialize = function () {
    alert("SceneLoader.initialize()");
};

SceneLoader.prototype.handleShow = function () {
    alert("SceneLoader.handleShow()");    
};

SceneLoader.prototype.handleHide = function () {
    alert("SceneLoader.handleHide()");
};

SceneLoader.prototype.handleFocus = function () {
    alert("SceneLoader.handleFocus()");
	
	tLoader = new DivKeyboardComponent($("#LoaderBG"));
    
    km.register(tLoader);
    km.setActive(tLoader);
    
    SceneActive = "Loader";
    checkStatuses();

};

SceneLoader.prototype.handleBlur = function () {
    alert("SceneLoader.handleBlur()");
};
