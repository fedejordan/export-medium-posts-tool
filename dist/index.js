'use strict';

var _nodeHtmlParser = require('node-html-parser');

var request = require('request-promise');

var mediumURL = 'https://medium.com/';
var profileId = 'federicojordn';

var profileURL = mediumURL + '@' + profileId;

// console.log(profileURL);

request(profileURL).then(function (response) {
	// console.log(response);
	var root = (0, _nodeHtmlParser.parse)(response);
	console.log(root.firstChild.structure);
}).catch(function (error) {
	console.log(error);
});