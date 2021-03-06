angular.module('bookstore.landing', [])
.controller('LandingController', ['$scope', '$http', 'Landing', 'Auth', '$window', '$location', function($scope, $routeParams, Landing, Auth, $window, $location) {
  $scope.books = [];
  $scope.savedSearch = '';
  $scope.savedMax = null;
  $scope.savedOrder = '';
  $scope.page = 1;
  $scope.index = 0;
  $scope.token = $window.localStorage.getItem('access_token');
  $scope.user = {};
  $scope.alert = '';
  $scope.userId = $window.localStorage.getItem('userId') || '';
  // if user id is present, then retrieve user info for return sign in
  if ($scope.userId) {
    Auth.returningUser($scope.userId)
      .then(function(user) {
        $scope.user = user;
    })
  } else {
    Auth.me($scope.token)
      .then(function(user) {
        $scope.user = user;
        $scope.userId = $window.localStorage.setItem('userId', user._id);
      })
  }
  $scope.fetchBooks = function(search, index, max, orderBy) {
    // handle if there's a search already
    if (search === $scope.savedSearch) {
      Landing.getBooks(search, index, $scope.savedMax, $scope.savedOrder)
        .then(function(book) {
          $scope.books = $scope.books.concat(book.items);
          // clear search field
          $scope.search = '';
          $scope.index += 41;
          //console.log('startIndex now ' + $scope.index);
          $scope.savedSearch = search;
          $scope.loadMore = false;
        });
    } else {
      $scope.books = [];
      $scope.index = 0;
      Landing.getBooks(search, index, max, orderBy)
        .then(function(book) {
          $scope.books = $scope.books.concat(book.items);
          // clear search field
          $scope.search = '';
          $scope.index += 41;
          $scope.savedSearch = search;
          $scope.savedMax = max;
          console.log('max result is now ' + $scope.savedMax);
          $scope.savedOrder = orderBy;
          $scope.loadMore = false;
        });
    }
  };
  $scope.saveBook = function(book) {
    var filterArr = book.volumeInfo.imageLinks.thumbnail.split('&');
    var thumbnail = filterArr[0] + '&' + filterArr[1] + '&' + filterArr[2] + '&' + 'zoom=0' + '&' +filterArr[5];
    var smallThumbnail = filterArr[0] + '&' + filterArr[1] + '&' + filterArr[2] + '&' + 'zoom=1' + '&' +filterArr[5];
    var bookObj = {
      title: book.volumeInfo.title,
      authors: (book.volumeInfo.authors === undefined) ? 'No Authors' : book.volumeInfo.authors,
      thumbnail: thumbnail,
      smallThumbnail: smallThumbnail,
      description: book.volumeInfo.description,
      owners: [$window.localStorage.getItem('userId')],
      price: book.saleInfo.retailPrice.amount,
      dupl: 0
    };
    Landing.saveBook(bookObj)
      .then(function(book) {
        //console.log(book);
        $scope.alert = (book.title + ' saved to your shelf!');
      })
  };
  $scope.signout = function() {
    $window.localStorage.clear();
    $location.path('/');
  };
}]);