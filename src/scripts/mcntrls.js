main.controller("BaseCntrl", ['$scope', function ($scope) {
    this.test = "etst";
}]);
main.controller("HomeCntrl", ['$scope', function ($scope) {
    $scope.bikes = [
        {img:"dist/images/bikes/bike4.jpg",price:100,name:'Harley'},
        {img:"dist/images/bikes/bike2.jpg",price:110,name:'Yamaha'},
        {img:"dist/images/bikes/bike3.jpg",price:139,name:'MT'},
        {img:"dist/images/bikes/bike1.jpg",price:214,name:'Test'},
        {img:"dist/images/bikes/bike5.jpg",price:500,name:'Harley'},
        {img:"dist/images/bikes/bike6.jpg",price:9880,name:'Jupiter'},
        {img:"dist/images/bikes/bike7.jpg",price:200,name:'Harley'}
    ];
    
}]);
main.controller("ContactCntrl", ['$scope', function ($scope) {

    $scope.submit=function(){
        $scope.formSuccess = "Thank you! We will contact you as soon as possible";
    }
    
}]);