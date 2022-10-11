MenuKeyboardComponent = function(element) {

    this.hasFocus = false;

    this._KeyboarComponent = Keyboard.IKeyboardComponent;
    this._KeyboarComponent();

    this.name = element.attr("id");
    this.element = element;

    var self = this;
    
    this.backOption = this.element.children(".menu_back");
    this.menuUp = this.element.children(".menu_up");
    this.menuDown = this.element.children(".menu_down");
    this.buttons = element.find(".menu_option");

    if(!(this.options = element.data("menuOptions"))) {
        throw System.mess[19];//no ha lista con opciones
    }
    if(!(this.optionsmenu = element.data("fullMenuOptions"))) {
        throw System.mess[20];//sin lista de genero con opciones
    }
    
    this.pos = 0;
    this.wndTop = 0;
    this.wndBottom = this.buttons.size();
    this.cursor = 0;
	this.selectedCat = null;

    this.keyPressed = function(keyCode) {
		
		switch (keyCode) {		
		case tvKey.KEY_RED:
			if(System.LoginData.LoggedUser == '') $(document).trigger('login');
        break;
		
		case tvKey.KEY_GREEN:
			if(System.LoginData.LoggedUser != '' && System.Parametros.parental_active == true ) $(document).trigger('parental');
		break;
        case tvKey.KEY_UP:
            this.moveUp();
            break;
        case tvKey.KEY_DOWN:
            this.moveDown();
            break;
        case tvKey.KEY_LEFT:
            this.keyManager.escape(this, Keyboard.Connectors.LEFT);
            break;
        case tvKey.KEY_RIGHT:
            this.keyManager.escape(this, Keyboard.Connectors.RIGHT);
            break;
        case tvKey.KEY_ENTER:
            if (this.pos >= 0) {            	
                $(document).trigger('menu_select',[ this.optionsmenu[this.pos][1], this.pos ]);
				this.selectedCat = this.pos;
				$(document).find('.categoriaActiva').removeClass("categoriaActiva");
				j = this.selectedCat - this.wndTop;
				n = "#criteria_"+j;
				$(n).addClass("categoriaActiva");
				
            } else {
                $(document).trigger('menu_select', [ 'back', -1 ]);
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
       
       $(this.element).addDependentStyle("focus");
        this.hasFocus = true;
       
        if(System.LoginData.LoggedUser != '' && System.Parametros.parental_active == true){
		
			if(SceneActive == 'Detail'){
				$('.keyhelp').sfKeyHelp({
					'user': System.LoginData.LoggedUser,
					'green': 'Control Parental',
					'enter': 'Seleccionar',
					'updown': 'Arriba/Abajo',
					'return': 'Catálogo',
					'exit': 'Salir'
				});
			}else{
				$('.keyhelp').sfKeyHelp({
					'user': System.LoginData.LoggedUser,
					'green': 'Control Parental',
					'enter': 'Seleccionar',
					'updown': 'Arriba/Abajo',
					'exit': 'Salir'
				});
			}
            
        }else if(System.LoginData.LoggedUser != '' && System.Parametros.parental_active == false){
			if(SceneActive == 'Detail'){
				$('.keyhelp').sfKeyHelp({
					'user': System.LoginData.LoggedUser,
					'enter': 'Seleccionar',
					'updown': 'Arriba/Abajo',
					'return': 'Catálogo',
					'exit': 'Salir'
				});
			}else{
				$('.keyhelp').sfKeyHelp({
					'user': System.LoginData.LoggedUser,
					'enter': 'Seleccionar',
					'updown': 'Arriba/Abajo',
					'exit': 'Salir'
				});
			}		
		}else if(System.LoginData.LoggedUser == ''){
			if(SceneActive == 'Detail'){
				$('.keyhelp').sfKeyHelp({
					'red':'Iniciar Sesión',
					'enter': 'Seleccionar',
					'updown': 'Arriba/Abajo',
					'return': 'Catálogo',
					'exit': 'Salir'
				});
			}else {
				$('.keyhelp').sfKeyHelp({
				    'red':'Iniciar Sesión',
					'enter': 'Seleccionar',
					'updown': 'Arriba/Abajo',
					'exit': 'Salir'
				});
			}
        }
        
    };

    this.blur = function(connector) {
        $(this.element).removeDependentStyle("focus");
        this.hasFocus = false;
    };

    this.moveUp = function() {
        if (this.pos > 0) {
            if (this.cursor > 0) {
                this.pos--;
                this.cursor--;
            } else {
                this.pos--;
                this.wndTop--;
                this.wndBottom--;
            }
            this.refresh(self.wndTop);
        } else if (this.pos == 0 && this.backOption.size() > 0) {
            this.pos = -1;
            this.cursor = -1;
            this.refresh(this.wndTop);
        } else this.keyManager.escape(this, Keyboard.Connectors.TOP);

    };

    this.moveDown = function() {
        if (this.pos == -1 && this.backOption.size() > 0) {
            this.pos = self.wndTop;
            this.cursor = 0;
            this.refresh(self.wndTop);
        } else if (this.pos < this.options.length - 1) {
            if (this.cursor < this.buttons.size() - 1) {
                this.pos++;
                this.cursor++;
            } else {
                this.pos++;
                this.wndTop++;
                this.wndBottom++;
            }
            this.refresh(this.wndTop);
        } else this.keyManager.escape(this, Keyboard.Connectors.BOTTOM);
    };

    this.lastWnd = -2;
    
    this.refresh = function(offset) {

        var repaint = this.lastWnd != this.wndTop;
        this.lastWnd = this.wndTop;

		$(document).find('.categoriaActiva').removeClass("categoriaActiva");
		if(this.selectedCat >= this.wndTop && this.selectedCat <= this.wndBottom){
			j = this.selectedCat - this.wndTop;
			n = "#criteria_"+j;
			$(n).addClass("categoriaActiva");
		}

        if (this.backOption.size() > 0) {
            if (this.pos == -1) {
                $(this.backOption).addDependentStyle("selected");
            } else {
                $(this.backOption).removeDependentStyle("selected");
            }
        }

        for ( var i = 0; i < this.buttons.size(); i++) {
            var pos = offset + i;
            $(self.buttons[i]).removeDependentStyle("selected");
            if (pos < self.options.length) {
                if (repaint) {
                    $(self.buttons[i]).removeClass("empty");
                    $(self.buttons[i]).html(self.options[pos]);
                }
                if (i == self.cursor) {
                    $(self.buttons[i]).addDependentStyle("selected");
                }
                $(self.buttons[i]).data("pos", pos);
                $(self.buttons[i]).data("cursor", i);
            } else {
                if (repaint) {
                    $(self.buttons[i]).addClass("empty");
                    $(self.buttons[i]).text("");
                }
            }
        }
    };
	
    this.refresh(0);
};
