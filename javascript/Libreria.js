function FS(accion, data) {
	
	//$.log(':: [FS] StartUp');
	var fileSystemObj = new FileSystem();
	var filePath = curWidget.id + '/AppData.dat';
	var fileContent = null;
	
	var bValid = fileSystemObj.isValidCommonPath(curWidget.id);
	if (!bValid) {
		//$.log(':: [FS] Se crea Dir: ' + curWidget.id);
		fileSystemObj.createCommonDir(curWidget.id);
		//$.log(':: [FS] Se crea el archivo');
		fileObj = fileSystemObj.openCommonFile(filePath, 'w');
		fileObj.writeAll('');
		fileSystemObj.closeCommonFile(fileObj);
		
	}

	var action = typeof accion == 'undefined' ? 'read' : accion;
	switch (action) {
	case 'save':
		file = fileSystemObj.openCommonFile(filePath, 'w');
		line = data;
		file.writeAll(line);
		fileSystemObj.closeCommonFile(file);
		return 1;
		break;
	case 'read':
		file = fileSystemObj.openCommonFile(filePath, 'r');
		fileContent = file.readAll();
		fileSystemObj.closeCommonFile(file);
		if(fileContent != null && fileContent != '') return fileContent;
		else return 0;		
	
	break;

	}
}

function checkStatuses() {

	var timer = new Number(0);
	var width = new Number(0);

	var interval = setInterval(function() {

		var log = $('#LoaderLog');
		timer++;
		width += 10;
		$('#LoaderBar').css('width', width + 'px');

		switch (timer) {

		case 20:
			break;

		case 80:

			if (System.Network.ActiveNetworkType == -1) {
				log.html(System.mess[0] + System.mess[3]);// No hay red
				clearInterval(interval);
			}
			break;
		case 128:
			clearInterval(interval);
			setTimeout(function() {
				MostrarScene('Catalog');
				delete timer;
				delete width;
				delete log;

			}, 1500);

			break;
		}

	}, 10);

}

function checkControls() {
	hayLogin();
	hayParental();
}

function hayLogin() {
	var exists;
	if ($('body').find(".login").size() > 0) {
		if (System.LoginData.authorized && System.LoginData.session_id) {
			$(".login").remove();
			exists = false;
		} else
			exists = true;
	} else
		exists = false;

	return exists;
}

function hayParental() {
	var exists;

	if ($('body').find(".parental").size() > 0) {
		if (System.LoginData.authorized && System.LoginData.session_id) {
			if (System.Parametros.parental_active == false) {
				$(".parental").remove();
				exists = false;
			} else if (System.Parametros.parental_active == true) {
				exists = true;
			}
		} else {
			if ($(".parental").css('display') == 'none')
				exists = false;
			else
				exists = false;
		}
	} else
		exists = false;

	return exists;
}

function MessageShow(title, message, keyb) {

	var title = typeof title !== 'undefined' ? title : 'Error:';
	var message = typeof message !== 'undefined' ? message : 'Se ha producido un error.';

	$("#ErrorBody h1").html(title);
	$("#ErrorBody p").html(message);
	$("#ErrorBody").show('slow');
	if (keyb) km.disable();
}

function MessageHide(keyb) {
	$("#ErrorBody").hide('fast');
	$("#ErrorBody h1").html('');
	$("#ErrorBody p").html('');
	if (keyb) km.enable();
}

function MenuCargar() {
	
	var Content = {};

	if (System.LoginData.authorized && System.LoginData.session_id) {

		Content.content = '{'
			+ ' "session_id":"' + System.LoginData.session_id + '",'
			+ ' "operator": "qubit",'
			+ ' "preferred_language":"es",'
			+ ' "device":"' + System.Parametros.device + '"'
			+ '}';

	} else {

		Content.content = '{'
			+ ' "preferred_language":"es",'
			+ ' "operator": "qubit",' + ' "device":"'+ System.Parametros.device + '"'+ '}';

	}

	var div_data = [];
	var fullMenuOptions = {};

	$.ajax({
		url : System.url.WSDatosThumbs,
		type : "POST",
		data : Content,
		dataType : 'jsonp',
		beforeSend : function() {
			$('#loading').sfLoading('show');
		},
		
		success : function(data) {
			//$.log('MenuCargar');
			$.each(data.response, function(i, data) {

				fullMenuOptions[i] = new Array(data.text, data.criteria.named_criteria, 0);
				if (data.childrenCount != "0") {
					$.each(data.children, function(j, data1) {
						fullMenuOptions[i + j] = new Array(data1.text, data1.criteria.named_criteria, 0);
					});
				}
			});

			MenuDibujar(fullMenuOptions, true);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			$.log(':: MenuCargar Error: '+textStatus);
			$.log(System.mess[28]);// "No cargo el jsonp"
		}
	});
}

function MenuDibujar(ObjDatos, seguir, div) {

	var seguir = typeof seguir !== 'undefined' ? seguir : false;
	var div = typeof div !== 'undefined' ? div : '#VerticalMenu';
	
	var div_data = '';
	var datos_listado = [];
	var datosItemMenu = [];

	$.each(ObjDatos, function(i, data) {
		if (i < System.Parametros.MenuMax)
			div_data += '<div class="botones menu_option empty" id="criteria_'+ i + '">' + data[0] + '</div>' + "\n";
		datos_listado[i] = data[0];
		datosItemMenu[i] = [ data[0], data[1], 0 ]; // El 3° elemento es para los hijos

	});

	$(div + " .panel").html("");
	$(div + " .panel").append(div_data);

	$(div).data("menuOptions", datos_listado);
	$(div).data("fullMenuOptions", datosItemMenu);

	if (seguir) $(document).trigger('ThumbsDatos', [ ObjDatos[0][1] ]);

};

function DibujarPage(salida) {

	var div_data = '';
	var thumb = 0;

	$.each(salida, function(i, data) {

		thumb+= 1;
		div_data += '<li id="t_' + thumb + '" class="thumb">';
		div_data += '   <div class="titulomovie">' + data.title + '</div>';
		div_data += '   <img class="image" src="' + data.thumbnail.small + '"/>';

		if (data.status_user) div_data += '   <div class="estado ' + data.status_user	+ '"></div>';
		else div_data += '   <div class="estado ' + data.status + '"></div>';
		
		div_data += "</li>\n";

	});
	
	$('#thumbs').html('');
	$('#thumbs').html(div_data);
	
	var thumb = 0;

	$.each(salida, function(i, data) {
		
			thumb++;
			var id = '#thumbs #t_'+thumb;
			
			$(id).data("imgM", data.thumbnail.small);
			$(id).data("imgL", data.thumbnail.hd);
			$(id).data("titulo", data.title);
			$(id).data("id", data.id);
	});
	
	Instanciar();

};

function Instanciar() {

	if (is_instancia == 0) {

		t3 = new MenuKeyboardComponent($("#VerticalMenu"));
		t4 = new ThumbsKeyboardComponent($("#thumbs"));

		km.register(t3);
		km.register(t4);

		km.connect(t4, Keyboard.Connectors.LEFT, t3, Keyboard.Connectors.RIGHT);

		t4.init();
		km.setActive(t4);
		is_instancia = 1;
	} else if (is_instancia == 1) {
		t4.init();
	}
};

function DetalleDibujar(data) {

	data_director = '';
	data_stars = '';

	if (data.response.information)
		$.each(data.response.information, function(i, data) {

			if (data.field_name == 'Director')
				data_director = data_director + data.value + ", ";
			if (data.field_name == 'Artista')
				data_stars = data_stars + data.value + ", ";

		});

	data_generos = '';
	if (data.response.genre)
		$.each(data.response.genre, function(i, data) {
			data_generos = data_generos + data + ", ";

		});
	$('#loading').sfLoading('hide');
}

function MostrarScene(show) {

	$.sfScene.hide(SceneActive);
	$.sfScene.show(show);
	$.sfScene.focus(show);

}

function CargaElement(id, follow) {

	follow = typeof follow == 'undefined' ? false : true;
	var Content = {};
	Content.content = '{'
		+ '"device": "' + System.Parametros.device + '",'
		+ '"element_id": "' + id + '",' + '"operator": "qubit",'
		+ '"session_id": "' + System.LoginData.session_id + '"'
		+ '}';

	var div_data = "";
	var data_director = "";
	var data_actores = "";
	var data_generos = "";
	
	$.ajax({
		url : System.url.WSDatosDetalle,
		type : "POST",
		data : Content,
		contentType : 'application/json',
		dataType : 'jsonp',
		beforeSend : function() {
			$('#loading').sfLoading('show');
		},
		success : function(data) {
			Element = data.response;
			if (follow == true)
				setTimeout(function() {
					MostrarScene("Detail");
				}, 2000);
		},
		error : function(objeto, quepaso, otroobj) {
			$.log(":: CargaElement Error: "+ quepaso);
		}
	});
}

function dibujarElement() {

	$('#loading').sfLoading('show');

	$("#Element_thumb").attr("alt", Element.title).attr("src", '');
	$("#Element_thumb").attr("alt", Element.title).attr("src", Element.thumbnail.hd);
	$("#Element_title").html(Element.title);
	$("#Element_original_title").html(Element.original_title);
	$("#Element_duration").html(Element.duration);
	$("#Element_description").html(Element.short_description);
	$("#Element_country").html(Element.country);
	$("#Element_classification").removeClass("atp").removeClass("plus13").removeClass("plus16").removeClass("plus18").removeClass("xxx");
	switch (Element.classification) {
	case 'ATP':
		$("#Element_classification").addClass("atp");
		break;
	case '13':
		$("#Element_classification").addClass("plus13");
		break;
	case '16':
		$("#Element_classification").addClass("plus16");
		break;
	case '18':
		$("#Element_classification").addClass("plus18");
		break;
	case 'xxx':
		$("#Element_classification").addClass("xxx");
		break;
	}

	data_stars = '';
	data_director = '';

	$.each(Element.information, function(i, data) {
		if (data.field_name == 'Director')
			data_director += data.value + ", ";
		if (data.field_name == 'Artista')
			data_stars += data.value + ", ";
	});
	$("#Element_director").html(data_director.slice(0, -2));
	$("#Element_estrellas").html(data_stars.slice(0, -2));

	data_generos = '';
	$.each(Element.genre, function(i, data) {
		data_generos += data + ", ";
	});
	$("#Element_generos").html(data_generos.slice(0, -2));
	$("#Element_year").html(Element.year.substr(0, 4));
	$("#Element_country").html(Element.countries);
	$('#loading').sfLoading('hide');

}

function drawConfirmData() {

	$("#Confirm_title").html(Element.title);
	$("#ConfirmElement_thumb").attr("alt", Element.title).attr("src", Element.thumbnail.hd);

	if (Element.Quality_for_buy == "sd")
		$("#Confirm_Price").html("$ " + Element.price_sd);
	else if (Element.Quality_for_buy == "hd")
		$("#Confirm_Price").html("$ " + Element.price_hd);

}

function WSLogin(User, Pass, component) {

	var Content = {};
	Content.content = '{' + ' "username":"' + User + '",' + ' "password":"'
			+ Pass + '",' + ' "device_type":"' + System.Parametros.device
			+ '",' + ' "operator":"qubit",' + ' "device_id":"'
			+ System.Parametros.device_id + '"' + '}';
	$.ajax({
		url : System.url.WSLoginUrl,
		type : "POST",
		data : Content,
		contentType : 'application/json',
		dataType : 'jsonp',
		beforeSend : function() {
			$('#loading').sfLoading('show');
		},
		success : function(data) {
			$('#loading').sfLoading('hide');
			component.loginSuccess(data.response);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			$('#loading').sfLoading('hide');
			component.loginFail(textStatus, errorThrown);
		}

	});
}

function WSCheckParental(User, Pass, component) {

	var Content = {};
	Content.content = '{' + ' "operator":"qubit",' + ' "password":"' + Pass
			+ '",' + ' "session_id":"' + User + '"' + '}';
	$.ajax({
		url : System.url.WSCheckParentalUrl,
		type : "POST",
		data : Content,
		contentType : 'application/json',
		dataType : 'jsonp',
		beforeSend : function() {
			$('#loading').sfLoading('show');
		},
		success : function(data) {
			$('#loading').sfLoading('hide');
			component.parentalSuccess(data.response);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			$('#loading').sfLoading('hide');
			component.parentalFail(textStatus, errorThrown);
		}

	});
}

function WSDetalle(id) {
	if (id) {
		var Content = {};

		Content.content = '{' + '"device": "' + System.Parametros.device + '",'
				+ '"element_id": "' + id + '",' + '"operator":"qubit",'
				+ '"session_id": "' + System.LoginData.session_id + '"' + '}';

		var div_data = "";

		$.ajax({
			url : System.url.WSDatosDetalle,
			type : "POST",
			data : Content,
			contentType : 'application/json',
			dataType : 'jsonp',
			success : function(data) {
				DetalleDibujar(data);
			},
			error : function(objeto, quepaso, otroobj) {
				$.log(":: WSDetalle Error: "+ quepaso);
			}
		});

	}
}

function WSBuy(quality, component) {

	var Content = {};
	Content.content = '{' + ' "element_id": "' + Element.id + '",'
			+ ' "quality": "' + quality + '",' + ' "mode": "PPV",'
			+ ' "operator":"qubit",' + ' "session_id": "'
			+ System.LoginData.session_id + '", ' + ' "device": "'
			+ System.Parametros.device + '"' + '}';

	$.ajax({
		url : System.url.WSBuyUrl,
		type : "POST",
		data : Content,
		contentType : 'application/json',
		dataType : 'jsonp',
		beforeSend : function() {
			$('#loading').sfLoading('show');
		},
		success : function(data) {
			$('#loading').sfLoading('hide');
			if (data.response.result_condition == "Successful") {
				$.log(":: Compra Satisfactoria");
				CargaElement(Element.id);
				WSPlay(quality);
				//$(document).trigger('WSGAnalytics',	System.Parametros.GoogleAnalytics.BaseURL + 'Catalog/' + Element.title + '/Buy/'+ quality + '/Success');
			} else {
				if (component) component.showMessage(System.mess[29]);
				else $.log(":: Error al Efectuar la compra" + System.mess[29]);
				//$(document).trigger('WSGAnalytics',	System.Parametros.GoogleAnalytics.BaseURL + 'Catalog/' + Element.title + '/Buy/'+ quality + '/Error');
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			$('#loading').sfLoading('hide');

			if (component) component.showMessage(System.mess[30] + textStatus);// error al contactar servicio
			else $.log(":: WSBuy ERROR: " + System.mess[30] + textStatus);
			$(document).trigger('WSGAnalytics',	System.Parametros.AnalyticsBaseURL + 'Catalog/'	+ Element.title + '/Buy/' + quality	+ '/Error');
		}

	});

}

function WSPlay(quality) {

	var Content = {};
	Content.content = '{' 
		+ ' "content_id": "' + Element.id + '",'
		+ ' "quality": "' + quality + '",'
		+ ' "device_type": "'+ System.Parametros.device + '",'
		//+ ' "language": "'+ System.Parametros.preferred_language + '",'
		+ ' "subtitles": "'+ System.Parametros.preferred_subtitles + '",'
		+ ' "session_id": "'+ System.LoginData.session_id + '", '
		+ ' "operator":"qubit"' 
		+ '}';

	$.ajax({
		url : System.url.WSPlayUrl,
		type : "POST",
		data : Content,
		contentType : 'application/json',
		dataType : 'jsonp',
		beforeSend : function() {
			$('#loading').sfLoading('show');
		},
		success : function(data) {
			
			Element.descriptor = data.response.descriptor;
			
			if(data.response.is_widevine){
				Element.is_widevine = true;
				Element.redir_play_url = data.response.url_widevine;			
				if (data.response.widevine_proxy) Element.widevine_proxy = data.response.widevine_proxy;
				else Element.widevine_proxy = System.url.WVProxyURL;
			}else {
				Element.is_widevine = false;
				Element.redir_play_url = data.response.direct_url;
			}

			$.log("URL QUE TRAE EL WS DE PLAY " + data.response.url_subs);
			
			if(data.response.url_subs != 'undefined' && data.response.url_subs !='') {
				Element.subtitles_url = data.response.url_subs;
				MostrarScene('Player');
			}else{
				Element.subtitles_url = '';
				XMLParsePlay();
			}
			
			$.log(":: WSPLAY REDIR: " + Element.redir_play_url);
			$.log(":: WSSUBS URL: " + Element.subtitles_url);
			$.log(":: WIDEVINE: " + Element.is_widevine);
			
			$(document).trigger('WSGAnalytics',	System.Parametros.GoogleAnalytics.BaseURL + 'Catalog/' + Element.title + '/' + quality + '/Buy/Play/Success');
		},
		error : function(jqXHR, textStatus, errorThrown) {
			$.log(':: WSPLAY ERROR: '+ System.mess[31] + textStatus);
			$(document).trigger('WSGAnalytics', System.Parametros.GoogleAnalytics.BaseURL + 'Catalog/' + Element.title + '/'+ quality + '/Buy/Play/Error');
		}

	});

}

function XMLParsePlay() {	
	$.ajax({
				url : System.url.WSSubs + '?fileName='+ encodeURIComponent(Element.descriptor)+ '&callback=?',
				type : "GET",
				contentType : 'application/json',
				dataType : 'jsonp',
				beforeSend : function() {
					$('#loading').sfLoading('show');
				},
				success : function(data) {
					$('#loading').sfLoading('hide');
					if (data.search("q:subtitle") != -1) {
						parser = new DOMParser();
						xml = parser.parseFromString(data, "text/xml");
						Element.subtitles_url = xml.getElementsByTagName("q:subtitle")[0].getAttribute("url");
					} else {
						Element.subtitles_url = '';
					}
					MostrarScene('Player');
				},
				error : function(jqXHR, textStatus, errorThrown) {
					$('#loading').sfLoading('hide');
					$.log(":: XMLPARSEPLAY SUB ERROR: " + System.mess[32] + textStatus);
					MostrarScene('Player');
				}

			});

}

function serialize(obj) {

	var returnVal;

	if (obj != undefined) {
		switch (obj.constructor) {
		case Array:
			var vArr = "[";
			for ( var i = 0; i < obj.length; i++) {
				if (i > 0)
					vArr += ",";
				vArr += serialize(obj[i]);
			}
			vArr += "]";
			return vArr;
		case String:
			returnVal = escape("'" + obj + "'");
			return returnVal;
		case Number:
			returnVal = isFinite(obj) ? obj.toString() : null;
			return returnVal;
		case Date:
			returnVal = "#" + obj + "#";
			return returnVal;
		default:
			if (typeof obj == "object") {
				var vobj = [];
				for (attr in obj) {
					if (typeof obj[attr] != "function") {
						vobj.push('"' + attr + '":' + serialize(obj[attr]));
					}
				}
				if (vobj.length > 0)
					return "{" + vobj.join(",") + "}";
				else
					return "{}";
			} else
				return obj.toString();
		}
	}
	return null;
}

function strip_tags(input, allowed) {
	allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
	var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
	return input.replace(commentsAndPhpTags, '').replace(
			tags,
			function($0, $1) {
				return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0
						: '';
			});
}

function in_array(needle, haystack) {
	var length = haystack.length;
	for ( var i = 0; i < length; i++) {
		if (haystack[i] == needle)
			return true;
	}
	return false;
}

function var_dump(object) {
	var u = '';
	u = '<ul>';
	for (var property in object) {
		u += '<li>'+property+' : '+object[property]+'</li>';
	}
	u +='</ul>';
	alert(u);
}

function dumpProps(obj, parent) {

	for ( var i in obj) {
		if (parent) {
			var msg = parent + "." + i + "\n" + obj[i];
		} else {
			var msg = i + "\n" + obj[i];
		}
		if (typeof obj[i] == "object") {
			if (parent) {
				dumpProps(obj[i], parent + "." + i);
			} else {
				dumpProps(obj[i], i);
			}
		}
	}
}

function addslashes(str) {
	str = str.replace(/\\/g, '\\\\');
	str = str.replace(/\'/g, '\\\'');
	str = str.replace(/\"/g, '\\"');
	str = str.replace(/\0/g, '\\0');
	return str;
}

function stripslashes(str) {
	str = str.replace(/\\'/g, '\'');
	str = str.replace(/\\"/g, '"');
	str = str.replace(/\\0/g, '\0');
	str = str.replace(/\\\\/g, '\\');
	return str;
}

function is_array(input) {
	return typeof (input) == 'object' && (input instanceof Array);
}

function trim(value) {
	value = value.replace(/^\s*|\s*$/g, "");
	return value;
}

function toSeconds(t) {
	var s = 0.0;
	if (t) {
		var p = t.split(':');
		for (i = 0; i < p.length; i++) s = s * 60 + parseFloat(p[i].replace(',', '.'));
	}
	return s;
}

function strip(s) {
	return s.replace(/^\s+|\s+$/g, "");
}

$(document).bind('menu_select',	function(e, texto, pos, accion) {

	accion = typeof accion == 'undefined' ? '' : accion;

	var acciones = [ 'loginSD', 'loginHD', 'playSD', 'playHD', 'buySD','buyHD', 'back'];

	if (texto == "más populares")
		texto = "Populares";
	else if (texto == "recién llegadas")
		texto = "Gratis";
	else if (texto == "sugerencias")
		texto = "Recomendadas";
	else if (texto == acciones[6]) {
		MostrarScene("Catalog");
		km.setActive(t4);
		return;
	} else if (texto == acciones[0] || texto == acciones[1]) {
		MostrarScene("Login");
		return;
	} else if (texto == acciones[4] || texto == acciones[5]) {
		if (texto == acciones[5]) {
			var Quality = "hd";
			var precio = Element.price_hd;
		} else if (texto == acciones[4]) {
			var Quality = "sd";
			var precio = Element.price_sd;
		}

		if (precio == '0.00')
			WSBuy(Quality);
		else {
			if(Element.puede_comprar){
				Element.Quality_for_buy = Quality;
				MostrarScene("ConfirmBuy");
				$(document).trigger('WSGAnalytics', System.Parametros.GoogleAnalytics.BaseURL+ 'Catalog/Detail/' + Element.title	+ '/Buy/' + Quality);	
			}else{
				$('#CannotBuy').show();
				var t = setTimeout(function(){
					$('#CannotBuy').hide();
				}, 5000);
			}
			return;
		}

	} else if (texto == acciones[2] || texto == acciones[3]) {

		if (texto == acciones[2])
			var Quality = "sd";
		else if (texto == acciones[3])
			var Quality = "hd";

		WSPlay(Quality);
		$(document).trigger('WSGAnalytics', System.Parametros.GoogleAnalytics.BaseURL+ 'Catalog/Detail/' + Element.title + '/Play/' + Quality);
		return;
	}

	$(this.element).addClass("categoriaActiva");

	if (texto != "" && !in_array(texto, acciones)) {
		$(document).trigger('ThumbsDatos', [ texto ]);
        ActualCategory = t3.optionsmenu[pos][0];	
		$(document).trigger('WSGAnalytics',	System.Parametros.GoogleAnalytics.BaseURL + 'Catalog/'+ texto);
	}
});

$(document).bind('ThumbsDatos',
function(e, NameCriteria, page, cantidadDeThumb) {

	NameCriteria = typeof NameCriteria !== 'undefined' ? NameCriteria : '';
	page = typeof page !== 'undefined' ? page : System.Parametros.page;
	cantidadDeThumb = typeof cantidadDeThumb !== 'undefined' ? cantidadDeThumb: System.Parametros.page_size;

	var Content = {};
	var seguir = false;

	if (System.LoginData.LoggedUser) {
		Content.content = '{' + '"preferred_language": "es", '
				+ '"session_id":"'
				+ System.LoginData.session_id + '", '
				+ '"page": "' + page + '", ' + '"page_size": "'
				+ cantidadDeThumb + '", ' + '"device": "'
				+ System.Parametros.device + '", '
				+ '"operator": "qubit",'
				+ '"criteria": { "named_criteria":"'
				+ NameCriteria + '", "restrictions":[] }' + '}';
	} else {
		Content.content = '{' + '"preferred_language": "es", '
				+ '"page": "' + page + '", ' + '"page_size": "'
				+ cantidadDeThumb + '", ' + '"device": "'
				+ System.Parametros.device + '", '
				+ '"operator": "qubit", '
				+ '"criteria": { "named_criteria":"'
				+ NameCriteria + '", "restrictions":[] }' + '}';
	}

	var div_data = "";

	$.ajax({
		url : System.url.WSDatosMenu,
		type : "POST",
		data : Content,
		contentType : 'application/json',
		dataType : 'jsonp',
		beforeSend : function() {
			$('#loading').sfLoading('show');
		},
		success : function(data) {
			$('#loading').sfLoading('hide');
			
			$('#thumbs').data('elements', data.response.groups[0].count);
			$('#thumbs').data('pagina', data.response.groups[0].page);
			$('#thumbs').data('paginas', data.response.groups[0].total_pages);
			$('#thumbs').data('criterio', NameCriteria);
			
			$('#CatalogPager #Category').html(ActualCategory);
			$('#CatalogPager #Page').html('Página '+page+' de '+data.response.groups[0].total_pages);

			DibujarPage(data.response.groups[0].element);
			
			t4.cargando = false;
			System.Parametros.Cargando = false;
		},
		error : function(objeto, quepaso, otroobj) {
			$('#loading').sfLoading('hide');
			$.log(":: THUMBSDATOS ERROR: " + quepaso);
		}
	});
});

$(document).bind('checkNetwork',function(){

	var chkNet = setInterval(function() {
		
		if(SceneActive != 'Player'){
			
			var BeforeNetworkStatus = System.Network.PhysicalConnection;
			System.Network.ActiveNetworkType = NetworkPlugin.GetActiveType();
			System.Network.PhysicalConnection = NetworkPlugin.CheckPhysicalConnection(System.Network.ActiveNetworkType);
			System.Network.HTTPStatus = NetworkPlugin.CheckHTTP(System.Network.ActiveNetworkType);

			if (!System.Network.PhysicalConnection) {

				var t = System.mess[26];
				var m = System.mess[33] + System.mess[34] + System.mess[35] + System.mess[36];
				MessageShow(t, m, true);
				$('#loading').sfLoading('show');

			}
			if (System.Network.PhysicalConnection && BeforeNetworkStatus == 0) {
				MessageHide(true);
				$('#loading').sfLoading('hide');
			}
			
		}
		
	}, 2000);
	
});

$(document).bind('WSGAnalytics', function(evento, path) {

	var Content = {};
	URLtoGA = path;

	$.ajax({
	url : System.url.WSGAnalyticsURL
			+ '&GA_DOMAIN='
			+ encodeURIComponent(System.Parametros.GoogleAnalytics.Domain)
			+ '&GA_PATH='
			+ encodeURIComponent(URLtoGA)
			+ '&GA_ACCOUNT='
			+ System.Parametros.GoogleAnalytics.Account,
	type : "GET",
	data : Content,
	contentType : 'application/text',
	dataType : 'text',
	success : function(data) {
		var AS = System.url.AnalyticsServer + data;
		$('#AnalyticsPic').attr('src', AS);
	},
	error : function(jqXHR, textStatus, errorThrown) {
		$.log(":: GA: ERROR: " + errorThrown + ": "+ textStatus);
	}
	});
});

$(document).bind('thumb_focus', function(e, uuid) {
	WSDetalle(uuid);
});

$(document).bind('content_select', function(e, id) {
	CargaElement(id, true);
});

$(document).bind('login', function(e, destino) {
	MostrarScene("Login");
});

$(document).bind('exit', function(e) {
	widgetAPI.sendExitEvent();
});

$(document).bind('return', function(e) {
	widgetAPI.sendReturnEvent();
});

$(document).bind('parental', function(e) {
	MostrarScene("Confirm");
});
