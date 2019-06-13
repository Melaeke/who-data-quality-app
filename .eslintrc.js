module.exports = {
    "env": {
        "browser": true,
        "es6": true
	},
    "extends": "eslint:recommended",
    "parserOptions": {
		"ecmaVersion": 2017,
		"sourceType": "module",
		"ecmaFeatures": {
			"experimentalObjectRestSpread": true
		}
    },
    "rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"no-console": "off",
		"react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
	},
	"globals": {
		"angular": true,
		"require": true,
		"d3": true
	}
};
