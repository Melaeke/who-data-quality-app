/**
 © Copyright 2017 the World Health Organization (WHO).

 This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3),
 copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and
 immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
 */

//The Ethiopan calendar requires jquery calendars.
require("../libs/jquery.calendars.js")

//calendar.plus added to support different formats for Ethiopian date.
require("../libs/jquery.calendars.plus.js")

//jquery ethiopian calendar
require("../libs/jquery.calendars.ethiopian.min.js")
var EthiopianCalendar = new $.calendars.calendars.ethiopian

angular.module("outlierGapAnalysis").controller("OutlierGapAnalysisController",
	["d2Meta", "d2Utils", "d2Map", "periodService", "requestService", "dataAnalysisService", "$scope","$rootScope",
		function(d2Meta, d2Utils, d2Map, periodService, requestService, dataAnalysisService, $scope,$rootScope) {

			var self = this;

			self.results = [];
			self.currentResult = undefined;
			self.result = undefined;

			self.itemsPerPage = 25;
			self.hasVisual = false;

			self.processStatus = dataAnalysisService.status;

			d2Map.load().then(function() {
				init();
			});

			function init() {
				self.showFilter = false;

				self.selectedData = {
					ds: [],
					deg: [],
					ig: []
				};
				self.selectedOrgunit;

				self.periodTypes = [];
				self.periodTypes = periodService.getPeriodTypes();
				self.periodTypeSelected = self.periodTypes[1];

				self.periodCount = [];
				self.periodCounts = periodService.getPeriodCount();
				self.periodCountSelected = self.periodCounts[11];

				self.years = periodService.getYears();
				self.yearSelected = self.years[0];

				self.isoPeriods = [];

				self.currentDate = EthiopianCalendar.newDate();
				let startDate = EthiopianCalendar.newDate().add(-12,'m');

				self.date = {
					"startDate": startDate,
					"endDate": self.currentDate
				};

				self.periodOption = "last";

				self.onlyNumbers = /^\d+$/;

				//Accordion settings
				self.oneAtATime = true;
				self.status = {
					isFirstOpen: true
				};

				//Datepicker settings
				self.datepickerOptionsFrom = {
					minMode: "month",
					datepickerMode: "month",
					maxDate: self.date.endDate
				};
				self.datepickerOptionsTo = {
					minMode: "month",
					datepickerMode: "month",
					minDate: self.date.startDate,
					maxDate: self.currentDate
				};
			}

			/** -- PARAMETER SELECTION -- */

			/** Orgunits */



			function getPeriods() {

				var startDate, endDate;
				if (self.periodOption === "last") {
					endDate = EthiopianCalendar.newDate().formatDate('yyyy-mm-dd');
					if (self.periodTypeSelected.id === "Weekly") {
						startDate = EthiopianCalendar.newDate().add(-1*self.periodCountSelected.value,'w').formatDate('yyyy-mm-dd');
					}
					else if (self.periodTypeSelected.id === "Monthly") {
						startDate = EthiopianCalendar.newDate().add(-1*self.periodCountSelected.value,'m').formatDate('yyyy-mm-dd');
					}
					else if (self.periodTypeSelected.id === "BiMonthly") {
						startDate = EthiopianCalendar.newDate().add(-2*self.periodCountSelected.value,'m').formatDate('yyyy-mm-dd');
					}
					else if (self.periodTypeSelected.id === "Quarterly") {
						startDate = EthiopianCalendar.newDate().add(-3*self.periodCountSelected.value,'m').formatDate('yyyy-mm-dd');
					}
					else if (self.periodTypeSelected.id === "SixMonthly"|| self.periodTypeSelected.id === "SixMonthlyApril" ||self.periodTypeSelected.id === "SixMonthlyNovember") {
						startDate = EthiopianCalendar.newDate().add(-6*self.periodCountSelected.value,'m').formatDate('yyyy-mm-dd');
					}
					else if (self.periodTypeSelected.id === "Yearly"||self.periodTypeSelected.id === "FinancialOct"||self.periodTypeSelected.id === "FinancialJuly"||self.periodTypeSelected.id === "FinancialApril"||self.periodTypeSelected.id === "FinancialNov") {
						startDate = EthiopianCalendar.newDate().add(-1*self.periodCountSelected.value,'y').formatDate('yyyy-mm-dd');
					}
				}
				else if (self.periodOption === "year") {

					if (self.yearSelected.name === EthiopianCalendar.newDate().formatDate("yyyy")) {
						endDate = EthiopianCalendar.newDate().formatDate("yyyy-mm-dd");
					}
					else {
						endDate = self.yearSelected.id + "-12-30";
					}

					startDate = self.yearSelected.id + "-01-01";


				}
				else {
					startDate = self.date.startDate;
					endDate = self.date.endDate;
				}

				return periodService.getISOPeriods(startDate, endDate, self.periodTypeSelected.id);

			}


			function getData() {
				var dx = [];
				d2Utils.arrayMerge(dx, self.selectedData.ds);
				d2Utils.arrayMerge(dx, self.selectedData.deg);
				d2Utils.arrayMerge(dx, self.selectedData.ig);
				d2Utils.arrayRemoveDuplicates(dx, "id");
				return dx;
			}


			self.doAnalysis = function () {

				//Collapse open panels
				angular.element(".panel-collapse").removeClass("in");
				angular.element(".panel-collapse").addClass("collapse");


				//Clear previous result
				self.result = undefined;
				if (self.results.length > 1) self.results.move(self.currentResult, 0);

				var dx = getData();
				var ouBoundary = self.selectedOrgunit.boundary;
				var ouLevel = self.selectedOrgunit.level;
				var ouGroup = self.selectedOrgunit.group;

				var dxIDs = d2Utils.arrayProperties(dx, "id");
				var periods = getPeriods();

				dataAnalysisService.outlierGap(receiveResult, dxIDs, null, null, periods, [ouBoundary.id],
					ouLevel ? ouLevel.level : null, ouGroup ? ouGroup.id : null, 2, 3.5, 1);

			};


			/** UTILITIES */

			//Directive will add its function here:
			$rootScope.resultControl = {};
			function receiveResult(result) {
				$rootScope.resultControl.receiveResult(result);
				self.loading=false;
			}

			return self;
		}]);
