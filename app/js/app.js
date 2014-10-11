angular.module('app', ['n3-line-chart'])

  .controller('main', function($scope){
    $scope.currentUsage = [{
      x: 0,
      me: 1,
      neighbors: 1.1
    }, {
      x: 1,
      me: 2,
      neighbors: 2.4
    }, {
      x: 2,
      me: 4,
      neighbors: 4.1
    }, {
      x: 3,
      me: 6,
      neighbors: 8.8
    }, {
      x: 4,
      me: 4,
      neighbors: 9
    }, {
      x: 5,
      me: 7,
      neighbors: 8
    }, {
      x: 6,
      me: 12,
      neighbors: 15
    }, {
      x: 7,
      me: 23,
      neighbors: 21
    }, {
      x: 8,
      me: 19,
      neighbors: 23
    }, {
      x: 9,
      me: 13,
      neighbors: 18
    }, {
      x: 10,
      me: 6,
      neighbors: 12
    }, {
      x: 11,
      me: 4,
      neighbors: 6
    }];
    $scope.chartOptions = {
      series: [{
        y: 'me'
      }, {
        y: 'neighbors'
      }]
    };
  });