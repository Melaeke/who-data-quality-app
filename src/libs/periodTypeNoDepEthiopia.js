require("../libs/jquery.calendars.js")
require("../libs/jquery.calendars.plus.js")
require("../libs/jquery.calendars.ethiopian.min.js")
var EthiopianCalendar = new $.calendars.calendars.ethiopian

export default function PeriodType() {
	var monthNames = ["Meskerem", "Tikemet", "Hidar", "Tahesas", "Tir", "Yekatit",
			"Megabit", "Miazia", "Genbot", "Sene", "Hamle", "Nehase", "Pagume"
		],

		filterFuturePeriods = function (periods) {
			var array = [],
				now = EthiopianCalendar.newDate();

			for (let i = 0; i < periods.length; i++) {
				//all start date is in the form yyyymmdd
				let theDate = periods[i]['startDate'];
				if (EthiopianCalendar.newDate(theDate.substring(0, 4), theDate.substring(4, 6), theDate.substring(6, 8)) <= now) {
					array.push(periods[i]);
				}
			}

			return array;
		};

	var periodTypes = [];
	/**
	 * Support only the major ones which are in the Ethiopian branch
	 */
	//periodTypes["Daily"] = new DailyPeriodType(format_yyyymmdd, filterFuturePeriods);
	//periodTypes["Weekly"] = new WeeklyPeriodType(format_yyyymmdd, filterFuturePeriods);
	periodTypes["Monthly"] = new MonthlyPeriodType(filterFuturePeriods);
	periodTypes["BiMonthly"] = new BiMonthlyPeriodType(filterFuturePeriods);
	periodTypes["Quarterly"] = new QuarterlyPeriodType(filterFuturePeriods);
	periodTypes["SixMonthly"] = new SixMonthlyPeriodType(filterFuturePeriods);
	periodTypes["SixMonthlyApril"] = new SixMonthlyAprilPeriodType(filterFuturePeriods);
	periodTypes["SixMonthlyNovember"] = new SixMonthlyNovemberPeriodType(filterFuturePeriods);
	periodTypes["Yearly"] = new YearlyPeriodType(filterFuturePeriods);
	periodTypes["FinancialOct"] = new FinancialOctoberPeriodType(filterFuturePeriods);
	periodTypes["FinancialJuly"] = new FinancialJulyPeriodType(filterFuturePeriods);
	periodTypes["FinancialApril"] = new FinancialAprilPeriodType(filterFuturePeriods);
	periodTypes["FinancialNov"] = new FinancialNovemberPeriodType(filterFuturePeriods);

	this.get = function (key) {
		return periodTypes[key];
	};

	//Should be sorted from shortest to longest
	this.getAllPeriodTypes = function () { //changed but need to add into i18next
		let allPeriodTypes = [
			//{"name": 'Weeks'), "id":"Weekly"},
			{
				"name": 'Months',
				"id": "Monthly"
			},
			{
				"name": 'BiMonthly',
				"id": "BiMonthly"
			},
			{
				"name": 'Quarters',
				"id": "Quarterly"
			},
			{
				"name": 'Six-months',
				"id": "SixMonthly"
			},
			{
				"name": 'SixMonthlyApril',
				"id": "SixMonthlyApril"
			},
			{
				"name": 'SixMonthlyNovember',
				"id": "SixMonthlyNovember"
			},
			{
				"name": 'Years',
				"id": "Yearly"
			},
			{
				"name": 'FinancialApril',
				"id": "FinancialApril"
			},
			{
				"name": 'FinancialJuly',
				"id": "FinancialJuly"
			},
			{
				"name": 'FinancialOct',
				"id": "FinancialOct"
			},
			{
				"name": 'FinancialNov',
				"id": "FinancialNov"
			}
		];
		return allPeriodTypes
	}
}


function MonthlyPeriodType(fnFilter) { //changed

	this.generatePeriods = function (config) {
			var periods = [],
				offset = parseInt(config.offset),
				isFilter = config.filterFuturePeriods,
				isReverse = config.reversePeriods,
				year = EthiopianCalendar.newDate().year() + offset,
				date = EthiopianCalendar.newDate(year, 12, 30);

			while (date.year() === year) {
				var period = {};
				period["endDate"] = date.formatDate('yyyymmdd');
				date.set(1, 'd');
				period["startDate"] = date.formatDate('yyyymmdd');
				period["name"] = date.formatDate("MM yyyy");
				//period['id'] = 'Monthly_' + period['startDate'];
				period["iso"] = date.formatDate('yyyymm')
				period["id"] = period["iso"];
				periods.push(period);
				date.add(-1, 'd');

			}

			periods = isFilter ? fnFilter(periods) : periods;
			periods = isReverse ? periods : periods.reverse();
			// Months are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.

			return periods;
		},
		this.getPeriodNameFromISO = function (periodIso) {
			let startDate = EthiopianCalendar.newDate(periodIso.substring(0, 4), periodIso.substring(4, 6), 1)
			return startDate.formatDate('MM yyyy');
		};
}

function BiMonthlyPeriodType(fnFilter) { //changed
	this.generatePeriods = function (config) {
			var periods = [],
				offset = parseInt(config.offset),
				isFilter = config.filterFuturePeriods,
				isReverse = config.reversePeriods,
				year = EthiopianCalendar.newDate().year() + offset;

			for (var month = 1, idx = 1; month < getMonthsinYear(year); month += 2, idx++) {
				var period = {};
				let startDate = EthiopianCalendar.newDate(year, month, 1);
				let endDate = EthiopianCalendar.newDate(startDate).set(month + 1, 'm').set(30, 'd');

				period['startDate'] = startDate.formatDate('yyyymmdd');
				period['endDate'] = endDate.formatDate('yyyymmdd');
				period['name'] = startDate.formatDate('MM') + ' - ' + endDate.formatDate('MM') + ' ' + year;
				period["iso"] = startDate.formatDate('yyyy') + '0' + idx + 'B';
				period["id"] = period["iso"];
				periods.push(period);
			}

			periods = isFilter ? fnFilter(periods) : periods;
			periods = isReverse ? periods : periods.reverse();
			// Bi-months are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.

			return periods;
		},
		this.getPeriodNameFromISO = function (periodIso) {
			let monthNumber = parseInt(periodIso.substring(4, 6)) * 2 - 1;

			let startDate = EthiopianCalendar.newDate(periodIso.substring(0, 4), monthNumber, 1)
			let endDate = EthiopianCalendar.newDate(startDate).set(monthNumber + 1, 'm').set(30, 'd')
			return startDate.formatDate('MM') + ' - ' + endDate.formatDate('MM yyyy');
		};
}

function QuarterlyPeriodType(fnFilter) { //changed
	this.generatePeriods = function (config) {
			var periods = [],
				offset = parseInt(config.offset),
				isFilter = config.filterFuturePeriods,
				isReverse = config.reversePeriods,
				year = EthiopianCalendar.newDate().year() + offset,
				quarter = 4;

			var monthOffset = -2;
			for (var month = 1, idx = 1; month <= 12; month += 3, idx++) {
				let sm = month + monthOffset;
				var sy = year;

				if (sm < 0) {
					sm = sm + 12;
					sy = sy - 1;
				}

				let em = sm + 2;
				let ey = sy;
				if (em > 12) {
					em = 1;
					ey = ey + 1;
				}

				let startDate = EthiopianCalendar.newDate(sy, sm, 1);
				let endDate = EthiopianCalendar.newDate(ey, em, 30);

				var period = {};
				period['startDate'] = startDate.formatDate('yyyymmdd');
				period['endDate'] = endDate.formatDate('yyyymmdd');

				period['name'] = 'Q' + idx + '[' + startDate.formatDate('MM yyyy') + ' - ' + endDate.formatDate('MM yyyy') + ']';
				period['iso'] = endDate.formatDate('yyyy') + 'Q' + idx;
				period['id'] = period['iso'];

				periods.push(period);
			}

			periods = isFilter ? fnFilter(periods) : periods;
			periods = isReverse ? periods : periods.reverse();
			// Quarters are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.

			return periods;
		},
		this.getPeriodNameFromISO = function (periodIso) {
			let quarterIndex = parseInt(periodIso.substring(5, 6))
			//this gives monthNumber = quarter number * 3 - 2 -2(this -2 is the offset introduced by Ethiopian calendar because it starts from July prev year.)
			let startingMonth = quarterIndex * 3 - 2 - 2;
			let startingYear = parseInt(periodIso.substring(0, 4));

			if (startingMonth < 0) {
				startingMonth = startingMonth + 12;
				startingYear = startingYear - 1;
			}
			let endingMonth = startingMonth + 2;
			let endingYear = startingYear;
			if (endingMonth > 12) {
				endingMonth = 1;
				endingYear = endingYear + 1;
			}
			let startDate = EthiopianCalendar.newDate(startingYear, startingMonth, 1);
			let endDate = EthiopianCalendar.newDate(endingYear, endingMonth, 30)
			return 'Q' + quarterIndex + '[' + startDate.formatDate('MM yyyy') + ' - ' + endDate.formatDate('MM yyyy') + ']'
		};
}

function SixMonthlyPeriodType(fnFilter) { //changed
	this.generatePeriods = function (config) {
			var periods = [],
				offset = parseInt(config.offset),
				isFilter = config.filterFuturePeriods,
				isReverse = config.reversePeriods,
				year = EthiopianCalendar.newDate().year() + offset;

			let startDate = EthiopianCalendar.newDate(year, 1, 1);
			let endDate = EthiopianCalendar.newDate(year, 6, 30);
			var period = {};
			period["startDate"] = startDate.formatDate('yyyymmdd')
			period["endDate"] = startDate.formatDate('yyyymmdd');
			period["name"] = startDate.formatDate('MM') + " - " + endDate.formatDate('MM yyyy');
			//period['id'] = 'SixMonthly_' + period['startDate'];
			period["iso"] = year + "S1";
			period["id"] = period["iso"];
			periods.push(period);

			period = {};
			startDate.set(7, 'm')
			endDate.set(12, 'm');
			period["startDate"] = startDate.formatDate('yyyymmdd')
			period["endDate"] = endDate.formatDate('yyyymmdd')
			period["name"] = startDate.formatDate('MM') + " - " + endDate.formatDate("MM yyyy");
			//period['id'] = 'SixMonthly_' + period['startDate'];
			period["iso"] = year + "S2";
			period["id"] = period["iso"];
			periods.push(period);

			periods = isFilter ? fnFilter(periods) : periods;
			periods = isReverse ? periods.reverse() : periods;

			return periods;
		},
		this.getPeriodNameFromISO = function (periodIso) {
			let periodIndex = parseInt(periodIso.substring(5, 6))
			let startingMonth = periodIndex * 6 - 5;
			let startingYear = parseInt(periodIso.substring(0, 4));

			let startDate = EthiopianCalendar.newDate(startingYear, startingMonth, 1);
			let endDate = EthiopianCalendar.newDate(startingYear, startingMonth === 1 ? 6 : 12, 30)
			return startDate.formatDate('MM') + ' - ' + endDate.formatDate('MM yyyy')
		};
}

function SixMonthlyAprilPeriodType(fnFilter) { //changed
	this.generatePeriods = function (config) {
			var periods = [],
				offset = parseInt(config.offset),
				isFilter = config.filterFuturePeriods,
				isReverse = config.reversePeriods,
				year = EthiopianCalendar.newDate().year() + offset;

			var period = {};

			let startDate = EthiopianCalendar.newDate(year, 4, 1);
			let endDate = EthiopianCalendar.newDate(year, 9, 30);

			period["startDate"] = startDate.formatDate('yyyymmdd');
			period["endDate"] = endDate.formatDate('yyyymmdd')
			period["name"] = startDate.formatDate('MM') + " - " + endDate.formatDate('MM') + " " + year;
			//period['id'] = 'SixMonthlyApril_' + period['startDate'];
			period["iso"] = year + "AprilS1";
			period["id"] = period["iso"];
			periods.push(period);

			period = {};
			startDate.set(10, 'm');
			endDate.set(year + 1, 'y').set(3, 'm')

			period["startDate"] = startDate.formatDate('yyyymmdd')
			period["endDate"] = endDate.formatDate('yyyymmdd')
			period["name"] = startDate.formatDate('MM yyyy') + " - " + endDate.formatDate('MM yyyy');
			//period['id'] = 'SixMonthlyApril_' + period['startDate'];
			period["iso"] = startDate.formatDate('yyyy') + "AprilS2"
			period["id"] = period["iso"];
			periods.push(period);

			periods = isFilter ? fnFilter(periods) : periods;
			periods = isReverse ? periods.reverse() : periods;

			return periods;
		},
		this.getPeriodNameFromISO = function (periodIso) {
			let periodIndex = parseInt(periodIso.substring(10, 11))
			let startingYear = parseInt(periodIso.substring(0, 4));

			let startDate = EthiopianCalendar.newDate(startingYear, periodIndex === 1 ? 4 : 10, 1);
			let endDate = EthiopianCalendar.newDate(periodIndex === 1 ? startingYear : startingYear + 1, periodIndex === 1 ? 9 : 3, 30)
			return startDate.formatDate('MM yyyy') + ' - ' + endDate.formatDate('MM yyyy')
		};
}

function SixMonthlyNovemberPeriodType(fnFilter) { //changed
	this.generatePeriods = function (config) {
			var periods = [],
				offset = parseInt(config.offset),
				isFilter = config.filterFuturePeriods,
				isReverse = config.reversePeriods,
				year = EthiopianCalendar.newDate().year() + offset;

			var period = {};
			year = year - 1;
			let startDate = EthiopianCalendar.newDate(year, 11, 1);
			let endDate = EthiopianCalendar.newDate(year + 1, 4, 30);

			period["startDate"] = startDate.formatDate('yyyymmdd')
			period["endDate"] = endDate.formatDate('yyyymmdd')
			period["name"] = startDate.formatDate('MM yyyy') + " - " + endDate.formatDate('MM yyyy');
			//period['id'] = 'SixMonthlyApril_' + period['startDate'];
			period["iso"] = endDate.formatDate('yyyy') + "NovS1";
			period["id"] = period["iso"];
			periods.push(period);

			period = {};
			year = year + 1
			startDate.set(year, 5, 1)
			endDate.set(year, 10, 30);

			period["startDate"] = startDate.formatDate('yyyymmdd');
			period["endDate"] = endDate.formatDate('yyyymmdd');
			period["name"] = startDate.formatDate('MM yyyy') + " - " + endDate.formatDate('MM yyyy');
			//period['id'] = 'SixMonthlyApril_' + period['startDate'];
			period["iso"] = endDate.formatDate('yyyy') + "NovS2";
			period["id"] = period["iso"];
			periods.push(period);

			periods = isFilter ? fnFilter(periods) : periods;
			periods = isReverse ? periods.reverse() : periods;

			return periods;
		},
		this.getPeriodNameFromISO = function (periodIso) {
			let periodIndex = parseInt(periodIso.substring(8, 9))
			let startingYear = parseInt(periodIso.substring(0, 4));

			let startDate = EthiopianCalendar.newDate(periodIndex === 1 ? startingYear : startingYear + 1, periodIndex === 1 ? 11 : 5, 1);
			let endDate = EthiopianCalendar.newDate(startingYear + 1, periodIndex === 1 ? 4 : 10, 30)
			return startDate.formatDate('MM yyyy') + ' - ' + endDate.formatDate('MM yyyy')
		};
}

function YearlyPeriodType(fnFilter) { //changed
	this.generatePeriods = function (config) {
			var periods = [],
				offset = parseInt(config.offset),
				isFilter = config.filterFuturePeriods,
				isReverse = config.reversePeriods,
				year = EthiopianCalendar.newDate().year() + offset;

			//generate 8 years from past and 2 years into the future
			for (let i = -8; i < 2; i++) {
				var period = {};
				let startDate = EthiopianCalendar.newDate(year + i, 1, 1);
				let endDate = EthiopianCalendar.newDate(year + i, 12, 30);

				period["startDate"] = startDate.formatDate('yyyymmdd');
				period["endDate"] = endDate.formatDate('yyyymmdd');
				period["name"] = startDate.formatDate('yyyy');
				//period['id'] = 'Yearly_' + period['startDate'];
				period["iso"] = startDate.formatDate('yyyy');
				period["id"] = period["iso"].toString();
				periods.push(period);
			}

			periods = isFilter ? fnFilter(periods) : periods;
			periods = isReverse ? periods : periods.reverse();
			// Years are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.

			return periods;
		},
		this.getPeriodNameFromISO = function (periodIso) {
			//there is no further processing. The iso is the name
			return periodIso.toString().substring(0, 4);
		};
}

function FinancialPeriodGenerators(fnFilter, config, monthOffset, monthShortName, periodType) { //changed
	var periods = [],
		offset = parseInt(config.offset),
		year = EthiopianCalendar.newDate().year() + offset;

	let startDate = EthiopianCalendar.newDate(year - 10, monthOffset, 1);
	for (let i = 0; i < 10; i++) {
		var period = {};
		let endDate = EthiopianCalendar.newDate(startDate).add(1, 'y').add(-1, 'd');

		period['startDate'] = startDate.formatDate('yyyymmdd');
		period['endDate'] = endDate.formatDate('yyyymmdd');
		period["name"] = startDate.formatDate('MM yyyy') + " - " + endDate.formatDate('MM yyyy');
		let isoDate = periodType === 'FinancialNov' ? endDate.formatDate('yyyy') : startDate.formatDate('yyyy');

		period['iso'] = isoDate + monthShortName;
		period['id'] = isoDate + monthShortName;
		periods.push(period);
		startDate.add(1, 'y');
	}
	return periods;
}

function FinancialOctoberPeriodType(fnFilter) { //changed
	this.generatePeriods = function (config) {
			var periods = [],
				isFilter = config.filterFuturePeriods,
				isReverse = config.reversePeriods;

			periods = FinancialPeriodGenerators(fnFilter, config, 10, 'Oct', 'FinancialOct');

			periods = isFilter ? fnFilter(periods) : periods;
			periods = isReverse ? periods : periods.reverse();
			// FinancialOctober periods are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.

			return periods;
		},
		this.getPeriodNameFromISO = function (periodIso) {
			let year = parseInt(periodIso.substring(0, 4));
			let startDate = EthiopianCalendar.newDate(year, 10, 1);
			let endDate = EthiopianCalendar.newDate(startDate).add(1, 'y').add(-1, 'd');
			return startDate.formatDate('MM yyyy') + ' - ' + endDate.formatDate('MM yyyy')
		};
}

function FinancialJulyPeriodType(fnFilter) { //changed
	this.generatePeriods = function (config) {
			var periods = [],
				isFilter = config.filterFuturePeriods,
				isReverse = config.reversePeriods;
			periods = FinancialPeriodGenerators(fnFilter, config, 7, 'July', 'FinancialJuly');

			periods = isFilter ? fnFilter(periods) : periods;
			periods = isReverse ? periods : periods.reverse();
			// FinancialJuly periods are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.

			return periods;
		},
		this.getPeriodNameFromISO = function (periodIso) {
			let year = parseInt(periodIso.substring(0, 4));
			let startDate = EthiopianCalendar.newDate(year, 7, 1);
			let endDate = EthiopianCalendar.newDate(startDate).add(1, 'y').add(-1, 'd');
			return startDate.formatDate('MM yyyy') + ' - ' + endDate.formatDate('MM yyyy')
		};
}

function FinancialAprilPeriodType(fnFilter) { //changed
	this.generatePeriods = function (config) {
			var periods = [],
				isFilter = config.filterFuturePeriods,
				isReverse = config.reversePeriods;
			periods = FinancialPeriodGenerators(fnFilter, config, 4, 'April', 'FinancialApril');

			periods = isFilter ? fnFilter(periods) : periods;
			periods = isReverse ? periods : periods.reverse();
			// FinancialApril periods are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.

			return periods;
		},
		this.getPeriodNameFromISO = function (periodIso) {
			let year = parseInt(periodIso.substring(0, 4));
			let startDate = EthiopianCalendar.newDate(year, 4, 1);
			let endDate = EthiopianCalendar.newDate(startDate).add(1, 'y').add(-1, 'd');
			return startDate.formatDate('MM yyyy') + ' - ' + endDate.formatDate('MM yyyy')
		};
}

function FinancialNovemberPeriodType(fnFilter) { //changed
	this.generatePeriods = function (config) {

			var periods = [],
				isFilter = config.filterFuturePeriods,
				isReverse = config.reversePeriods;
			periods = FinancialPeriodGenerators(fnFilter, config, 11, 'Nov', 'FinancialNov');

			periods = isFilter ? fnFilter(periods) : periods;
			periods = isReverse ? periods : periods.reverse();
			// FinancialApril periods are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.

			return periods;
		},
		this.getPeriodNameFromISO = function (periodIso) {
			let year = parseInt(periodIso.substring(0, 4)) - 1; //because it starts from Hamle last year
			let startDate = EthiopianCalendar.newDate(year, 11, 1);
			let endDate = EthiopianCalendar.newDate(startDate).add(1, 'y').add(-1, 'd');
			return startDate.formatDate('MM yyyy') + ' - ' + endDate.formatDate('MM yyyy')
		};
}

function getMonthsinYear(calendar, year) {
	return 12; //do not consider puagme
}