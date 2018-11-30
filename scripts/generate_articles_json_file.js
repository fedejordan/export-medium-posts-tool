const responseJSON = require('../output/response.json');
const fs = require('fs');
var moment = require('moment');

let mediumURL = 'https://medium.com/';
let profileId = 'federicojordn';
const articlesDict = responseJSON.payload.references.Post;

console.log('Parsing response.json');

const articlesIds = Object.keys(articlesDict);
const articles = articlesIds.map((articleId) => {
	const articleDict = articlesDict[articleId]; 
	const uniqueSlug = articleDict.uniqueSlug;
	const fullUrl = `${mediumURL}@${profileId}/${uniqueSlug}`;
	const title = articleDict.title;
	const description = articleDict.content.subtitle;
	const timestamp = articleDict.firstPublishedAt;
	const date = moment(timestamp).format("MMM DD");
	return {
		date,
		title,
		url: fullUrl,
		description,
		timestamp
	}
});

console.log('Creating articles.json');
const articlesJSON = JSON.stringify({articles});
const outputFile = `${__dirname}/../output/articles.json`;
fs.writeFile(outputFile, articlesJSON, function(err) {
	    if(err) {
	        return console.log(err);
	    } else {
	    	console.log('Done!');
	    }
	}); 

// urls.forEach((url) => console.log(url));

