var app = angular.module('myApp', ['ngRoute', 'datatables', 'toaster']);
app.factory("services", ['$http','toaster', function($http) {
  var serviceBase = 'services/'
    var obj = {};
  
    obj.getCharacters = function(){
        return $http.get(serviceBase + 'characters');
    }
    obj.getCharacter = function(characterID){
        return $http.get(serviceBase + 'character?id=' + characterID);
    }
    obj.insertCharacter = function (character,toaster) {
        return $http.post(serviceBase + 'insertCharacter', character).then(
            function (response) {
                //toaster.pop('success', "El personaje fue creado con éxito", "");
                console.log('response',response);
                return response;
                
            },function(err){
                console.error('Error',err);
                //toaster.pop('error', "Error: No se pudo crear el personaje.", "");
                return err;
                
            });
    };
   
    return obj;   
}]);


// CONTROLLER LIST AND INSERT
app.controller('listCharactersCtrl', function ($scope, $rootScope, services, $location, toaster) {
    
    $scope.images = ['img/mario1.jpg', 'img/mario2.jpg', "img/personaje1.jpg", "img/personaje2.jpg", "img/personaje3.jpg","img/personaje4.png", "img/personaje5.jpg","img/personaje6.jpg","img/personaje7.jpg", "img/personaje8.jpg",];
    
    services.getCharacters().then(function(data){
        console.log('data',data);
        $scope.characters = data.data;   
       
        console.log($scope.images);
        $scope.characters.forEach(function(character){
            // $scope.images.push(character.imagen);
        });
    });
    
    $rootScope.title = 'Nuevo personaje';

    $scope.saveCharacter = function (character) {
        console.log(character, 'inserted');
        var resp = services.insertCharacter(character);
    	alert('Character created successfully');
    	$location.path('/');  
    };
    
});

// ROUTE PROVIDER
app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/', {
                title: 'Characters',
                templateUrl: 'partials/characters.html',
                controller: 'listCharactersCtrl'
            })
            .when('/edit-character/:characterID', {  // Add characterID in route for possibility of editing character in the future
                title: 'Add new Character',
                templateUrl: 'partials/edit-character.html',
                controller: 'listCharactersCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
}]);

app.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);