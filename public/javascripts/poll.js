var pollModule = angular.module('Poll', ['ngRoute', 'ngMaterial']);

pollModule.config(function($mdThemingProvider, $routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'partials/home',
			controller: 'HomeController'
		});

	$mdThemingProvider.theme('default')
      .primaryPalette('red')
      .accentPalette('orange');

	$locationProvider.html5Mode(true);
});

pollModule.controller('HomeController', function($scope){
	$scope.saluto = 'ciao';
});

