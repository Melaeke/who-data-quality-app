/**
 © Copyright 2017 the World Health Organization (WHO).

 This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3),
 copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and
 immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
 */

export default function (BASE_URL, API_VERSION, $q) {

	var self = this;

	self.getMultiple = function(requestURLs) {

		var promises = requestURLs.map(async function(request) {

			var fullURL = BASE_URL + "/api/" + API_VERSION + request;
			fullURL = encodeURI(fullURL);

			const def = $q.defer();

			try {
				const response = await fetch(fullURL);
				if ( response.ok ) {
					const json = await response.json();
					def.resolve(json);
				} else {
					def.reject(null);
				}
			} catch ( err ) {
				def.reject(err);
			}

			return def.promise;
		});

		return $q.all(promises);
	};

	self.getSingle = async function(requestURL) {
		console.log("getSingle");

		var fullURL = BASE_URL + "/api/" + API_VERSION + requestURL;
		fullURL = encodeURI(fullURL);

		var deferred = $q.defer();

		try {
			const response = await fetch(fullURL);

			if ( response.ok ) {
				const json = await response.json();
				deferred.resolve({data: json, status: response.status, config: {url: fullURL}});
			} else {
				deferred.reject(null);
			}
		} catch ( err ) {
			deferred.reject(err);
		}

		return deferred.promise;
	};


	self.getSingleData = async function(requestURL) {

		var deferred = $q.defer();

		var fullURL = BASE_URL + "/api/" + API_VERSION + requestURL;
		fullURL = encodeURI(fullURL);

		try { 
			const response = await fetch(fullURL);

			if ( response.ok ) {
				const json = response.json();
				deferred.resolve(json);
			} else {
				deferred.reject(null);
			}
		} catch ( err ) {
			deferred.reject(err);
		}

		return deferred.promise;
	};



	self.getSingleLocal = async function(requestURL) {
		
		const def = $q.defer();

		try {
			const response = await fetch(encodeURI(requestURL));
			if ( response.ok ) {
				const json = response.json();
				def.resolve(json);
			} else {
				def.reject(null);
			}
		} catch ( err ) {
			def.reject(err);
		}
		
		return def.promise;
	};


	self.post = async function (postURL, data) {
		var fullURL = BASE_URL + "/api/" + API_VERSION + postURL;
		fullURL = encodeURI(fullURL);

		const def = $q.defer();

		try {
			const response = await fetch(fullURL, {
				method: "POST",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json"
				},
				credentials: "include",
				body: data
			});

			if ( response.ok ) {
				const json = await response.json();
				def.resolve(json);
			} else {
				def.reject(null);
			}

		} catch ( err ) { 
			def.reject(err);
		}

		return def.promise;
	};

	self.put = async function(postURL, data) {
		var fullURL = BASE_URL + "/api/" + API_VERSION + postURL;
		fullURL = encodeURI(fullURL);

		const def = $q.defer();

		try {
			const response = await fetch(fullURL, {
				method: "PUT",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json"
				},
				credentials: "include",
				body: data
			});

			if ( response.ok ) {
				const json = await response.json();
				def.resolve(json);
			} else {
				def.reject(null);
			}

		} catch ( err ) { 
			def.reject(err);
		}

		return def.promise;
	};

	self.validResponse = function(response) {
		//TODO - need to decide how to handle this better in general
		if (Object.prototype.toString.call(response) === "[object Array]") return true;


		var data = response.data;
		var status = response.status;
		if (status != 200) {
			//TODO: Should split it instead
			if (status === 409 && (data.indexOf("Table exceeds") > -1)) {
				console.log("Query result too big");
			}

			//No children for this boundary ou - no worries..
			else if (status === 409 && (data.indexOf("Dimension ou is present") > -1)) {
				console.log("Requested child data for a unit without children");
			}

			//Probably time out - try again
			else if (status === 0) {
				console.log("Timout - retrying");
			}

			else if (status === 302 && typeof(response.data) === "string" && response.data.indexOf("class=\"loginPage\"") >= 0) {
				console.log("User has been logged out");
				window.location = BASE_URL + "/dhis-web-dashboard-integration/index.action";
			}

			//Unknown error
			else {
				console.log("Unknown error while fetching data: " + response.statusText);
			}
			return false;
		}
		else if (typeof(response.data) === "string" && response.data.indexOf("class=\"loginPage\"") >= 0) {
			console.log("User has been logged out");
			window.location = BASE_URL + "/dhis-web-dashboard-integration/index.action";
			return false;
		}
		return true;
	};


	return self;

}