main.directive('threedView', function ($timeout) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        compile: function compile(temaplateElement, templateAttrs) {

            return {
                pre: function (scope, element, attrs) {

                },
                post: function (scope, element, attrs) {
                    var webglEl = new MyScene(element);

                    scope.$parent.$watch('bikes.selectedBike',function(newVal,oldVal){
						webglEl.utils.actionAnimate(newVal);
						 
                    });
                }
            }
        }
    }
});