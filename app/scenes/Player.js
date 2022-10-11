function ScenePlayer(options) {
    this.options = options;
}

ScenePlayer.prototype.initialize = function () {
    $.log("ScenePlayer.initialize()");

};

ScenePlayer.prototype.handleShow = function () {
    $.log("ScenePlayer.handleShow()");
};

ScenePlayer.prototype.handleHide = function () {
    $.log("ScenePlayer.handleHide()");
};

ScenePlayer.prototype.handleFocus = function () {
    $.log("ScenePlayer.handleFocus()");
    
    SceneActive = "Player";
    
    tPlayer = new PlayerKeyboardComponent();
    km.register(tPlayer);
    km.setActive(tPlayer);

    $(document).trigger('WSGAnalytics', System.Parametros.GoogleAnalytics.BaseURL+'Play/'+Element.title);
    
};

ScenePlayer.prototype.handleBlur = function () {
    $.log("ScenePlayer.handleBlur()");
    PrevScene = "Player";
    
    $("#Subs").html('');
    $('#Progress #Bar').css('width', '0%');
    $('#currentTime').html('');
    $('#totalTime').html('');
	
};
