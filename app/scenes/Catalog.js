function SceneCatalog(options) {
    this.options = options;
}

SceneCatalog.prototype.initialize = function () {
    $.log("SceneCatalog.initialize()");
    MenuCargar();
};

SceneCatalog.prototype.handleShow = function () {
    $.log("SceneCatalog.handleShow()");
};

SceneCatalog.prototype.handleHide = function () {
    $.log("SceneCatalog.handleHide()");
};

SceneCatalog.prototype.handleFocus = function () {
    $.log("SceneCatalog.handleFocus()");
	
	SceneActive = "Catalog";
	if(PrevScene == "Login" || PrevScene == "Confirm") km.setActive(t4);

};

SceneCatalog.prototype.handleBlur = function () {
    $.log("SceneCatalog.handleBlur()");
	PrevScene = "Catalog";
	
};