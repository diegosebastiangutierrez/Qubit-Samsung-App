LoginKeyboardComponent = function(element){
    // Implementa la interfaz Keyboard.IKeyboarComponent
    this._KeyboardComponent = Keyboard.IKeyboardComponent;
    this._KeyboardComponent();

    this.name = element.attr("id");
    this.element = element;
	
    if(SceneActive == 'Login')
        this.elementIds = [ "userNameInput", "passwordInput", "submitForm", "cancelForm"];
    if(SceneActive == 'Confirm')
        this.elementIds = [ "userNameInputConf", "passwordInputConf", "submitFormConf", "cancelFormConf"];
    
    this.pos = 0;
    this.hasFocus = false;
	this.Started = false;

    var _self = this;

    this.showMessage = function(message){
        if(SceneActive == 'Login'){
            $('#Error').html("");
            $('#Error').html(message);
        }
        else if(SceneActive == 'Confirm'){
            $('#ErrorConf').html("");
            $('#ErrorConf').html(message);
        }
    };

	this.start = function(){
		_self.hasFocus = true;
		_self.showMessage('');
		if(_self.Started == false ) {
			_self.Started = true;
			_self.move();
		}
	};

    this.Login = function(){
        
        var user = trim($("#" + this.elementIds[0]).val());
        var password = trim($("#" + this.elementIds[1]).val());
        
        if(SceneActive == 'Login'){
        
            if (user!="" && password!= "") 
            	var logged = WSLogin(user, password, _self);
            else 
            	this.showMessage(System.mess[10]);
        
        }else if(SceneActive == 'Confirm'){
        
            if (user!="" && password!= "") var logged = WSCheckParental(System.LoginData.session_id, password, _self);
            else this.showMessage(System.mess[11]);
        
        }

    };

    this.resetForm = function(){
        
        if(SceneActive == 'Login') id = 'loginForm';
        if(SceneActive == 'Confirm') id = 'confirmForm';
        
        ht = $('#'+id).html();
		$('#'+id).html('');
        $('#'+id).html(ht);
		_self.pos = 0;
    };

    this.loginFail = function(errorText, thrown){
        this.showMessage(System.mess[12] +errorText+'.\n '+thrown);
    };

    this.parentalFail = function(errorText, thrown){
        this.showMessage(System.mess[12]+errorText+'.\n '+thrown);
    };

    this.loginSuccess = function(data){

        if(data.autorized){
            
            System.LoginData.authorized = data.autorized;
            System.LoginData.session_id = data.session_id;
            System.LoginData.autologin_hash = data.autologin_hash;
            System.LoginData.LoggedUser = trim($("#" + this.elementIds[0]).val());
            System.LoginData.LoggedPassword = trim($("#" + this.elementIds[1]).val());

			data='LoggedUser="'+System.LoginData.LoggedUser+'";LoggedPassword="'+System.LoginData.LoggedPassword+'";';
			FS('save', data );
            
			$(document).trigger('WSGAnalytics', System.Parametros.GoogleAnalytics.BaseURL+'Login/'+System.LoginData.LoggedUser+'/Success');
            
            this.showMessage(System.mess[13]);
            this.resetForm();
			
            if(PrevScene == "Detail") {
                $(document).trigger('content_select', [Element.id, true]);
                $(document).trigger('ThumbsDatos', [$('#thumbs').data('criterio')]);
            }
            if(PrevScene == "Catalog") {
                $(document).trigger('ThumbsDatos', [$('#thumbs').data('criterio')]);
                _self.timeoutId = setTimeout("MostrarScene(PrevScene)", 2000);
            }
            else _self.timeoutId = setTimeout("MostrarScene(PrevScene)",2000);
            
        }else{
			this.showMessage(System.mess[14]);
			$(document).trigger('WSGAnalytics', System.Parametros.GoogleAnalytics.BaseURL+'Login/'+trim($("#" + this.elementIds[0]).val())+'/Error');
		}
    };

    this.parentalSuccess = function(data){
    	
        if(data.autorized == true){
            System.Parametros.parental_active = false;
            this.showMessage(System.mess[15]);//desh cont par
            this.resetForm();

			$(document).trigger('WSGAnalytics', System.Parametros.GoogleAnalytics.BaseURL+'ControlParental/'+System.LoginData.LoggedUser+'/Disabled');
            
            if(PrevScene == "Detail"){
                $(document).trigger('ThumbsDatos', [$('#thumbs').data('criterio')]);
                _self.timeoutId = setTimeout("CargaElement(Element.id)", 1000);
            }
            if(PrevScene == "Catalog") {
                $(document).trigger('ThumbsDatos', [$('#thumbs').data('criterio')]);
                _self.timeoutId = setTimeout("MostrarScene(PrevScene)", 2000);
            }
            else _self.timeoutId = setTimeout("MostrarScene(PrevScene)",2000);
            
        }else{
			this.showMessage(System.mess[16]);
			$(document).trigger('WSGAnalytics', System.Parametros.GoogleAnalytics.BaseURL+'ControlParental/'+System.LoginData.LoggedUser+'Error');
		}
    };

    this.move = function(){
		
        if(this.pos >= 0 && this.pos <=3 ){
            $("#"+this.elementIds[this.pos]).focus();
            
        } else this.pos = -1;
    };

    this.keyPressed = function(keyCode) {
    
        if(keyCode == tvKey.KEY_UP) {
            this.pos--;
            this.move();
        }
        
        if(keyCode == tvKey.KEY_DOWN){
            this.pos++;
            this.move();
        }
		
		if(keyCode == tvKey.KEY_LEFT) {
            this.pos--;
            this.move();
        }
        
        if(keyCode == tvKey.KEY_RIGHT){
            this.pos++;
            this.move();
        }

        if(keyCode == tvKey.KEY_RETURN) {
            this.resetForm();
            MostrarScene(PrevScene);
        }
        if(keyCode == tvKey.KEY_ENTER){
        
            if(this.pos == 0 || this.pos == 1) {
                this.keyManager.escape(this, Keyboard.Connectors.LEFT);
                this.blur();
            }
            else if(this.pos == 2) this.Login();
            else if(this.pos == 3) {
                this.resetForm();
                MostrarScene(PrevScene);
            }
        }
        if(keyCode == tvKey.KEY_EXIT){
            $(document).trigger('exit');
        }
		
		if(keyCode == tvKey.KEY_INFOLINK || keyCode == tvKey.KEY_WLINK || keyCode == tvKey.KEY_CONTENT){
			$(document).trigger('return');
		}
        
        if(keyCode == tvKey.KEY_BLUE){
            this.Login();
        }
        if(keyCode == tvKey.KEY_RED){
            this.resetForm();
            MostrarScene(PrevScene);            
        }
    };

    this.focus = function() {
        
		_self.start();
        
        if(System.LoginData.LoggedUser != ''){
            $('.keyhelp').sfKeyHelp({
                'user': System.LoginData.LoggedUser,
                'blue':'Ingresar',
                'red':'Cancelar',
                'enter': 'Seleccionar',
                'updown': 'Arriba/Abajo',
                'return': 'Volver', 
                'exit': 'Salir'
            }); 
        }else{
            $('.keyhelp').sfKeyHelp({
                'blue':'Ingresar',
                'red':'Cancelar',
                'enter': 'Seleccionar',
                'updown': 'Arriba/Abajo',
                'return': 'Volver', 
                'exit': 'Salir'
            });
        }
    
    };

    this.blur = function(connector) {
        currentInput = this.elementIds[this.pos];
        $("#"+this.currentInput).blur();
        _self.hasFocus = false;
    };

};