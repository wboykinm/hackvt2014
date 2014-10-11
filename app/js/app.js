angular.module('app', ['n3-line-chart'])

  .controller('main', function($scope, $http, $window){
    $scope.now = new Date('7/23/2012 12:10');
    setInterval(function(){
      var now = new Date($scope.now);
      now.setMinutes(now.getMinutes()+1);
      $scope.now = now;
      $scope.$apply();
    }, 2000);

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
        label: 'Entire house',
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
        row.previous_hp = row.average_hp/7;
        row.new_hp = row.outlet1;
        row.average_hp /= 3;
        return row;
      });
    });

    $scope.$watch('now', function(now){
      if (now < new Date('7/25/2012')) {
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
      } else {
        $scope.anomaly = false;
      }
    });

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
        columnsHGap: '2px',
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
          type: 'column',
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
    $scope.experiments = [];
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

    var calcSavings = function(exp){
      exp.previousUsage = 453;
      var randFactor = 20/((($scope.now - exp.started) / 1000) / (60 * 60 * 24 * 7));
      exp.ourUsage = 368.039-randFactor+(Math.random()*randFactor*2);
      exp.improvement = 1-(exp.ourUsage/exp.previousUsage);
      exp.savings = (exp.previousUsage-exp.ourUsage)*0.11;
      exp.payback = Math.ceil((exp.price.replace(/[^0-9]/g, '')*1) / exp.savings)+' months';

      exp.chartOptions = {
        lineMode: 'basis',
        tooltip: {mode: "scrubber"},
        axes: {
          x: {
            key: 'date_time',
            type: 'date'
          }
        },
        series: [{
          y: 'new_hp',
          thickness: '3px',
          drawDots: false,
          label: 'Experiment usage'
        }, {
          y: 'previous_hp',
          thickness: '1px',
          drawDots: false,
          label: 'Previous usage'
        }]
      };
    };

    $scope.startExperiment = function(){
      $scope.experiment.started = $scope.now;
      calcSavings($scope.experiment);
      $scope.experiments.push($scope.experiment);
      $scope.showMain();
    };

    $scope.experimentReady = function(exp){
      return ($scope.timeSince(exp.started) != 'just started');
    };
    $scope.humanCircuits = function(list){
      var out = [];
      for (var key in list) {
        out.push(key);
      }
      out = out.map(function(key){
        return $scope.circuits[key];
      });
      if (out.length > 1) {
        return out.slice(0, -1).join(', ')+' and '+out.slice(-1)+' have used';
      } else {
        return out[0]+' '+((out[0][out[0].length-1] == 's') ? 'have' : 'has')+' used';
      }
    };

    $scope.timeSince = function(time){
      var difference = ($scope.now - time) / 1000;
      if (difference < 60*60) {
        return 'just now';
      }
      if (difference < 60 * 60 * 24) {
        return 'today';
      }
      return Math.floor(difference / (60 * 60 * 24))+' days';
    };

    $scope.fastForward = function(){
      $scope.loading = true;
      setTimeout(function(){
        $scope.loading = false;
        $scope.$apply();
        //setTimeout(function(){
          window.dispatchEvent(new Event('resize'));
        //}, 1000);
      }, 1000+(Math.random()*1000));
      var now = new Date($scope.now);
      now.setDate(now.getDate()+7);
      $scope.now = now;
      $scope.experiments.forEach(function(exp){
        calcSavings(exp);
      });
    };

    $scope.$watch('view', function(view){
      $scope.currentPage = (view == 'experiment') ? 'experiment' : 'dashboard';
    });
  });