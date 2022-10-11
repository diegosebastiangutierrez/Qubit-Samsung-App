ErrorKeyboardComponent = function(element){
    // Implementa la interfaz Keyboard.IKeyboarComponent
    this._KeyboardComponent = Keyboard.IKeyboardComponent;
    this._KeyboardComponent();

    this.name = element.attr("id");
    this.element = element;
    
    this.hasFocus = false;
    
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
        if(keyCode == tvKey.KEY_RETURN){
            $(document).trigger('return');
        }
        if(keyCode == tvKey.KEY_EXIT){
            $(document).trigger('exit');
        }
		if(keyCode == tvKey.KEY_INFOLINK || keyCode == tvKey.KEY_WLINK || keyCode == tvKey.KEY_CONTENT){
			$(document).trigger('return');
		}
    };

    this.focus = function(connector) {
	
		$("#ErrorBody h1").html(System.mess[12]);
		$("#ErrorBody p").html(System.mess[26]);
		
		$(document).trigger('checkNetwork');
		
         this.hasFocus = true;
		 
        //$(element).css("background-color", "green");
    };

    this.blur = function(connector) {
        
		$("#ErrorBody h1").html("");
		$("#ErrorBody p").html("");
        this.hasFocus = false;
        //$(element).css("background-color", "white");
    };
};
