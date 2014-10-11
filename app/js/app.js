angular.module('app', ['n3-line-chart'])

  .controller('main', function($scope, $http){
    $scope.currentUsage = [];
    $scope.chartOptions = {
      axes: {
        x: {
          key: 'date',
          type: 'type'
        }
      },
      series: [{
        y: 'consumed'
      }]
    };

    $http.get('/week').then(function(stuff){
      var data = stuff.data;
      data.forEach(function(row){
        row.date = new Date(row.date);
      });
      console.log(data);
      $scope.currentUsage = data;
    });
  });