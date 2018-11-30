const fs = require('fs');
var request = require('request-promise');

let mediumURL = 'https://medium.com/';
let profileId = 'federicojordn';
const limit = 100
let fullURL = `${mediumURL}@${profileId}/latest?format=json&limit=${limit}`;
let outputFile = `${__dirname}/../output/response.json`;


console.log('Loading Medium feed...');
request(fullURL).then((response) => {
	const stringToReplace = '])}while(1);</x>';
	const finalResponse = response.replace(stringToReplace, '');
	
	console.log('Writing into response.json...');
	
	fs.writeFile(outputFile, finalResponse, function(err) {
	    if(err) {
	        return console.log(err);
	    } else {
	    	console.log('Done!');
	    }
	}); 
}).catch((error) => {
	console.log(error);
});