/* iosDblclick
 * v0.1.0
 * Copyright 2015 Mathieu Savy http://mathieu-savy.com/
 * See LICENSE in this repository for license information
 */
(function () {
    angular.module('iosDblclick', [])
        .directive('iosDblclick',
        function () {

            const DblClickInterval = 300; //milliseconds

            var firstClickTime;
            var waitingSecondClick = false;

            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.bind('click', function (e) {

                        if (!waitingSecondClick) {
                            firstClickTime = (new Date()).getTime();
                            waitingSecondClick = true;

                            setTimeout(function () {
                                waitingSecondClick = false;
                            }, DblClickInterval);
                        }
                        else {
                            waitingSecondClick = false;

                            var time = (new Date()).getTime();
                            if (time - firstClickTime < DblClickInterval) {
                                scope.$apply(attrs.iosDblclick);
                            }
                        }
                    });
                }
            };
        });
})();