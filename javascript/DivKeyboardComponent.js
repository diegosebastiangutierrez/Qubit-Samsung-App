DivKeyboardComponent = function(element){
    // Implementa la interfaz Keyboard.IKeyboarComponent
    this._KeyboardComponent = Keyboard.IKeyboardComponent;
    this._KeyboardComponent();

    this.name = element.attr("id");
    this.element = element;
    
    this.keyPressed = function(keyCode) {
        if(keyCode == tvKey.KEY_LEFT){
            this.keyManager.escape(this, Keyboard.Connectors.LEFT);
        }
        if(keyCode == tvKey.KEY_UP){
            this.keyManager.escape(this, Keyboard.Connectors.TOP);
        }
        if(keyCode == tvKey.KEY_RIGHT){
            this.keyManager.escape(this, Keyboard.Connectors.RIGHT);
        }
        if(keyCode == tvKey.KEY_DOWN){
            this.keyManager.escape(this, Keyboard.Connectors.BOTTOM);
        }
		if(keyCode == tvKey.KEY_EXIT){
			$(document).trigger('exit');
		}
		if(keyCode == tvKey.KEY_RETURN){
			if(PrevScene == '') $(document).trigger('return');
			else MostrarScene(PrevScene);
		}
		if(keyCode == tvKey.KEY_INFOLINK || keyCode == tvKey.KEY_WLINK || keyCode == tvKey.KEY_CONTENT){
			$(document).trigger('return');
		}
    };

    this.focus = function(connector) {
        //$(element).css("background-color", "green");
    };

    this.blur = function(connector) {
        //$(element).css("background-color", "white");
    };
};