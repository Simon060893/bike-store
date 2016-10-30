var main = angular.module('main', ['ui.router']);

main.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/home');
        var url = 'partials/',
            views = url;

        $stateProvider
            .state('home', {url: '/home', templateUrl: views + 'home.html', controller: 'HomeCntrl'})
            .state('contact', {url: '/contact', templateUrl: views + 'contact.html', controller: 'ContactCntrl'});

        // $locationProvider.html5Mode({enabled: true, requireBase: false});
    }]);



