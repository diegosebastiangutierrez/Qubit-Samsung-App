function SceneConfirmBuy(options) {
    this.options = options;
}

SceneConfirmBuy.prototype.initialize = function () {
    $.log("SceneConfirmBuy.initialize()");
};

SceneConfirmBuy.prototype.handleShow = function () {
    $.log("SceneConfirmBuy.handleShow()");
};

SceneConfirmBuy.prototype.handleHide = function () {
    $.log("SceneConfirmBuy.handleHide()");
};

SceneConfirmBuy.prototype.handleFocus = function () {
    $.log("SceneConfirmBuy.handleFocus()");

    SceneActive = "ConfirmBuy";    
    drawConfirmData();
    tConfirmForm = new BuyKeyboardComponent($("#confirmBuyForm"));
    km.register(tConfirmForm);
    km.setActive(tConfirmForm);

};

SceneConfirmBuy.prototype.handleBlur = function () {
    $.log("SceneConfirmBuy.handleBlur()");
	$("#ConfirmElement_thumb").attr("alt", "").attr("src", "");
    PrevScene = "Detail";
    delete Element.Quatity_for_buy;
    // this function will be called when the scene manager move focus to another scene from this scene
};
