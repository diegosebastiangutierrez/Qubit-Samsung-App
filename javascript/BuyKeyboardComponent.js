BuyKeyboardComponent = function(element){
    // Implementa la interfaz Keyboard.IKeyboarComponent
    this._KeyboardComponent = Keyboard.IKeyboardComponent;
    this._KeyboardComponent();

    this.name = element.attr("id");
    this.element = element;
    this.elementIds = [ "ConfirmBuy", "CancelBuy"];
    
    this.pos = 0;
    this.hasFocus = false;
	this.Started = false;
    var _self = this;
        
    this.showMessage = function(message){
            $('#ErrorBuy').html("");
            $('#ErrorBuy').html(message);
    };

	this.start = function(){
		_self.hasFocus = true;
		_self.showMessage('');
		if(_self.Started ==false ) {
			_self.Started = true;
			_self.move();
		}
	};

    this.confirmBuy = function(){
        WSBuy(Element.Quality_for_buy, _self);
    };
    
    this.cancelBuy = function(){
        this.resetForm();
        MostrarScene(PrevScene);
    };

    this.resetForm = function(){
    };

    this.move = function(){
        if(this.pos >= 0 && this.pos <=1 ){
        
            $("#"+this.elementIds[this.pos]).focus();
            
        } else this.pos = 0;
    };

    this.keyPressed = function(keyCode) {
    
        if(keyCode == tvKey.KEY_LEFT) {
            this.pos--;
            this.move();
        }
        
        if(keyCode == tvKey.KEY_RIGHT){
            this.pos++;
            this.move();
        }

        if(keyCode == tvKey.KEY_RETURN) {
            MostrarScene("Detail");
        }
        if(keyCode == tvKey.KEY_BLUE){
            this.confirmBuy();
        }
        if(keyCode == tvKey.KEY_RED){
            this.cancelBuy();
        }
        if(keyCode == tvKey.KEY_ENTER){
        
            if(this.pos == 0) this.confirmBuy();
            else if(this.pos == 1) this.cancelBuy();
        }
        if(keyCode == tvKey.KEY_EXIT){
            $(document).trigger('exit');
        }
		
		if(keyCode == tvKey.KEY_INFOLINK || keyCode == tvKey.KEY_WLINK || keyCode == tvKey.KEY_CONTENT){
			$(document).trigger('return');
		}
    };

    this.focus = function(connector) {
		
		_self.start();
        _self.showMessage('');
		
        $('.keyhelp').sfKeyHelp({
            'user': System.LoginData.LoggedUser,
            'enter': 'Seleccionar',
			'blue':'Alquilar',
			'red': 'Cancelar',
            'leftright': 'Derecha/Izquierda',
            'return': 'Volver a Detalle', 
            'exit': 'Salir'
        });
    
    };

    this.blur = function(connector) {
        currentInput = this.elementIds[this.pos];
        $("#"+this.currentInput).blur();
        this.hasFocus = false;
    };
   
};
