function SceneConfirm(options) {
    this.options = options;
}

SceneConfirm.prototype.initialize = function () {    
    $.log("SceneConfirm.initialize()");    
};

SceneConfirm.prototype.handleShow = function () {
    $.log("SceneConfirm.handleShow()");
	
    $('#userNameInputConf').attr('value', System.LoginData.LoggedUser);
    $('#passwordInputConf').val('');
	$('#virtualKeyboardConfirmInput').html('');

};

SceneConfirm.prototype.handleHide = function () {
    $.log("SceneConfirm.handleHide()");
};

SceneConfirm.prototype.handleFocus = function () {
    $.log("SceneConfirm.handleFocus()");
    
    SceneActive = "Confirm";
    
    tConfirm = new LoginKeyboardComponent($("#confirmForm"));
    tConfirmKey = new VirtualKeyboardComponent($("#virtualKeyboardConfirm"));

    km.register(tConfirm);
    km.register(tConfirmKey);
    
    km.connect(tConfirm, Keyboard.Connectors.LEFT, tConfirmKey, Keyboard.Connectors.RIGHT);
    
    tConfirm.resetForm();
    km.setActive(tConfirm);

};

SceneConfirm.prototype.handleBlur = function () {
    $.log("SceneConfirm.handleBlur()");
    if(System.Parametros.parental_active == false)  t4.init();
    PrevScene = "Confirm";
};
