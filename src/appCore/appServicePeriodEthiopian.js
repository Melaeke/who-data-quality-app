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



import PeriodType from "../libs/periodTypeNoDepEthiopia.js";

var EthiopianCalendar = new $.calendars.calendars.ethiopian;

const moment = require("moment");

export default function ($i18next) {


	var self = this;
	var periodTool = new PeriodType();

	self.getISOPeriods = function (startDate, endDate, periodType) { //changed
		//need to check if this works for financial periods

		startDate = dateToISOdate(startDate);
		endDate = dateToISOdate(endDate);

		var startYear = startDate.year();
		var endYear = endDate.year();
		var thisYear = EthiopianCalendar.newDate().year();

		var current = startYear;
		var periods = [];
		var periodsInYear;

		while (current <= endYear && periodType != "Yearly") {

			var pTypeTool = periodTool.get(periodType);
			periodsInYear = pTypeTool.generatePeriods({
				"offset": current - thisYear,
				"filterFuturePeriods": true,
				"reversePeriods": false
			});

			for (var i = 0; i < periodsInYear.length; i++) {
				if (dateToISOdate(periodsInYear[i].endDate) >= startDate && dateToISOdate(periodsInYear[i].startDate) <= endDate) {
					periods.push(periodsInYear[i]);
				}
			}

			current++;
		}
		var isoPeriods = [];

		if (periodType === "Yearly" || periodType === 'FinancialApril' || periodType === 'FinancialJuly' || periodType === 'FinancialOct' || periodType === 'FinancialNov') {
			let pTypeTool = periodTool.get(periodType)
			periods = pTypeTool.generatePeriods({
				"offset": current - thisYear,
				"filterFuturePeriods": true,
				"reversePeriods": false
			});

		}
		for (var i = 0; i < periods.length; i++) {
			isoPeriods.push(periods[i].iso);
		}

		return isoPeriods;
	};


	self.shortPeriodName = function (periodISO) { //chanaged
		if (typeof (periodISO) === 'string') {
			let periodType = self.periodTypeFromPeriod(periodISO)
			var pTypeTool = periodTool.get(periodType);
			return pTypeTool.getPeriodNameFromISO(periodISO);
		} else {
			return periodISO['name'];
		}

	};


	//Should be sorted from shortest to longest
	self.getPeriodTypes = function () { //changed 
		//, {'name': 'Bimonthly', 'id':'BiMonthly'} <= Waiting for fix


		return periodTool.getAllPeriodTypes();
	};


	self.getPeriodCount = function () { //changed
		var objects = [];
		for (var i = 1; i <= 12; i++) {
			objects.push({
				"name": i.toString(),
				"value": i
			});
		}

		return objects;
	};


	self.getYears = function () { //changed

		var objects = [];
		for (var i = thisYear(); i >= 1990; i--) {
			objects.push({
				"name": i,
				"id": i
			});
		}

		return objects;

	};


	self.epochFromPeriod = function (period) {

		//TODO: Deal with half-years etc
		return moment(period, ["YYYYMM", "YYYYWww", "YYYYQQ", "YYYY"]).format("X");

	};


	self.periodFromEpoch = function (epoch, periodType) {

		if (periodType === "Monthly") {
			return moment.unix(epoch).format("YYYYMM");
		} else if (periodType === "Yearly") {
			return moment.unix(epoch).format("YYYY");
		}

		//TODO
	};


	self.periodTypeFromPeriod = function (periodISO) { //changed
		periodISO = periodISO.toString();
		var periodType = "";

		//Here order of checking matters because a period might be mistakenly identified as another.
		//for eg, if weekly comes before biweekly, all biweekly will be considered to be weekly
		if (periodISO.length === 4) {
			periodType = "Yearly";
		} else if (periodISO.indexOf("WedW") != -1) {
			periodType = "WeeklyWednesday";
		} else if (periodISO.indexOf("ThuW") != -1) {
			periodType = "WeeklyThursday";
		} else if (periodISO.indexOf("SatW") != -1) {
			periodType = "WeeklySaturday";
		} else if (periodISO.indexOf("SunW") != -1) {
			periodType = "WeeklySunday";
		} else if (periodISO.indexOf("BiW") != -1) {
			periodType = "BiWeekly"
		} else if (periodISO.indexOf("AprilS") != -1) {
			periodType = "SixMonthlyApril";
		} else if (periodISO.indexOf("NovS") != -1) {
			periodType = "SixMonthlyNovember";
		} else if (periodISO.indexOf("April") != -1) {
			periodType = "FinancialApril";
		} else if (periodISO.indexOf("July") != -1) {
			periodType = "FinancialJuly";
		} else if (periodISO.indexOf("Oct") != -1) {
			periodType = "FinancialOct";
		} else if (periodISO.indexOf("Nov") != -1) {
			periodType = "FinancialNov";
		} else if (periodISO.indexOf("W") != -1) {
			periodType = "Weekly";
		} else if (periodISO.endsWith("B")) {
			periodType = "BiMonthly";
		} else if (periodISO.indexOf("Q") != -1) {
			periodType = "Quarterly";
		} else if (periodISO.indexOf("S") != -1) {
			periodType = "SixMonthly";
		} else if (periodISO.length === 8) {
			periodType = "Daily"
		} else if (periodISO.length === 6) {
			periodType = "Monthly";
		} else {
			//all conditions are considered and if it reaches here then there is something wrong.
			console.error("Unknown period Type of ", periodISO)
			periodType = null;
		}

		return periodType;

	};


	self.shortestPeriod = function (periodTypes) {
		var w = false,
			m = false,
			q = false,
			s = false,
			y = false,
			pt;
		for (var i = 0; i < periodTypes.length; i++) {
			pt = periodTypes[i];
			switch (pt) {
				case "Quarterly":
					q = true;
					break;
				case "Weekly":
					w = true;
					break;
				case "SixMonthly":
					s = true;
					break;
				case "Yearly":
					y = true;
					break;
				case "Monthly":
					m = true;
					break;
			}
		}

		if (w) return "Weekly";
		if (m) return "Monthly";
		if (q) return "Quarterly";
		if (s) return "SixMonthly";
		if (y) return "Yearly";

	};


	self.longestPeriod = function (periodTypes) {
		var w = false,
			m = false,
			q = false,
			s = false,
			y = false,
			pt;
		for (var i = 0; i < periodTypes.length; i++) {
			pt = periodTypes[i];
			switch (pt) {
				case "Quarterly":
					q = true;
					break;
				case "Weekly":
					w = true;
					break;
				case "SixMonthly":
					s = true;
					break;
				case "Yearly":
					y = true;
					break;
				case "Monthly":
					m = true;
					break;
			}
		}
		if (y) return "Yearly";
		if (s) return "SixMonthly";
		if (q) return "Quarterly";
		if (m) return "Monthly";
		if (w) return "Weekly";
	};


	self.getSubPeriods = function (period, periodType) {

		var pt = self.periodTypeFromPeriod(period);
		if (pt === periodType) return [period];


		//Need start and end date of the given period
		var year = yearFromISOPeriod(period);
		var thisYear = parseInt(moment().format("YYYY"));
		var sourcePeriods = periodTool.get(pt).generatePeriods({
			"offset": year - thisYear,
			"filterFuturePeriods": true,
			"reversePeriods": false
		});

		var startDate, endDate;
		for (var i = 0; i < sourcePeriods.length; i++) {
			if (sourcePeriods[i].iso === period) {
				startDate = sourcePeriods[i].startDate;
				endDate = sourcePeriods[i].endDate;
				break;
			}
		}

		return self.getISOPeriods(startDate, endDate, periodType);
	};


	self.precedingPeriods = function (periodISO, number) {
		if (typeof (periodISO) != "string") periodISO = periodISO.toString();

		var period = periodObjectFromISOPeriod(periodISO);
		var pType = self.periodTypeFromPeriod(periodISO);


		var startDate = reverseDateByPeriod(period.startDate, number, pType);
		var endDate = moment(period.startDate).subtract(1, "d");

		return self.getISOPeriods(dateToISOdate(startDate), dateToISOdate(endDate), pType);

	};


	function reverseDateByPeriod(ISOdate, noPeriods, periodType) {

		var code;
		switch (periodType) {
			case "Quarterly":
				code = "Q";
				break;
			case "Weekly":
				code = "w";
				break;
			case "SixMonthly":
				code = "Q";
				noPeriods = noPeriods * 2; //Need to cheat
				break;
			case "Yearly":
				code = "y";
				break;
			case "Monthly":
				code = "M";
				break;
		}

		return moment(ISOdate).subtract(noPeriods, code);



	}


	function periodObjectFromISOPeriod(period) { //changed
		var pType = self.periodTypeFromPeriod(period);
		var year = yearFromISOPeriod(period);
		var thisYear = thisYear();

		var periodsInYear = periodTool.get(pType).generatePeriods({
			"offset": year - thisYear,
			"filterFuturePeriods": true,
			"reversePeriods": false
		});
		for (var i = 0; i < periodsInYear.length; i++) {
			if (periodsInYear[i].iso === period) {
				return periodsInYear[i];
			}
		}
	}

	/**
	 * returns this year as an intiger
	 */
	function thisYear() { //changed
		return EthiopianCalendar.newDate().year();
	}

	function yearFromISOPeriod(period) { //changed

		if (typeof (period) != "string") period = period.toString();
		return parseInt(period.substring(0, 4));

	}


	function dateToISOdate(date) { //changed
		//here if a string is recieved we assume it is in the form yyyy-mm-dd
		if (typeof (date) === 'string' && date.length === 10) {
			return EthiopianCalendar.newDate(parseInt(date.substring(0, 4)), parseInt(date.substring(5, 7)), parseInt(date.substring(8, 10)))
		} else if (typeof (date) === 'string' && date.length === 8) { //here the form yyyymmdd is considered
			return EthiopianCalendar.newDate(parseInt(date.substring(0, 4)), parseInt(date.substring(4, 6)), parseInt(date.substring(6, 8)))
		}
		return EthiopianCalendar.newDate(date)
	}


	return self;


}