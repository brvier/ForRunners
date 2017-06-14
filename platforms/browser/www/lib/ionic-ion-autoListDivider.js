angular.module('ionic.ion.autoListDivider',[])

.directive('autoListDivider', function($timeout) {  
    var lastDivideKey = "";

    return {
        link: function(scope, element, attrs) {
            var key = attrs.autoListDividerValue;

            var dividers = document.getElementsByClassName("item-divider");
            lastDivideKey = "";
            while(dividers.length > 0)
            {
                dividers[0].parentNode.removeChild(dividers[0]);
            }
        
            var defaultDivideFunction = function(k){
                return k;
            }
      
            var doDivide = function(){
                var divideFunction = scope.$apply(attrs.autoListDividerFunction) || defaultDivideFunction;
                var divideKey = divideFunction(key);
                
                if(divideKey != lastDivideKey) { 
                    var contentTr = angular.element("<div class='item item-divider'>"+divideKey+"</div>");
                    element[0].parentNode.insertBefore(contentTr[0], element[0]);
                }

                lastDivideKey = divideKey;
            }
          
            $timeout(doDivide,0)
        }
    }
});

