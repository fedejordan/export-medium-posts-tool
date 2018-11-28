const { parse } = require('node-html-parser');
var request = require('request-promise');

let mediumURL = 'https://medium.com/';
let profileId = 'federicojordn';

let profileURL = `${mediumURL}@${profileId}`;

// console.log(profileURL);

request(profileURL).then((response) => {
	// console.log(response);
	const root = parse(response);
	console.log(root.firstChild.structure);
}).catch((error) => {
	console.log(error);
});