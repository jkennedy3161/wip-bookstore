angular.module('bookstore.shelf', [])
.controller('ShelfController', function($scope, $routeParams, Shelf, Details, $window) {
  $scope.collections = [];
  $scope.cart = [];
  $scope.id = $routeParams.id;
  $scope.totalPrice = 0;
  $scope.location = $window.location;  $scope.getShelf = function() {
    Shelf.getShelf($window.localStorage.getItem('userId'))
      .then(function(collections) {
        console.log(collections);
        $scope.collections = collections;
      });
  };
  $scope.addToCart = function(book) {
    console.log($scope.location);
    console.log(book);
    $scope.cart = $scope.cart.concat(book);
    console.log($scope.cart);
    $scope.totalPrice += Number(book.price);
    $scope.roundedPrice = Math.floor($scope.totalPrice * 100) / 100;
  };
  $scope.fakeBuy = function(){
    alert('Hi! This is where a 3rd party payment plugin would show...');
  };
})