const mediumToMarkdown = require('medium-to-markdown');
 const fs = require('fs');
// // Enter url here
// mediumToMarkdown.convertFromUrl('<medium post url>')
// .then(function (markdown) {
//   console.log(markdown); //=> Markdown content of medium post
// });

const articlesFile = require('../output/articles.json');
const urls = articlesFile.articles.map((article) => article.url);
articlesFile.articles.forEach((article) => {
	console.log(`Generating markdown of ${article.title}`);
	mediumToMarkdown.convertFromUrl(article.url)
	.then((markdown) => {
		var array = article.url.split('-')
		var articleId = array[array.length-1];
		fs.writeFile(`${__dirname}/../output/articles/${articleId}.markdown`, markdown, function(err) {
		    if(err) {
		        return console.log(err);
		    }
		}); 
	})
	.catch(e => {
		console.log(e);
	});
});
// console.log(urls);