HeaderKeyboardComponent = function(element){
    // Implementa la interfaz Keyboard.IKeyboarComponent 
    this._KeyboardComponent = Keyboard.IKeyboardComponent;
    this._KeyboardComponent();

    this.name = element.attr("id");
    this.element = element;
    
    this.escapeBottom = Keyboard.Connectors.BOTTOM;
    this.iniciado = false;
	this.selected = ".exit";
	var self = this;

    this.setFocusOnParental = function(){
        $(this.selected).removeDependentStyle("selected");
        $(this.selected).removeDependentStyle("focus");
 
        this.selected = ".parental";
		
        $(this.selected).addDependentStyle("selected");     
        $(this.selected).addDependentStyle("focus");        
    };

    this.setFocusOnLogin = function(){
        $(this.selected).removeDependentStyle("selected");      
        $(this.selected).removeDependentStyle("focus");
 
        this.selected = ".login";
		
        $(this.selected).addDependentStyle("selected");     
        $(this.selected).addDependentStyle("focus");        
    };
    
    this.setFocusOnExit = function(){
        $(this.selected).removeDependentStyle("selected");      
        $(this.selected).removeDependentStyle("focus");
        
		this.selected = ".exit";

        $(this.selected).addDependentStyle("selected");
        $(this.selected).addDependentStyle("focus");
    };
	
    this.keyPressed = function(keyCode) {
		
		p = hayParental();
		l = hayLogin();
		
		switch(keyCode){
			
			case tvKey.KEY_RED:
				if(System.LoginData.LoggedUser == '') $(document).trigger('login');
			break;
			
			case tvKey.KEY_GREEN:
				if(System.LoginData.LoggedUser != '' && System.Parametros.parental_active == true ) $(document).trigger('parental');
			break;
			
			case tvKey.KEY_LEFT:

				if (this.selected == ".parental"){
					this.keyManager.escape(this, Keyboard.Connectors.LEFT);
				}
				else if (this.selected == ".login"){
					if(p) this.setFocusOnParental();
					else this.keyManager.escape(this, Keyboard.Connectors.LEFT);
				}
				else if (this.selected == ".exit"){
					if(l) this.setFocusOnLogin();
					else if(!l && p) this.setFocusOnParental();
					else this.keyManager.escape(this, Keyboard.Connectors.LEFT);
				}
			break;

			case tvKey.KEY_RIGHT:
				if (this.selected == ".exit"){
					this.keyManager.escape(this, Keyboard.Connectors.RIGHT);
				}else if (this.selected == ".parental"){
						if(hayLogin()) this.setFocusOnLogin();
						else this.setFocusOnExit();
				}else if (this.selected == ".login"){
						this.setFocusOnExit();
				}
			break;
			case tvKey.KEY_UP:
				this.keyManager.escape(this, Keyboard.Connectors.TOP);
			break;
			case tvKey.KEY_DOWN:
				this.keyManager.escape(this, this.escapeBottom);
			break;
			case tvKey.KEY_ENTER:
				if (this.selected == ".login"){
					$(document).trigger('login');
				}
				if (this.selected == ".exit"){
					$(document).trigger('exit');
				}
			   if (this.selected == ".parental"){
					$(document).trigger('parental');
				}
			break;
			case tvKey.KEY_EXIT:
				$(document).trigger('exit');
			break;
			case tvKey.KEY_RETURN:
				if(SceneActive == 'Detail') {
					MostrarScene('Catalog');
					km.setActive(t4);
				}else if(SceneActive == 'Catalog'){
					$(document).trigger('return');
				}
			break;
			
			case tvKey.KEY_INFOLINK:
			case tvKey.KEY_WLINK:
			case tvKey.KEY_CONTENT:
				$(document).trigger('return');
			break;
		}

    };

    this.focus = function(connector) {
    
        this.hasFocus = true;
		this.selected = '.exit';
		
        $(this.selected).addDependentStyle("selected");
        $(this.selected).addDependentStyle("focus");

        this.escapeBottom = connector;
		
        if(System.LoginData.LoggedUser != '' && System.Parametros.parental_active == true){
            
            $('.keyhelp').sfKeyHelp({
                'user': System.LoginData.LoggedUser,
                'green': 'Control Parental',
                'enter': 'Seleccionar',
                'leftright': 'Izquierda/Derecha',
                'exit': 'Salir'
            });             
            
        }else if(System.LoginData.LoggedUser != '' && System.Parametros.parental_active == false){
            
            $('.keyhelp').sfKeyHelp({
                'user': System.LoginData.LoggedUser,
                'enter': 'Seleccionar',
                'leftright': 'Izquierda/Derecha',
                'exit': 'Salir'
            });     
        }else if(System.LoginData.LoggedUser == ''){
            
            $('.keyhelp').sfKeyHelp({
                'red':'Iniciar Sesión',
                'enter': 'Seleccionar',
                'leftright': 'Izquierda/Derecha',
                'exit': 'Salir'
            });
                        
        }

    };

    this.blur = function(connector) {
        this.hasFocus = false;
        $(this.selected).removeDependentStyle("focus");
        $(this.selected).removeDependentStyle("selected");
    };
    
    $(".login").mouseover(function(e){
        if(!self.hasFocus){
            self.keyManager.setActive(self);
            self.escapeBottom = Keyboard.Connectors.BOTTOM2;
        }
        self.setFocusOnLogin();
    });
    
    $(".exit").mouseover(function(e){
        if(!self.hasFocus){
            self.keyManager.setActive(self);
            self.escapeBottom = Keyboard.Connectors.BOTTOM2;
        }
        self.setFocusOnExit();
    });
	
    $(".parental").mouseover(function(e){
        if(!self.hasFocus){
            self.keyManager.setActive(self);
            self.escapeBottom = Keyboard.Connectors.BOTTOM2;
        }
        self.setFocusOnParental();
    });

};
