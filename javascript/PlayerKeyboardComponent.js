PlayerKeyboardComponent = function(){

    this._KeyboardComponent = Keyboard.IKeyboardComponent;
    this._KeyboardComponent();
    
	this.hasFocus = false;
	this.widevine = false;
	this.subs_xml = null;
	this.no_subs = false;
	var _this = this;

    this.init = function(){
    	
		_this.hasFocus = true;
		pluginAPI.setOffScreenSaver();
		
		if(_this.Player == null) {
			_this.Player = $.sf.plugin('PLAYER');
		} else {
			delete _this.Player;
			_this.Player = null;
			_this.Player = $.sf.plugin('PLAYER');
		}
		
		_this.element = _this.Player;
		_this.name = _this.Player.id;
	
		_this.subtitles = {};
		_this.currentSubtitle = -1;
    
		_this.advanceMil = [0, 15, 30, 60, 180, 600, 1800];
		_this.countPress = 0;
		_this.AdvanceTime = null;
		_this.widevine = Element.is_widevine;
        
        if(_this.widevine) {
        	video = Element.redir_play_url +"|DRM_URL="+Element.widevine_proxy+"|COMPONENT=WV";
        	$('#PlayerControls li#WideVine').css('display','inline-block');
        }
        else{
        	video = Element.redir_play_url;
        	$('#PlayerControls li#WideVine').css('display','none');
        }
       
        this.sub = Element.subtitles_url;
        
        if(this.sub.indexOf('.srt', this.sub.length-4, this.sub.length-1)!= -1){
        	this.subs_xml = true;
        	_this.sub = System.url.WSSubs+'?fileName='+encodeURIComponent(_this.sub)+'&callback=?';
        }
        else this.subs_xml = false;
        
        $.log(':: VIDEO: ' + video);
        $.log(':: Is_WideVine: '+_this.widevine);
        $.log(':: SUBS URL: '+this.sub+' is_xml? '+ this.subs_xml);
        
        title = Element.title+ ' - ' + Element.original_title + ' ('+ Element.year.substr(0,4) +')';

        $(".TituloMovie").html(title);
        $('#totalTime').html("");
        $('#currentTime').html("");
        $('#Subs').html('');
        
        if(System.TV.ProductType != 0){
			
			if($("#VolumeText")) {
				$("#VolumeText").remove();
				$("#volumen").remove();
			}
			
        }else{
		
			p = Audio.GetVolume();
			userMute = Audio.GetUserMute();
            systemMute = Audio.GetSystemMute();
			
            $('#volumen #indicator').css('width', p+'px');
			
			if(userMute == 1||systemMute == 1){
				$('#PlayerControls li#mute').css('display', 'inline-block');
			}
		}
		
        _this.Player.InitPlayer(video);
        _this.Player.SetPendingBuffer(4*1024*1024);
        _this.Player.OnBufferingStart = 'OnBufferingStart';
        _this.Player.OnBufferingComplete = 'OnBufferingComplete';
        _this.Player.OnCurrentPlayTime  = 'OnCurrentPlayTime';
        _this.Player.OnConnectionFailed = 'OnConnectionFailed';
        _this.Player.OnRenderError = 'OnRenderError';
        _this.Player.OnStreamNotFound = 'OnStreamNotFound';
        _this.Player.OnStreamInfoReady = 'OnStreamInfoReady';
        _this.Player.OnRenderingComplete = 'OnRenderingComplete';
        _this.Player.OnNetworkDisconnected = 'OnNetworkDisconnected';
        
        if(this.sub == ''){
        	_this.no_subs = true;
		    $('#loading').sfLoading('show');
            _this.Player.StartPlayback();
        }else{
            
            $.ajax({
            	url: this.sub,
                type: 'GET',
                dataType: 'jsonp',
                success: function(data){
                	
                    if(data != null){
						$.log(System.mess[23]);//subs cargados
						_this.SubsParse(data, _this.subtitles);
					}else _this.no_subs = true;
                    
					$('#loading').sfLoading('show');
                    _this.Player.StartPlayback();
                },
                error: function(jqXHR, textStatus, ex){
                    $.log(System.mess[24]);//no subs o ausentes
                    $.log(textStatus);
                    _this.no_subs = true;
					$('#loading').sfLoading('show');
                    _this.Player.StartPlayback();
                }
            });
        }

    };

    this.playSubs = function(time){
        currentTime=time/1000;
        var subtitle = -1;
        
        for(s in _this.subtitles) {
            if(s > currentTime) break;
            subtitle = s;
            }
        
            if(subtitle > 0) {
                if(subtitle != _this.currentSubtitle) {
                    document.getElementById("Subs").innerHTML = _this.subtitles[subtitle].t;
                    this.currentSubtitle=subtitle;
                } else if(_this.subtitles[subtitle].o < currentTime) {
                    document.getElementById("Subs").innerHTML = "";
                }
            }
    };

    this.SubsParse = function(subs, obj) {
        var srt;
        srt = subs.replace(/\r\n|\r|\n/g, '\n');
        srt = strip(srt);
        var srt_ = srt.split('\n\n');
        $.log(System.mess[21]);//parsing

        for(s in srt_) {
            st = srt_[s].split('\n');
            if(st.length >=2) {
                n = st[0];
                i = strip(st[1].split(' --> ')[0]);
                o = strip(st[1].split(' --> ')[1]);
                t = st[2];
                
                if(st.length > 2) {
                    for(var j=3; j<st.length;j++) t += '\n'+st[j];
                }
                is = toSeconds(i);
                os = toSeconds(o);
                obj[is] = {i:is, o: os, t: t};
            }
        }
        $.log(System.mess[22]);//parsed
    };

	this.setDisplayArea = function () {
		var perc = 0;
		var	newW = 0; 
		var newH = 0; 
		var newX = 0;  
		var newY = 0;
		//Original information (width, height, proportion)
		var videoHeight = 0; 
		var videoWidth = 0;
		var proportion = 0;
		
		videoHeight = _this.Player.GetVideoHeight();
		videoWidth  = _this.Player.GetVideoWidth();
		var proportion = Math.ceil( (videoWidth / videoHeight) * 100);
		
		var size = {};
		
		if (proportion < 200){ //Maximize by Height
			newH = 540;
			perc = newH/videoHeight;
			newW = Math.floor(videoWidth * perc) ;
			newX = Math.ceil((960 - newW)/2);
			size.x = newX;
			size.y = 0;
			size.w = newW;
			size.h = newH;
		} else { //Maximize by Width
			newW = 960;
			perc = newW/videoWidth;
			newH = Math.floor(videoHeight * perc) ;
			newY = Math.ceil((540 - newH)/2);
			size.x = 0;
			size.y = newY;
			size.w = newW;
			size.h = newH;
		}
		// Video width cannot be bigger then 960 nor height bigger then 540
		// Position cannot be negative
		if (size.x < 0) size.x = 0;
		if (size.y < 0) size.y = 0;
		if (size.w > 960) size.w = 960 ;
		if (size.h > 540) size.h = 540 ;
		
		_this.Player.SetDisplayArea(size.x, size.y, size.w, size.h);
		
	};

    OnStreamInfoReady = function(){
    	km.enable();
		_this.setDisplayArea();
		if(_this.no_subs) _this.setCaps();
		setTimeout('$("#Controls").toggle()', 10000);

    };

    OnBufferingStart = function(){
    	km.enable();
        $('#loading').sfLoading('show');
    };
    
    OnBufferingComplete = function(){

    	km.enable();
        $('#loading').sfLoading('hide');
        
		if(_this.widevine == true) {
            totaltime = _this.Player.GetLiveDuration();
            totaltime = toSeconds(totaltime);
            totaltime = totaltime.toString();
            totaltime = totaltime.split('.');
            totaltime = totaltime[0].toString() + totaltime[1].toString();
        }else{
            totaltime = _this.Player.GetDuration();
        }

        var h = Math.floor(totaltime/1000/60/60);
        var m = Math.floor(totaltime/1000/60%60);
        var s = Math.floor(totaltime/1000%60);
        
        $('#totalTime').html(h+':'+m+':'+s);

    };
    
    OnCurrentPlayTime = function(time){

        if(_this.widevine == false) {
            
            totaltime = _this.Player.GetDuration();
            var c = (time*100/totaltime);
            
        }else{
            
            totaltime = _this.Player.GetLiveDuration();
            totaltime = toSeconds(totaltime);
            totaltime = totaltime.toString();
            totaltime = totaltime.split('.');
            totaltime = totaltime[0].toString() + totaltime[1].toString();
            
            var c = (time*100/totaltime);
        }
        
        var h = Math.floor(time/1000/60/60);
        var m = Math.floor(time/1000/60%60);
        var s = Math.floor(time/1000%60);
        
        $('#Progress #Bar').css('width', c+'%');
        $('#currentTime').html(h+':'+m+':'+s);
        _this.playSubs(time);
    };
    
    OnConnectionFailed = function(){

    	km.enable();
        _this.Player.Stop();
        $('#loading').sfLoading('hide');
        $('#Subs').html(System.mess[25]);
    };

    OnNetworkDisconnected = function(){
    	
    	km.enable();
    	var t = System.mess[26];
		var m = System.mess[33] + System.mess[34] + System.mess[35] + System.mess[36];
		MessageShow(t, m, true);
        _this.Player.Stop();
        MostrarScene(PrevScene);
    };
    
    OnStreamNotFound = function(){
    	km.enable();
        _this.Player.Stop();
        $('#loading').sfLoading('hide');
        $('#Subs').html(System.mess[27]);//no stream
    };

    OnRenderError = function(renderErrorType){
    	km.enable();
        _this.Player.Stop();
        $('#loading').sfLoading('hide');
        $('#Subs').html(renderErrorType);
    };

    OnRenderingComplete = function(){
    	km.enable();
        _this.Player.Stop();
        MostrarScene(PrevScene);
    };
    
    this.setCaps = function(){
        if($("#PlayerControls li#captions").css('display') == 'inline-block') $("#PlayerControls li#captions").css('display', 'none');
        else $("#PlayerControls li#captions").css('display', 'inline-block');
        $('#Subs').toggle();
        $.log('Setting Caps Status');
    };
    
    this.setVol = function(v){
    	
        if(System.TV.ProductType == 0){
		
            var p = Audio.GetVolume();			
        
            if(v == 'up' && p <= 100){
				$('#PlayerControls li#mute').css('display', 'none');
                $('#volumen #indicator').css('width', p+1+'px');
				Audio.SetUserMute(0);
                Audio.SetSystemMute(0);
                Audio.SetVolumeWithKey(0);
            }
            
            if(v == 'down' && p >= 0){
                $('#PlayerControls li#mute').css('display', 'none');
				$('#volumen #indicator').css('width', p-1+'px');
				Audio.SetUserMute(0);
                Audio.SetSystemMute(0);
                Audio.SetVolumeWithKey(1);
            }
            
            if( v == 'mute'){
            
                userMute = Audio.GetUserMute();
                systemMute = Audio.GetSystemMute();

                if(userMute == 0 || systemMute == 0) {
                    Audio.SetUserMute(1);
                    Audio.SetSystemMute(1);
                    $('#PlayerControls li#mute').css('display', 'inline-block');
                
				} else {
                    Audio.SetUserMute(0);
                    Audio.SetSystemMute(0);
                    $('#PlayerControls li#mute').css('display', 'none');
                }
            }
        }
    
    };

    this.showAdvance = function(f, x){
    	
    	if(f == 1) t = "Avanzar ";
    	else t = "Retroceder ";
    	
    	if(x > 30){
    		x = x /60; rt = ' minutos';
    	}else rt = ' segundos';
    	
    	$('#ScenePlayer div#frTime').text(t + x + rt );
    	$('#ScenePlayer div#frTime').css('display', 'block');
    	    	
    	_this.AdvanceTime = setTimeout(function(){
    		$('#ScenePlayer div#frTime').text('');
    		$('#ScenePlayer div#frTime').css('display', 'none');
    	}, 2000);
    	
    };
    
    this.keyPressed = function(keyCode) {

        switch(keyCode){
            
            case tvKey.KEY_MUTE:
                this.setVol('mute');
            break;
            
            case tvKey.KEY_SUBTITLE:
            case tvKey.KEY_SUB_TITLE:
            case tvKey.KEY_CC:
                if(!_this.no_subs) this.setCaps();
            break;
			
            case tvKey.KEY_VOL_UP:
            case tvKey.KEY_PANEL_VOL_UP:
                this.setVol('up');
            break;
            
            case tvKey.KEY_VOL_DOWN:
            case tvKey.KEY_PANEL_VOL_DOWN:
                this.setVol('down');
            break;
    
            case tvKey.KEY_RETURN:
                $('#loading').sfLoading('hide');
                _this.Player.Stop();
				pluginAPI.setOnScreenSaver(10);
                MostrarScene("Detail");
            break;

			case tvKey.KEY_INFOLINK:
			case tvKey.KEY_WLINK:
			case tvKey.KEY_CONTENT:
				pluginAPI.setOnScreenSaver(10);
				$(document).trigger('return');
			break;

            case tvKey.KEY_EXIT:
                $('#loading').sfLoading('hide');
                _this.Player.Stop();
				pluginAPI.setOnScreenSaver(10);
                $(document).trigger('exit');
            break;          
        
            case tvKey.KEY_PLAY:
                _this.Player.Resume();
				pluginAPI.setOffScreenSaver();
            break;

            case tvKey.KEY_PAUSE:
                _this.Player.Pause();
				pluginAPI.setOnScreenSaver(10);
            break;

            case tvKey.KEY_STOP:
                $('#loading').sfLoading('hide');
                $('#Subs').html('');
                _this.Player.Stop();
				pluginAPI.setOnScreenSaver(10);
				MostrarScene("Detail");
            break;

            case tvKey.KEY_FF:
                var a = _this.advanceMil;
                if(_this.countPress < 6) _this.countPress++;
            	clearTimeout(_this.AdvanceTime);
                _this.showAdvance(1, a[_this.countPress]);
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function(){
                    if(_this.widevine == false) _this.Player.JumpForward(a[_this.countPress]);
                    else {
                        _this.Player.JumpForward(a[_this.countPress]);
                    }
                    $('#Subs').html('');
                    _this.countPress = 0;
                }, 1000);

            break;

            case tvKey.KEY_RW:
			
                var a = _this.advanceMil;
                if(_this.countPress < 6) _this.countPress++;
            	clearTimeout(_this.AdvanceTime);
                _this.showAdvance(0, a[_this.countPress]);
                clearTimeout(timeoutId);
                
				timeoutId = setTimeout(function(){
                
					if(_this.widevine == false) _this.Player.JumpBackward(a[_this.countPress]);
                    else {
                        _this.Player.JumpBackward(a[_this.countPress]);
                    }
                    $('#Subs').html('');
                    _this.countPress = 0;
                }, 1000);
            break;
            
            case tvKey.KEY_UP:
            case tvKey.KEY_DOWN:
            case tvKey.KEY_LEFT:
            case tvKey.KEY_RIGHT:
                $("#Controls").toggle();
            break;
            $("#Controls").show();
        }
    };

    this.focus = function(connector) {
    	km.disable();
        _this.init();
        setTimeout('$("#Controls").toggle()', 5000);
    };

    this.blur = function(connector) {
		pluginAPI.setOnScreenSaver(10);
        _this.hasFocus = false;
        _this.sub = '';
    };
};
