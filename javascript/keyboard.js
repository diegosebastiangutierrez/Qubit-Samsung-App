var UTIL = {};

var Keyboard = {};

var Component={};

var Datos = {};

var div_data = "";

var UltimaFila = 0;

var Accion= '';

Keyboard.initListener = function(refElement) {
    if (Keyboard.KbMng) {
        throw System.mess[17];//Keyb Man ya init
		alert(System.mess[17]);
    } else {
		Keyboard.KbMng = new Keyboard._KeyboardListener();
    }
};

Keyboard.KeyboardManager = function(refElement) {
    this._components = [];
    this._currentComponent = null;
    this._refElement = refElement;
    this._enabled = true;
    this._stopEvent = true;

    this.enable = function () {this._enabled = true;};
    this.disable = function () {this._enabled = false;};
    this.stopEvent = function (v) {this._stopEvent = v;};
    
    this.bind = function(element) {
    
        if (!element) element = $(document);	
        var mng = this;

        $(element).keydown(function(e) {
            e.cancelBubble = true;
            e.stopPropagation();
			if(mng._enabled){
				if(mng._stopEvent) e.preventDefault();
				var unicode = e.keyCode ? e.keyCode : e.charCode;
				if (mng._currentComponent) mng._currentComponent.keyPressed(unicode);
			}
        });
    };

    this.bind(refElement);

    this.register = function(component) {
        this._components.push(component);
        component.keyManager = this;
    };
	
	this.unregister = function(component) {//funciona cuando no hay conectores
        alert( typeof this._components);
    };

    this.connect = function(t1, c1, t2, c2) {

        if ($.inArray(t1, this._components) == -1) {
            throw "El componente " + t1.name + " no está registrado.";
        }
        if ($.inArray(t2, this._components) == -1) {
            throw "El componente " + t2.name + " no está registrado.";
        }

        if (t1.connectors[c1]) {
            var t3 = t1.connectors[c1].component;
            var c3 = t1.connectors[c1].connector;
            t3.connectors[c3] = null;
        }

        if (t2.connectors[c2]) {
            var t3 = t2.connectors[c2].component;
            var c3 = t2.connectors[c2].connector;
            t3.connectors[c3] = null;
        }

        t1.connectors[c1] = {
            component : t2,
            connector : c2
        };
        t2.connectors[c2] = {
            component : t1,
            connector : c1
        };

    };

    this.escape = function(t, c) {
        if ($.inArray(t, this._components) == -1) {
            throw "El componente " + t.name + " no está registrado.";
        }

        if (t.connectors[c]) {
            var t2 = t.connectors[c].component;
            var c2 = t.connectors[c].connector;
                    
            t.blur(c);
            t2.focus(c2);
            this._currentComponent = t2;
            return true;
        } else {
            return false;
        }
    };

    this.setActive = function(t) {
        if ($.inArray(t, this._components) == -1) {
            throw "El componente " + t1.name + " no está registrado.";
        }

        if (this._currentComponent) {
            this._currentComponent.blur(null);
        }
        t.focus(null);
        this._currentComponent = t;
    };
};
 
Keyboard.IKeyboardComponent = function() {
    this.connectors = [];
    this.keyManager = {};
    this.keyPressed = function(keyCode) {
        throw System.mess[18];//metodo no imp
    };
    this.focus = function(connector) {
        throw System.mess[18];//metodo no imp
    };
    this.blur = function(connector) {
        throw System.mess[18];//metodo no imp
    };
    this.name = "[undefined]";
};

Keyboard.Connectors = {
    TOP : 0,
    RIGHT : 1,
    BOTTOM : 2,
    LEFT : 3,
    TOP2 : 4,
    BOTTOM2 : 5,
    TOP3 :6,
    BOTTOM3 : 7
};
