var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var pluginAPI = new Common.API.Plugin();

var NetworkPlugin =  document.getElementById('pluginObjectNetwork');
var nnaviPlugin = document.getElementById('pluginObjectNNavi');
var TVPlugin = document.getElementById('pluginObjectTV');
var Audio = document.getElementById('pluginObjectAudio');

var is_instancia = 0;
var SceneCargada = false;
var PrevScene = false;
var SceneActive = false;
var ActualCategory = 'Recomendados';

var currentInput;
var timeoutId;

var Element = {};

var km = {};
km = new Keyboard.KeyboardManager();

var t1 = {};
var t2 = {};
var t3 = {};
var t4 = {};
var t5 = {};
var t6 = {};
var t7 = {};
var t8 = {};
var tPlayer = {};
var tError = {};
var tConfirm = {};
var tTeclado = {};
var tConfirmForm = {};

var System = {};

System.url = {};
System.Network = {};
System.Audio = {};
System.TV = {};
System.Parametros = {};
System.Parametros.GoogleAnalytics = {};
System.LoginData = {};

System.LoginData.LoggedUser = '';
System.mess = [];

System.Parametros.preferred_language="en";
System.Parametros.preferred_subtitles="es";
System.Parametros.user_parental_rated = '4';//4 = 18 down etc....
System.Parametros.parental_active = true;
System.Parametros.page_size_thumbs = 6;
System.Parametros.page_size = 12;
System.Parametros.page = 1;
System.Parametros.device = 'SAMSUNG_TV';
System.Parametros.MAC = NetworkPlugin.GetHWaddr();
System.Parametros.device_id = nnaviPlugin.GetDUID(System.Parametros.MAC);

System.Parametros.MenuMax = 10;
System.Parametros.FilaActivaMax = 2;
System.Parametros.Cargando = false;
System.Parametros.WorkingENV = 'prod';

System.Parametros.GoogleAnalytics.Account = 'MO-29639807-1';
System.Parametros.GoogleAnalytics.Domain = 'www.qubit.tv';
System.Parametros.GoogleAnalytics.BaseURL = '/samsung/';

if(System.Parametros.WorkingENV == 'prod'){

	System.url.WSDatosMenu = "http://www.qubit.tv/business.php/json/search?jsonCallback=?";
	System.url.WSDatosThumbs = "http://www.qubit.tv/business.php/json/menus?jsonCallback=?";
	System.url.WSDatosDetalle = "http://www.qubit.tv/business.php/json/Element?jsonCallback=?";
	System.url.WSLoginUrl = "http://secure.qubit.tv/json/login?jsonCallback=?";
	System.url.WSBuyUrl = "http://www.qubit.tv/business.php/json/buy?jsonCallback=?";
	System.url.WSPlayUrl = "http://www.qubit.tv/business.php/json/play?jsonCallback=?"; 
	System.url.WSCheckParentalUrl = 'http://secure.qubit.tv/json/qubit/passChecking?jsonCallback=?';
	System.url.WVProxyURL = "http://wv.qubit.tv/widevine/cypherpc/cgi-bin/GetEMMs.cgi";
	System.url.WSSubs = 'http://www.qubit.tv/getFile.php';
	System.url.WSGAnalyticsURL = System.url.WSSubs+"?GA_GET=true&callback=?";
	System.url.AnalyticsServer = 'http://www.qubit.tv/';

}else if(System.Parametros.WorkingENV == 'preprod'){

	System.url.WSDatosMenu = "http://qubitv4.preprod.qubit.tv/business.php/json/search?jsonCallback=?";
	System.url.WSDatosThumbs = "http://qubitv4.preprod.qubit.tv/business.php/json/menus?jsonCallback=?";
	System.url.WSDatosDetalle = "http://qubitv4.preprod.qubit.tv/business.php/json/Element?jsonCallback=?";
	System.url.WSLoginUrl = "http://securev4.preprod.qubit.tv/json/login?jsonCallback=?";
	System.url.WSBuyUrl = "http://qubitv4.preprod.qubit.tv/business.php/json/buy?jsonCallback=?";
	System.url.WSPlayUrl = "http://qubitv4.preprod.qubit.tv/business.php/json/play?jsonCallback=?"; 
	System.url.WSCheckParentalUrl = 'http://securev4.preprod.qubit.tv/json/qubit/passChecking?jsonCallback=?';
	System.url.WVProxyURL = "http://wv.preprod.qubit.tv/widevine/cypherpc/cgi-bin/GetEMMs.cgi";
	System.url.WSSubs = 'http://qubitv4.preprod.qubit.tv/getFile.php';
	System.url.WSGAnalyticsURL = System.url.WSSubs+"?GA_GET=true&callback=?";
	System.url.AnalyticsServer = 'http://qubitv4.preprod.qubit.tv/';

}else if(System.Parametros.WorkingENV == 'devel'){

	System.url.WSDatosMenu = "http://fbtest.qubit.tv/business.php/json/search?jsonCallback=?";
	System.url.WSDatosThumbs = "http://fbtest.qubit.tv/business.php/json/menus?jsonCallback=?";
	System.url.WSDatosDetalle = "http://fbtest.qubit.tv/business.php/json/Element?jsonCallback=?";
	System.url.WSLoginUrl = "http://securefbtest.qubit.tv/json/login?jsonCallback=?";
	System.url.WSBuyUrl = "	http://fbtest.qubit.tv/business.php/json/buy?jsonCallback=?";
	System.url.WSPlayUrl = "http://fbtest.qubit.tv/business.php/json/play?jsonCallback=?";
	System.url.WSCheckParentalUrl = "http://securefbtest.qubit.tv/json/qubit/passChecking?jsonCallback=?";
	System.url.WVProxyURL = "http://wv.preprod.qubit.tv/widevine/cypherpc/cgi-bin/GetEMMs.cgi";
	System.url.WSSubs = "http://fbtest.qubit.tv/getFile.php";
	System.url.AnalyticsServer = 'http://qubitv4.preprod.qubit.tv/';

}

System.Audio.OutputDevice = Audio.GetOutputDevice();
System.Audio.MuteSystem = Audio.GetSystemMute();
System.Audio.MuteUser = Audio.GetUserMute();
System.Audio.Volume = Audio.GetVolume();
System.Audio.ActiveSourceCEC = Audio.IsActiveSourceOnCEC();
System.Audio.ExternalPCM = Audio.CheckExternalOutMode(0);
System.Audio.ExternalDolby = Audio.CheckExternalOutMode(1);
System.Audio.ExternalDTS = Audio.CheckExternalOutMode(2);

System.TV.ProductType = TVPlugin.GetProductType();

System.Network.ActiveNetworkType = NetworkPlugin.GetActiveType();
System.Network.PhysicalConnection = NetworkPlugin.CheckPhysicalConnection(System.Network.ActiveNetworkType);
System.Network.HTTPStatus = NetworkPlugin.CheckHTTP(System.Network.ActiveNetworkType);

System.mess = [
    'Verificando Conexiones de Red:',
    ' ...WIRELESS<br/>',
    ' ...CABLEADA<br/>',
    ' ...NO HAY CONEXION ACTIVA<br/>',
    'Verificando tipo de Producto: ',
    ' ...TV<br/>',
    ' ...MONITOR</br>',
    ' ...BLUERAY<br/>',
    'Presione <b>EXIT</b> para salir, RETURN para reintentar...',
    'OK!',
    'Ingrese usuario y password.',
    'Ingrese su password.',
    'Ha ocurrido un error:\n',
    'Has iniciado sesión en Qubit.tv!',
    'Usuario o Contraseña Incorrectos.',
    'Deshabilitaste el Control Parental!',
    'Contraseña Incorrecta.',
	'El Keyboard manager ya fue inicializado.',
	'Método no implementado.',
	'El menú no incluye una lista con opciones.',
	'El menú no incluye una lista de género con opciones.',
	'Parseando Subtítulos...',
	'Subtitulos parseados.',
	'Subtitulos Cargados.',
	'No se pueden cargar los subtitulos o subtítulos ausentes.',
	'Falló la conexión.',
	'Se ha desconectado de la red.',
	'No se pudo encontrar el Stream.',
	'No cargó el jsonp.',
	'Ud. no puede reproducir este contenido.',
	'Error al contactar el Servicio de Compra: ',
	'Error al intentar Reproducir: ',
	'Error al tratar de obtener los Subtitulos.',
	' - Espere que se restablezca la conexión.<br/>',
	' - Verifique que el cable esté conectado.<br/>',
	' - Reinicie su Modem/Router.<br/>',
	' - Presione Salir.'
    ];

var LoggedUser = '';
var LoggedPassword = '';

function onStart () {
    dat = FS('read');
    eval(dat);
	$(document).trigger('checkNetwork');
    MostrarScene('Loader');
	
}

function onDestroy () {
    
    System = null;
    km = null;
    tTeclado = null;
    tPlayer = null;
    tConfirmForm = null;
	tError = null;
    t1 = null;
    t2 = null;
    t3 = null;
    t4 = null;
    t5 = null;
    t6 = null;
    t7 = null;
    t8 = null;
    
    delete widgetAPI;
    delete tvKey;
    delete pluginAPI;
    delete SceneActive;
    delete SceneCargada;
    delete PrevScene;
    
    delete NetworkPlugin;
    delete Audio;
    delete nnaviPlugin;
    delete TVPlugin;
    
    delete System;
    delete t1;
    delete t2;
    delete t3;
    delete t4;
    delete t5;
    delete t6;
    delete t7;
    delete t8;
    delete tTeclado;
    delete tConfirmForm;
    delete tConfirm;
	delete tError;
    
    delete km;
    delete is_instancia;
    delete Element;
    delete currentInput;
}