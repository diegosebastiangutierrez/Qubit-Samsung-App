ThumbsKeyboardComponent = function(element) {

    this._KeyboardComponent = Keyboard.IKeyboardComponent;
    this._KeyboardComponent();

    this.name = element.attr("id");
    this.element = element;

    this.hasFocus = false;
    this.ancho = 6;
    this.actualFocus = 1;
    this.pagina = 0;
    this.totalPaginas = 0;
    
    this.iniciado = false;
    var _this = this;

    this.keyPressed = function(keyCode) {
        
        switch(keyCode){
			case tvKey.KEY_RETURN:
				if(SceneActive == 'Detail') {
					MostrarScene('Catalog');
					km.setActive(t4);
				}else if(SceneActive == 'Catalog'){
					$(document).trigger('return');
				}
			break;
		
            case tvKey.KEY_LEFT:
                
            	//si la thumb en la q esta enfocaca es la primera de cada linea
            	//pasar al componente conectado
            	if (this.actualFocus == 1 || this.actualFocus == this.ancho+1) this.keyManager.escape(this, Keyboard.Connectors.LEFT);
            	//sino, pasar el foco a la thumb anterior
                else this.changeFocus(this.actualFocus - 1, _this);
            	
                break;
                
            case tvKey.KEY_UP:// arriba
            	this.up();
                break;
                
            case tvKey.KEY_RIGHT:
            	//si no estoy parado en la ultima peli me muevo a la q sigue
            	if(this.actualFocus < $("#thumbs > li").size()){
            		
            		this.changeFocus(this.actualFocus + 1, _this);
            		
            	}else{ //si es la ultima peli de la lista
            		//y si la pagina cargada no es la ultima
            		this.down();
            	}

            	break;
                
            case tvKey.KEY_DOWN:
            	
                this.down();
                break;
                
            case tvKey.KEY_ENTER:
            	
                clearTimeout(timeoutId);
                $(document).trigger('content_select', $("#t_" + _this.actualFocus).data("id"));
                
            break;
            case tvKey.KEY_EXIT:
                $(document).trigger('exit');
            break;
			case tvKey.KEY_INFOLINK:
			case tvKey.KEY_WLINK:
			case tvKey.KEY_CONTENT:
				$(document).trigger('return');
			break;
			case tvKey.KEY_RED:
				if(System.LoginData.LoggedUser == '') $(document).trigger('login');
			break;
			
			case tvKey.KEY_GREEN:
				if(System.LoginData.LoggedUser != '' && System.Parametros.parental_active == true ) $(document).trigger('parental');
			break;
        }
    };
 
    this.focus = function(connector) {

        this.hasFocus = true;
        $("#t_" + _this.actualFocus).addDependentStyle("focus").addDependentStyle("selected");
        
		if(System.LoginData.LoggedUser != ''){
		
			if(System.Parametros.parental_active == true){
				$('.keyhelp').sfKeyHelp({
					'user': System.LoginData.LoggedUser,
					'green':'Control Parental',
					'enter': 'Seleccionar',
					'updown': 'Arriba/Abajo',
					'leftright': 'Derecha/Izquierda',
					'exit': 'Salir'
				});			
			}else{
				$('.keyhelp').sfKeyHelp({
					'user': System.LoginData.LoggedUser,
					'enter': 'Seleccionar',
					'updown': 'Arriba/Abajo',
					'leftright': 'Derecha/Izquierda',
					'exit': 'Salir'
				});
			}

		}else{
			$('.keyhelp').sfKeyHelp({
				'red':'Iniciar Sesión',
				'enter': 'Seleccionar',
				'updown': 'Arriba/Abajo',
				'leftright': 'Derecha/Izquierda',
				'exit': 'Salir'
			});	
		}
        
        
    };

    this.init = function() {
        
        this.totalPaginas = $("#thumbs").data("paginas");
        this.pagina = $('#thumbs').data('pagina');
        
        this.iniciado = true;
        this.cargando = false;
        this.actualFocus = 1;
        if (this.hasFocus) this.focus();
        
        if ($("#t_"+this.actualFocus).data("imgL")) timeoutId = setTimeout(function() {
            $(document).trigger('thumb_focus', [ $("#t_"+this.actualFocus).data("id") ]);
            }, 1000);
        
    };

    this.blur = function(connector) {
        $("#t_" + this.actualFocus).removeDependentStyle("focus");
        this.hasFocus = false;
    };

    this.cleanFocus = function(arrow) {
        $("#t_" + this.actualFocus).removeDependentStyle("focus");
        $(arrow).addDependentStyle('hover');
    };
       
    this.up = function() {

    	if((this.actualFocus <= this.ancho) && this.pagina == 1) this.keyManager.escape(this, Keyboard.Connectors.TOP);
        else {
        	if(this.actualFocus > this.ancho) this.changeFocus(this.actualFocus - this.ancho, _this);
        	else{
        		this.cargando = true;
                $(document).trigger('ThumbsDatos' ,[$("#thumbs").data("criterio"), this.pagina-1, System.Parametros.page_size]);
        	}        	
        }
    };

    this.down = function(){
        
    	var size = $('#thumbs > li').size();
    	
    	if((this.actualFocus > this.ancho && this.actualFocus <= size) && this.pagina < this.totalPaginas){
    		
    		this.cargando = true;
            $(document).trigger('ThumbsDatos' ,[$("#thumbs").data("criterio"), this.pagina+1, System.Parametros.page_size]);
    	
    	} else if(this.actualFocus <= this.ancho && size >= this.actualFocus +this.ancho ) this.changeFocus(this.actualFocus + this.ancho, _this);
    	
    };

    this.changeFocus = function(thumb, _this) {
    
        $("#t_" + _this.actualFocus).removeDependentStyle("selected").removeDependentStyle("focus");
        
        _this.actualFocus = thumb;

        $("#t_" + _this.actualFocus).addDependentStyle("selected").addDependentStyle("focus");
        
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(function(){
            $(document).trigger('thumb_focus', [$("#t_" + _this.actualFocus).data("id")]);
        }, 1500);
            
    };
    
};
