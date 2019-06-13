/**
 © Copyright 2017 the World Health Organization (WHO).

 This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3),
 copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and
 immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
 */
"use strict";

const dhisDevConfig = DHIS_CONFIG; // eslint-disable-line

import "jquery";
import "angular";
import "angular-animate";
import "angular-bootstrap-nav-tree";
import "angular-nvd3";
import "angular-route";
import "angular-sanitize";
import "angular-ui-bootstrap";
import "ui-select";

import "d3";
import "nvd3";

import "file-saver";
import "blob";

import i18next from "i18next";
import i18nextResources from "../i18n/resources";
import "ng-i18next";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import "angular-ui-bootstrap/dist/ui-bootstrap-csp.css";
import "angular-bootstrap-nav-tree/dist/abn_tree.css";
import "ui-select/dist/select.css";
import "nvd3/build/nv.d3.css";


import "./libs/prototypes.js";

//Core services
import "./appCommons/appCommons.js";
import "./appCore/appService.js";
import "./appCore/d2.js";
import "./appCore/dqAnalysis.js";

//Modules
import "./moduleDashboard/dashboard.js";
import "./moduleAdmin/admin.js";
import "./moduleReview/review.js";
import "./moduleConsistency/consistencyAnalysis.js";
import "./moduleOutlierGap/outlierAnalysis.js";

import "./moduleExport/export.js";

//import "./moduleAbout/About.jsx";
import { react2angular } from "react2angular";
import About from "./moduleAbout/About.jsx";

//CSS
import "./css/style.css";

var app = angular.module("dataQualityApp",
	["ngAnimate", "ngSanitize", "ngRoute", "ui.select", "jm.i18next", "dqAnalysis", "dashboard", "review",
		"consistencyAnalysis", "outlierGapAnalysis", "dataExport",
		"admin", "appService", "appCommons"]);

angular.module("dataQualityApp").component("about", react2angular(About));

/**Bootstrap*/
angular.element(document).ready(
	function() {

		fetch("manifest.webapp").then(
			function(response) {

				const json = response.json();

				//Not production => rely on webpack-dev-server proxy
				// eslint-disable-next-line no-undef
				const baseUrl = process.env.NODE_ENV === "production" ? json.activities.dhis.href : "";
				app.constant("BASE_URL", baseUrl);
				app.constant("API_VERSION", "29");
				angular.bootstrap(document, ["dataQualityApp"]);
			}
		);

		i18next
			.init({
				returnEmptyString: false,
				fallbackLng: false,
				keySeparator: "|",
				resources: i18nextResources
			});
		window.i18next = i18next;
	}
);

/**Config*/
app.config(["uiSelectConfig", function(uiSelectConfig) {
	uiSelectConfig.theme = "bootstrap";
	uiSelectConfig.resetSearchInput = true;
}]);


app.config(["$locationProvider", function($locationProvider) {
	$locationProvider.hashPrefix("");
}]);


app.config(["$routeProvider",
	function($routeProvider) {
		$routeProvider.
			when("/dashboard", {
				template: require("./moduleDashboard/dashboard.html"),
				controller: "DashboardController",
				controllerAs: "dashCtrl"
			}).
			when("/consistency", {
				template: require("./moduleConsistency/consistencyAnalysis.html"),
				controller: "ConsistencyAnalysisController",
				controllerAs: "aCtrl"
			}).
			when("/outlier_gap", {
				template: require("./moduleOutlierGap/viewOutlierAnalysis.html"),
				controller: "OutlierGapAnalysisController",
				controllerAs: "aCtrl"
			}).
			when("/review", {
				template: require("./moduleReview/review.html"),
				controller: "ReviewController",
				controllerAs: "revCtrl"

			}).
			when("/about", {
				template: "<about />"
			}).
			when("/export", {
				template: require("./moduleExport/export.html"),
				controller: "ExportController",
				controllerAs: "exportCtrl"
			}).
			when("/admin", {
				template: require("./moduleAdmin/admin.html"),
				controller: "AdminController",
				controllerAs: "admCtrl"
			}).
			otherwise({
				redirectTo: "/dashboard"
			});
	}]
);


/**Controller: Navigation*/
app.controller("NavigationController",
	["BASE_URL", "$location", "$window", "notificationService",
		function(BASE_URL, $location, $window, notificationService) {
			var self = this;

			self.validBrowser = (navigator.userAgent.indexOf("MSIE 9") >= 0
				|| navigator.userAgent.indexOf("MSIE 8") >= 0
				|| navigator.userAgent.indexOf("MSIE 7") >= 0) ? false : true;

			if (!self.validBrowser) notificationService.notify("Warning", "This browser is not supported. Please upgrade to a recent version of " +
				"Google Chrome or Mozilla Firefox.");


			self.isCollapsed = true;
			self.navClass = function (page) {
				var currentRoute = $location.path().substring(1) || "dashboard";
				return page === currentRoute ? "active" : "";
			};

			self.collapse = function() {
				this.isCollapsed = !this.isCollapsed;
			};

			self.exit = function() {
				$window.open(BASE_URL, "_self");
			};

			return self;
		}]);


app.run(["BASE_URL", async function(BASE_URL) {
	const settings = await getUserSettings(BASE_URL);
	i18next.changeLanguage(settings.keyUiLocale);
}]);

const getUserSettings = (baseUrl) => {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await fetch(`${baseUrl}/api/userSettings.json`);
			resolve(response.json());
		} catch ( err ) {
			reject(err);
		}
	});
};