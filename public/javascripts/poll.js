var pollModule = angular.module('Poll', ['ngResource', 'ngRoute', 'ngMaterial', 'ngAnimate', 'chartjs']);

pollModule.config(function($mdThemingProvider, $routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'partials/home',
			controller: 'NewPollController'
		})
    .when('/polls/:id',{
      templateUrl: 'partials/poll',
      controller: 'PollController'
    })
    .otherwise({
      redirectTo: '/'
    });

	$mdThemingProvider.theme('default')
      .primaryPalette('red')
      .accentPalette('orange');

	$locationProvider.html5Mode(true);
});

pollModule.factory('Polls', ['$resource', function($resource){
  return $resource('/api/polls/:id', null, {
    'update': { method:'PUT' }
  });
}]);

pollModule.controller('NewPollController', ['$scope', '$location', '$http', function($scope, $location, $http){
  $scope.poll = {};
  $scope.poll.choices = [{name:''},{name:''},{name:''}];

  $scope.$watch('poll.choices', function(newValue, oldValue){
    if(newValue[$scope.poll.choices.length-1] == undefined) return;
    if(oldValue[$scope.poll.choices.length-1] == undefined) return;
    if(newValue[$scope.poll.choices.length-1].name 
    == oldValue[$scope.poll.choices.length-1].name) return;
    for(var i=0; i < $scope.poll.choices.length; i++){
      if($scope.poll.choices[0].name.length == 0) return;
    }
    $scope.poll.choices.push({name:''});
  }, true);

  $scope.addPoll = function(){
    var toSave = angular.copy($scope.poll);
    var choicesToSave = [];
    angular.forEach($scope.poll.choices, function(choice, index){
      if(choice.name != ''){
        choicesToSave.push(choice);
      }
    });
    toSave.choices = choicesToSave;
    $http.post('/api/polls', toSave).success(function(data){
      console.log("Saved a new poll: ", data);
      $location.path('/polls/' + data);
    });
    console.log(toSave);
  };

}]);

pollModule.controller('PollController', ['$scope', '$timeout', '$interval', '$routeParams','Polls', function($scope, $timeout, $interval, $routeParams, Polls){
    $scope.poll = Polls.get({id:$routeParams.id});
    $scope.chartData = [];
    $scope.colors = [{color: "#F7464A", highlight: "#FF5A5E"},
                     {color: "#46BFBD", highlight: "#5AD3D1"},
                     {color: "#FDB45C", highlight: "#FFC870"}
                    ];
    $scope.sel = 0;

    $scope.vote = function(selIndex){
      var pollId = $routeParams.id;
      var poll = $scope.poll;
      if(!poll.choices[selIndex]) return;
      poll.choices[selIndex].votes.push('anonymous');
      var pollCopy = angular.copy(poll);
      delete pollCopy.$promise;
      delete pollCopy.$resolved;
      Polls.update({id: pollId}, pollCopy);
      $scope.refreshChart();
    };

    $scope.refreshChart = function(){
      $scope.chartData = [];
      var chartInfo = [];
      angular.forEach($scope.poll.choices, function(choice, index){
        var choiceValues = {};
        choiceValues.value = choice.votes.length;
        choiceValues.label = choice.name;
        choiceValues.color = $scope.colors[index%$scope.colors.length].color;
        choiceValues.highlight = $scope.colors[index%3].highlight;
        $scope.chartData.push(choiceValues);
      });
    };

    $scope.updateData = function(){
      $scope.poll = Polls.get({id:$routeParams.id});
    }

    $timeout($scope.refreshChart, 1000);
    $interval($scope.updateData, 5000);

  }]);