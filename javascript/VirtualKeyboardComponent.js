VirtualKeyboardComponent = function(element){

    this._KeyboardComponent = Keyboard.IKeyboardComponent;
    this._KeyboardComponent();

	this.name = element.attr("id");
    this.element = element;
	var self = this;
	
	this.pos = 2;
	this.col = 10;
	this.hasFocus = false;
	
	var w = $("#"+this.name).children().length;
	
    this.keyPressed = function(keyCode) {
	
		switch (keyCode){
			
			case tvKey.KEY_EXIT:
				$(document).trigger('exit');
			break;
			
			case tvKey.KEY_RETURN:
				MostrarScene(PrevScene);
			break;
			case tvKey.KEY_INFOLINK:
			case tvKey.KEY_WLINK:
			case tvKey.KEY_CONTENT:
				$(document).trigger('return');
			break;
			case tvKey.KEY_LEFT:
				if(this.pos > 2 ) this.pos--;
				this.activeLi(this.pos);
			break;
		 
			case tvKey.KEY_UP:
				if(this.pos > this.col ) this.pos-=this.col;
				this.activeLi(this.pos);
				
			break;
		  
			case tvKey.KEY_RIGHT: 
				if(this.pos < w ) this.pos++;
				this.activeLi(this.pos);
			break;
			
			case tvKey.KEY_DOWN:
				if(this.pos <= w - this.col ) this.pos+=this.col;
				this.activeLi(this.pos);
			break;
			
			case tvKey.KEY_ENTER:
			
				var activeButton = $("#"+this.name+" li:nth-child("+this.pos+")").html();
				
				if(activeButton == "CONFIRMAR") this.keyManager.escape(this, Keyboard.Connectors.RIGHT);
			
				else if(activeButton == "borrar" && !$("#"+currentInput).attr('disabled')){
			
					$("#"+currentInput).val($("#"+currentInput).val().slice(0, -1));
					this.updatePText('');

				}else if(activeButton == "MAY") {
				
					for(i = 0; i < w; i++){
					
						var n = "#"+this.name+" li:nth-child("+i+")";
					
						if($(n).hasClass('caps')) {
							if($(n).hasClass('uCase')) {
								$(n).removeClass('uCase').html($(n).html().toLowerCase()).addClass('lCase');
							}else if($(n).hasClass('lCase')){
								$(n).removeClass('lCase').html($(n).html().toUpperCase()).addClass('uCase');
							}
						}
					}
				
				}else {
			
					if(!$("#"+currentInput).attr('disabled')) {
					
						if(SceneActive == 'Login') {

							if($("#"+currentInput).attr('type') == 'text') $("#"+currentInput).val($("#"+currentInput).val() + activeButton);
							if($("#"+currentInput).attr('type') == 'password') $("#"+currentInput).val($("#"+currentInput).val() + activeButton);
							
						}else if(SceneActive == 'Confirm') $("#"+currentInput).val($("#"+currentInput).val() + activeButton);
						
						this.updatePText(activeButton);
					}
				
			}
		break;
		}
		
	};

	this.updatePText = function(v){
		
		if(SceneActive == 'Login') previewId = "virtualKeyboardInput";
		else if(SceneActive == 'Confirm') previewId = "virtualKeyboardConfirmInput";
		
		$('#'+previewId).html('');//limpio valor del previewtext
		
		if($("#"+currentInput).attr('type') == 'text') $('#'+previewId).html($("#"+currentInput).val());
		else if($("#"+currentInput).attr('type') == 'password') {
			val = '';
			ln = $("#"+currentInput).val().length;
			
			for(i=0;i<ln;i++){
				val+='*';
			}
			val+=v;
			$('#'+previewId).html(val);
		}
	
	};

	this.focus = function(connector) {
	
		this.hasFocus = true;
		$(element).css("display", "block");
		this.pos = 63;//62 es el enter
		this.activeLi(this.pos);
		
		if(SceneActive == 'Login'){
			if($("#"+currentInput).attr('type') == 'text') $('#virtualKeyboardInput').val($("#"+currentInput).val());
			else $('#virtualKeyboardInput').val('');
			
		}else if(SceneActive == 'Confirm'){
			if(!$("#"+currentInput).attr('disabled')) $('#virtualKeyboardConfirmInput').val('');
		}
		
		if(System.LoginData.LoggedUser != ''){
			$('.keyhelp').sfKeyHelp({
				'user': System.LoginData.LoggedUser,
				'enter': 'Selecciona',
				'updown':'Arriba/Abajo',
				'leftright':'Derecha/Izquierda',
				'exit':'Salir'
			});
		
		}else{
			$('.keyhelp').sfKeyHelp({
				'enter': 'Selecciona',
				'updown':'Arriba/Abajo',
				'leftright':'Derecha/Izquierda',
				'exit':'Salir'
			});
		
		}
		
	};

    this.blur = function(connector) {
        $(element).css("display", "none");
		if(SceneActive == 'Login') $('#virtualKeyboardInput').html('');
		else $('#virtualKeyboardConfirmInput').html('');
		this.hasFocus = false;
    };
	
	this.activeLi = function(i){
		var li="#"+this.name+" li:nth-child("+i+")";
		var aLi="#"+this.name+" li";
		$(aLi).removeClass("activo");
		$(li).addClass("activo");
		$(li).focus();
	};
	
};