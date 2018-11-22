var request = require('request-promise');

let mediumURL = 'https://medium.com/';
let profileId = 'federicojordn';

let profileURL = `${mediumURL}@${profileId}`;

// console.log(profileURL);

request(profileURL).then((response) => {
	console.log(response);
})
.catch((error) => {
	console.log(error);
});