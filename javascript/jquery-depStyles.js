/**	Name: Demo2
 *  Autor: GArdoino
 */

(function( $ ){


  $.fn.addDependentStyle = function( styleName ) {  

      var fstClass = this.attr("class").split(" ",2)[0];
      return this.addClass(fstClass+"-"+styleName);
  };
  
  $.fn.removeDependentStyle = function( styleName ) {  
      var fstClass = this.attr("class").split(" ",2)[0];
      return this.removeClass(fstClass+"-"+styleName);
  };
  
})( jQuery );
