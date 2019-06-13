
/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3),
copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and
immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

import {react2angular} from 'react2angular';

import ChartLoadingPlaceholder from "./chartLoadingPlaceholder.jsx"



(function(angular) {

	angular.module("appCommons")
		.component("chartLoadingPlaceholder", react2angular(ChartLoadingPlaceholder))
		/*.directive("chartLoadingPlaceholder", () => ({
            restrict: "E",
            template: require("./chartLoadingPlaceholder.html")
		}));*/

})(angular);