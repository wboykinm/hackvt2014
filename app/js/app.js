angular.module('app', ['n3-line-chart'])

  .controller('main', function($scope, $http){
    $scope.now = new Date('7/23/2012 12:10');
    setInterval(function(){
      var now = new Date($scope.now);
      now.setMinutes(now.getMinutes()+1);
      $scope.now = now;
      $scope.$apply();
    }, 1000);

    $scope.circuits = {
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
        },
        y: {
          labelFunction: function(w){
            return ' - ';
          }
        }
      },
      series: [{
        y: 'main',
        thickness: '3px',
        drawDots: false
      }]
    };
    for (var key in $scope.circuits) {
      $scope.currentUsageOptions.series.push({
        y: key,
        label: $scope.circuits[key],
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
          drawDots: false,
          label: 'Current usage'
        }, {
          y: 'average_hp',
          thickness: '1px',
          drawDots: false,
          label: 'Typical usage'
        }]
      }
    };

    $scope.upgrade = {
      title: 'Lighting',
      name: 'lights',
      upgradePath: {
        name: 'LED bulbs',
        savings: 11.22,
        payback: '13 months, 5 days',
        link: 'http://www.amazon.com/b/ref=sr_aj?node=2314207011&ajr=0'
      },
      chartOptions: {
        lineMode: 'basis',
        tooltip: {mode: "scrubber"},
        columnsHGap: 60,
        axes: {
          x: {
            key: 'percentage',
            type: 'linear'
          }
        },
        series: [{
          y: 'me',
          type: 'column',
          thickness: '3px',
          drawDots: false,
          label: 'My lights'
        }, {
          y: 'neighbors',
          type: 'area',
          thickness: '1px',
          drawDots: false,
          label: 'My neighbors\' lights'
        }]
      },
      chartData: [{
        percentage: 0,
        neighbors: 0,
        me: 0
      }, {
        percentage: 10,
        neighbors: (1+(Math.random()*10)/4),
        me: 0
      }, {
        percentage: 20,
        neighbors: (16+(Math.random()*10)/4),
        me: 0
      }, {
        percentage: 30,
        neighbors: (20+(Math.random()*10)/4),
        me: 0
      }, {
        percentage: 40,
        neighbors: (15+(Math.random()*10)/4),
        me: 0
      }, {
        percentage: 50,
        neighbors: (19+(Math.random()*10)/4),
        me: 0
      }, {
        percentage: 60,
        neighbors: (14+(Math.random()*10)/4),
        me: 0
      }, {
        percentage: 60.01,
        me: 25
      }, {
        percentage: 60.02,
        me: 0
      }, {
        percentage: 70,
        neighbors: (8+(Math.random()*10)/4),
        me: 0
      }, {
        percentage: 80,
        neighbors: (4+(Math.random()*10)/4),
        me: 0
      }, {
        percentage: 90,
        neighbors: (12+(Math.random()*10)/4),
        me: 0
      }, {
        percentage: 95,
        neighbors: (2+(Math.random()*10)/4),
        me: 0
      }, {
        percentage: 100,
        neighbors: 0,
        me: 0
      }]
    };

    $scope.view = 'main';
    $scope.experiment = {
      name: '',
      price: '',
      circuits: {}
    };
    $scope.filteredCircuits = $scope.circuits;
    $scope.showExperiment = function(){
      $scope.view = 'experiment';
      $scope.filteredCircuits = $scope.circuits;
      $scope.experiment = {
        name: '',
        price: '',
        circuits: {}
      };
    };
    $scope.$watchCollection('experiment', function(experiment){
      var circuitList = [];
      for (var key in $scope.circuits) {
        circuitList.push({
          key: key,
          name: $scope.circuits[key]
        });
      }

      var filteredCircuits = circuitList;
      if (experiment.name.indexOf('thermostat') != -1) {
        filteredCircuits = circuitList.filter(function(circuit){
          return (circuit.name.toLowerCase().indexOf('heat') != -1);
        });
      } else if (experiment.name.indexOf('light') != -1) {
        filteredCircuits = circuitList.filter(function(circuit){
          return (circuit.name.toLowerCase().indexOf('lights') != -1 || circuit.name.toLowerCase().indexOf('outlet') != -1);
        });
      }

      $scope.filteredCircuits = {};

      filteredCircuits.forEach(function(circuit){
        $scope.filteredCircuits[circuit.key] = circuit.name;
      });
    });
    $scope.showMain = function(){
      $scope.view = 'main';
    };

    $scope.toggleCircuit = function(circuit){
      if ($scope.experiment.circuits[circuit]) {
        delete $scope.experiment.circuits[circuit];
      } else {
        $scope.experiment.circuits[circuit] = true;
      }
    };
  });