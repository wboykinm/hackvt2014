angular.module('app', ['n3-line-chart'])

  .controller('main', function($scope, $http){
    $scope.now = new Date('7/23/2012 12:10');
    setInterval(function(){
      var now = new Date($scope.now);
      now.setMinutes(now.getMinutes()+1);
      $scope.now = now;
      $scope.$apply();
    }, 1000);

    $scope.plan = {
      dhw: 'Hot water heater',
      dryer: 'Dryer',
      range: 'Stove',
      outlet1: 'Living room outlet',
      outlet2: 'Kitchen outlet',
      washer: 'Washing machine',
      light1: 'Living room lights',
      outlet3: 'Bathroom outlet',
      hp: 'Heat pump',
      outlet4: 'Attic outlet',
      outlet5: 'Laundry room outlet',
      outlet6: 'Bedroom outlet',
      outlet7: 'Second bedroom outlet',
      light2: 'Kitchen lights',
      vent: 'Kitchen vent'
    };
    $scope.charts = [];

    $scope.currentUsageOptions = {
      lineMode: 'basis',
      tooltip: {mode: "scrubber"},
      axes: {
        x: {
          key: 'date_time',
          type: 'date'
        }
      },
      series: [{
        y: 'main',
        thickness: '3px',
        drawDots: false
      }]
    };
    for (var key in $scope.plan) {
      $scope.currentUsageOptions.series.push({
        y: key,
        thickness: '1.5px',
        drawDots: false
      });
    }

    $scope.$watch('now', function(now){
      if (now) {
        $http.get('/latest/'+now.valueOf()).then(function(stuff){
          var data = stuff.data;
          data.forEach(function(row){
            row.date_time = new Date(row.date_time);
          });
          $scope.currentUsage = data;
        });
      }
    });

    $http.get('/today').then(function(stuff){
      var data = stuff.data;
      data.forEach(function(row){
        row.date_time = new Date(row.date_time);
      });
      $scope.todayUsage = data.map(function(row){
        row.average_hp /= 3;
        return row;
      });
    });

    $scope.anomaly = {
      title: 'Heat pump',
      chartOptions: {
        lineMode: 'basis',
        tooltip: {mode: "scrubber"},
        axes: {
          x: {
            key: 'date_time',
            type: 'date'
          }
        },
        series: [{
          y: 'hp',
          thickness: '3px',
          drawDots: false
        }, {
          y: 'average_hp',
          thickness: '1px',
          drawDots: false
        }]
      }
    };
  });