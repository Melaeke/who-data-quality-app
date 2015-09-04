
(function(){
	
	var app = angular.module('dashboard', []);
	
	
	app.controller("DashboardController", function(metaDataService, periodService, requestService, visualisationService, mathService, dataAnalysisService, $window, $q, $scope, $timeout) {

	    var self = this;
		
		self.ready = false;
		self.completeness = false;
		self.consistency = false;
		self.dataConsistency = false;
    	     
        /** -- ANALYSIS -- */
        
        /** COMPLETENESS */
        self.makeCompletenessCharts = function() {
        	if (!self.ready) return;
			if (self.completeness) {
				updateCharts();
				return;
			}
			else self.completeness = true;

			self.completenessCharts = [];

        	var datasets = metaDataService.getDatasetsInGroup(self.group);
			self.expectedCompletenessCharts = datasets.length;
			var ouBoundaryID = self.ouBoundary.id;
       		var ouChildrenID = ouChildrenIDs();
        	var dataset, periods, ouPeriod;
        	for (var i = 0; i < datasets.length; i++) {
               	dataset = datasets[i];

        		periods = periodService.getISOPeriods(self.startDate, self.endDate, dataset.periodType);
        		if (periods.length < 4) {
        			ouPeriod = periods[periods.length - 1];
        		}
        		else {
        			ouPeriod = periods[periods.length - 2];
        		}

				var promises = [];
				promises.push(promiseObject(dataset));
				promises.push(visualisationService.lineChart(null, [dataset.id], periods, [ouBoundaryID], 'dataOverTime'));
				promises.push(visualisationService.barChart(null, [dataset.id], [ouPeriod], ouChildrenID, 'ou'));

				$q.all(promises).then(function(datas) {

					var datasetCompletenessChart = {
						name: datas[0].name,
						id: datas[0].id,
						trendChartOptions: datas[1].opts,
						trendChartData: datas[1].data,
						ouChartOptions: datas[2].opts,
						ouChartData: datas[2].data
					};

					visualisationService.setChartHeight(datasetCompletenessChart.trendChartOptions, 400);
					visualisationService.setChartLegend(datasetCompletenessChart.trendChartOptions, false);
					visualisationService.setChartYAxis(datasetCompletenessChart.trendChartOptions, 0, 100);
					visualisationService.setChartMargins(datasetCompletenessChart.trendChartOptions, 20, 20, 100, 40);

					visualisationService.setChartHeight(datasetCompletenessChart.ouChartOptions, 400);
					visualisationService.setChartLegend(datasetCompletenessChart.ouChartOptions, false);
					visualisationService.setChartYAxis(datasetCompletenessChart.ouChartOptions, 0, 100);
					visualisationService.setChartMargins(datasetCompletenessChart.ouChartOptions, 20, 20, 100, 40);

					self.completenessCharts.push(datasetCompletenessChart);

					if (self.expectedCompletenessCharts === self.completenessCharts.length) {
						updateCharts();
					}
				});

        	}

        };


    	
    	/** CONSISTENCY OVER TIME */
    	self.makeTimeConsistencyCharts = function() {
			if (!self.ready) return;
			if (self.consistency) {
				updateCharts();
				return;
			}
			else self.consistency = true;

      		self.consistencyCharts = [];
      		self.yyReceived = 0;

      		var ouBoundaryID = self.ouBoundary.id;
   			var ouLevel = self.ouBoundary.level + 1;
      		var data, endDate, startDate, periodType, yyPeriods, period, refPeriods; 	
   			var datas = metaDataService.getDataInGroup(self.group);
			self.expectedConsistencyCharts = datas.length;
			var consistencyChart;
			for (var i = 0; i < datas.length; i++) {
      			
      			data = datas[i];
      			periodType = metaDataService.getDataPeriodType(data.code);

      			refPeriods = periodService.getISOPeriods(self.startDate, self.endDate, periodType);
				if (refPeriods.length < 4) {
					period = refPeriods[refPeriods.length - 1];
				}
				else {
					period = refPeriods[refPeriods.length - 2];
				}
      			yyPeriods = [];
				startDate = self.startDate;
				endDate = self.endDate;
      			yyPeriods.push(periodService.getISOPeriods(startDate, endDate, periodType));
      			for (var j = 0; j < 2; j++) {
      				startDate = moment(startDate).subtract(1, 'year');
      				endDate = moment(endDate).subtract(1, 'year');
      				yyPeriods.push(periodService.getISOPeriods(startDate, endDate, periodType));
      			}

				var promises = [];
				promises.push(promiseObject(data));
				promises.push(visualisationService.yyLineChart(null, yyPeriods, data.localData.id, ouBoundaryID));
				promises.push(dataAnalysisService.timeConsistency(null, data.trend, data.consistency, null, data.localData.id, null, period, refPeriods, ouBoundaryID, ouLevel, null));

				$q.all(promises).then(function(datas) {

					var data = datas[0];
					var yyLine = datas[1];
					var tConsistency = datas[2];

					//Add chart data to time consistency result object
					visualisationService.makeTimeConsistencyChart(null, tConsistency.result, null);


					var consistencyChart = {
						name: data.name,
						id: data.id,
						yyChartOptions: yyLine.opts,
						yyChartData: yyLine.data,
						consistencyChartOptions: tConsistency.result.chartOptions,
						consistencyChartData: tConsistency.result.chartData
					};


					visualisationService.setChartHeight(consistencyChart.yyChartOptions, 400);
					visualisationService.setChartLegend(consistencyChart.yyChartOptions, false);
					visualisationService.setChartYAxis(consistencyChart.yyChartOptions, 0, 100);
					visualisationService.setChartMargins(consistencyChart.yyChartOptions, 20, 20, 100, 40);

					visualisationService.setChartHeight(consistencyChart.consistencyChartOptions, 400);
					visualisationService.setChartLegend(consistencyChart.consistencyChartOptions, false);
					visualisationService.setChartYAxis(consistencyChart.consistencyChartOptions, 0, 100);
					visualisationService.setChartMargins(consistencyChart.consistencyChartOptions, 20, 20, 100, 40);
					

					self.consistencyCharts.push(consistencyChart);

					if (self.expectedConsistencyCharts === self.consistencyCharts.length) {
						updateCharts();
					}
				});

      		}
      		      		
      	};


		
		/** CONSISTENCY OVER TIME */
		self.makeDataConsistencyCharts = function() {
			if (!self.ready) return;

			if (self.dataConsistency) {
				updateCharts();
				return;
			}
			else {
				self.dataConsistency = true;
			}

			self.dataConsistencyCharts = [];

			var ouBoundaryID = self.ouBoundary.id;
			var ouLevel = self.ouBoundary.level + 1;
			var period = 2014;

			var relations = metaDataService.getRelations(self.group);
			self.expectedDataConsistencyCharts = relations.length;
			for (var i = 0; i < relations.length; i++) {
				var relation = relations[i];
				var indicatorA = metaDataService.getDataWithCode(relation.A);
				var indicatorB = metaDataService.getDataWithCode(relation.B);

				var promises = [];
				promises.push(relation);
				promises.push(dataAnalysisService.dataConsistency(null, relation.type, relation.criteria, relation.code, indicatorA.localData.id, indicatorB.localData.id, period, ouBoundaryID, ouLevel, null));
				$q.all(promises).then(function(datas) {
					var data = datas[0]
					var result = datas[1];
					if (result.result.type != 'do') {
						visualisationService.makeDataConsistencyChart(null, result.result, null);
					}
					else {
						visualisationService.makeDropoutRateChart(null, result.result, null);
					}

					var dataConsistencyChart = {
						name: data.name,
						period: result.result.pe,
						chartOptions: result.result.chartOptions,
						chartData: result.result.chartData
					};


					visualisationService.setChartHeight(dataConsistencyChart.chartOptions, 400);
					visualisationService.setChartLegend(dataConsistencyChart.chartOptions, true);
					visualisationService.setChartYAxis(dataConsistencyChart.chartOptions, 0, 100);
					visualisationService.setChartMargins(dataConsistencyChart.chartOptions, 60, 20, 100, 100);

					self.dataConsistencyCharts.push(dataConsistencyChart);
				});

			}

		};
      	



    	/** -- OUTLIERS -- */






      	
      	/** -- UTILITIES -- */

		function promiseObject(object) {
			var deferred = $q.defer();
			deferred.resolve(object);
			return deferred.promise;
		}


		function getPeriodTypes(datasets) {
      		
  			var data, pTypes = {};
  			for (var i = 0; i < self.dataAvailable.length; i++) {
  				pTypes[self.dataAvailable[i].periodType] = true;
  			}
      			
      		for (pt in pTypes) {
      			self.periodTypes.push({'pt': pt});
      		}
      		
      	}

		function updateCharts() {
			$timeout(function () { window.dispatchEvent(new Event('resize')); }, 100);
		}

      	
      	function setWindowWidth() {

      		if ($window.innerWidth < 768) {
      			self.singleCol = true;
      		}
      		else {
      			self.singleCol = false;
      		}
      	}
      	
      	function ouChildrenIDs() {
      		var IDs = [];
      		
      		if (!self.ouChildren) return [];
      		for (var i = 0; i < self.ouChildren.length; i++) {
      			IDs.push(self.ouChildren[i].id)
      		}
      		return IDs;
      	}
      	
      	function ouGrandChildrenIDs() {
  			var IDs = [];
  			
  			if (!self.ouGrandChildren) return [];
  			for (var i = 0; i < self.ouGrandChildren.length; i++) {
  				IDs.push(self.self.ouGrandChildren[i].id)
  			}
  			
      		return IDs;
  		}
      	
      	
      	/** -- INIT -- */		
      	
      	function init() {
      		setWindowWidth();
      		$( window ).resize(function() {
      			setWindowWidth();
				$scope.$apply();
      		});
      		
      		self.group = 'core';

      		metaDataService.getUserOrgunitHierarchy().then(function(data) { 
				self.ouBoundary = data;
				
				self.ouChildren = data.children;
				self.ouGrandChildren = [];
				if (self.ouChildren && self.ouChildren.length > 0) {
					for (var i = 0; i < self.ouChildren.count; i++) {
						self.ouGrandChildren.push(self.ouChildren[i].children);
					}
				}
				if (self.ouGrandChildren.length === 0) self.ouGrandChildren = null;
				
				//Completeness is the default - get that once we have user orgunit
	      		self.makeCompletenessCharts();
			});

			self.endDate = moment().subtract(new Date().getDate(), 'days');
			self.startDate = moment(self.endDate).subtract(12, 'months').add(1, 'day');
      	}
      	
		//Make sure mapping is available, then intialise
		if (metaDataService.hasMapping()) {
			self.ready = true;
			init();
		}
		else {
			metaDataService.getMapping().then(function (data) {
				self.ready = true;
				init();
			});
		}
			
			
			
		return self;
		
	});
})();