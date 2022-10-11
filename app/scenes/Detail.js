function SceneDetail(options) {
    this.options = options;
}

SceneDetail.prototype.initialize = function () {
    $.log("SceneDetail.initialize()");
};

SceneDetail.prototype.handleShow = function () {
    $.log("SceneDetail.handleShow()");
};

SceneDetail.prototype.handleHide = function () {
    $.log("SceneDetail.handleHide()");
};

SceneDetail.prototype.handleFocus = function () {
    
    $.log("SceneDetail.handleFocus()");
    
    SceneActive = "Detail";
    
    var fullMenu = new Array();
    
    if(System.LoginData.authorized && System.LoginData.session_id){
        
        fullMenu[0] = [];
        
        if( Element.paid_sd) {
            
            fullMenu[0][0] = "DVD (VER)";
            fullMenu[0][1] = "playSD";
            
        }else if(!Element.paid_sd && Element.price_sd == '0.00'){
        
            fullMenu[0][0] = "DVD (GRATIS)";
            fullMenu[0][1] = "buySD";//compra
        
        }else if(!Element.paid_sd && Element.price_sd != '0.00'){
            fullMenu[0][0] = "DVD ($ "+Element.price_sd+")";
            fullMenu[0][1] = "buySD";//compra y play
        }
        
        if(Element.available_in_hd) {

            fullMenu[1] = [];

            if(Element.paid_hd) {
                fullMenu[1][0] = "HD (VER)";
                fullMenu[1][1] = "playHD";
            }else if(!Element.paid_hd && Element.price_hd == '0.00'){
                fullMenu[1][0] = "HD (VER)";
                fullMenu[1][1] = "buyHD";//compra y play
            } else if(!Element.paid_hd && Element.price_hd != '0.00'){
                fullMenu[1][0] = "HD ($ "+Element.price_hd+")";
                fullMenu[1][1] = "buyHD";//compra
            }

        }
        
    }else{
        fullMenu[0] = [];
        fullMenu[0][0] = "DVD";
        fullMenu[0][1] = "loginSD";

        if(Element.available_in_hd){
            fullMenu[1] = [];
            fullMenu[1][0] = "HD";
            fullMenu[1][1] = "loginHD";
        }

    }
    
	if(fullMenu[1]) $('.reprod').css('display', 'block');
	else $('.reprod').css('display', 'none');
	
	$('#CannotBuy').hide();
	
    MenuDibujar( fullMenu, false, "#Menu2");
    dibujarElement();
	
    t6 = new MenuKeyboardComponent($("#Menu2"));
    km.register(t6);  
    km.setActive(t6);
    
    $(document).trigger('WSGAnalytics', System.Parametros.GoogleAnalytics.BaseURL+'Catalog/Detail/'+Element.title);
};

SceneDetail.prototype.handleBlur = function () {
    $.log("SceneDetail.handleBlur()");
	$("#Element_thumb").attr("alt", "").attr("src", "");
    PrevScene = "Detail";	
    // this function will be called when the scene manager move focus to another scene from this scene
};
