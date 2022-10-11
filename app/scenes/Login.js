function SceneLogin(options) {
    this.options = options;
}

SceneLogin.prototype.initialize = function () { 
    $.log("SceneLogin.initialize()");
};

SceneLogin.prototype.handleShow = function () {
    $.log("SceneLogin.handleShow()");
    
    if(LoggedUser != "") $('input[type=text]').attr('value', LoggedUser);
	else $('input[type=text]').attr('value','');
    if(LoggedPassword != "") $('input[type=password]').attr('value',LoggedPassword);
	else $('input[type=password]').attr('value','');
	
	$('#virtualKeyboardInput').html('');
    
    $('.keyhelp').sfKeyHelp({
        'enter': 'Selecciona',
        'updown':'arriba/abajo',
    });
    
};

SceneLogin.prototype.handleHide = function () {
    $.log("SceneLogin.handleHide()");
};

SceneLogin.prototype.handleFocus = function () {
    $.log("SceneLogin.handleFocus()");
    
    SceneActive = "Login";
    
    t7 = new LoginKeyboardComponent($("#loginForm"));
    t8 = new VirtualKeyboardComponent($("#virtualKeyboard"));
    
    km.register(t7);
    km.register(t8);
    
    km.connect(t7, Keyboard.Connectors.LEFT, t8, Keyboard.Connectors.RIGHT);
    
    t7.resetForm();
    km.setActive(t7);
    
};

SceneLogin.prototype.handleBlur = function () {
    $.log("SceneLogin.handleBlur()");
    PrevScene = "Login";
};
