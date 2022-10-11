(function($) {
    $.extend({
	"log" : function() {
	    if (arguments.length > 0) {

		var args = (arguments.length > 1) ? Array.prototype.join.call(
			arguments, " ") : arguments[0];

		try {
			
		    //console.log(':'+args);
			alert(':'+args);
		    return true;
		} catch (e) {

		    try {
			opera.postError(args);
			return true;
		    } catch (e) {}
		}


		alert(args);
		return false;
	    }
	}
    });
})(jQuery);