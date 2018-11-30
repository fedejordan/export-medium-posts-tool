const { parse } = require('node-html-parser');
var request = require('request-promise');

let mediumURL = 'https://medium.com/';
let profileId = 'federicojordn';

let profileURL = `${mediumURL}@${profileId}`;

console.log(profileURL);

request(profileURL).then((response) => {
	// console.log(response);
	// return;
	const root = parse(response);
	const htmlElement = root.querySelector('#h1'); //ag.ce.ek.el.em.ec.eb.en.eo.cc.ah

	var titles = getTitles('<h1 class="aw cm el em en ed ec eo ep ck ax">', '</h1>', response);
	var titles2 = getTitles('"type":"H3","href":null,"layout":null,"metadata":null,"text":"', '","markups":[],"__typename":"Paragraph","iframe":null', response);
	console.log(`titles: ${JSON.stringify(titles + titles2)}`);
}).catch((error) => {
	console.log(error);
});

const getTitles = (a, b, text) => {
	var arrayStrings = text.split(a);
	arrayStrings.shift();
	var titles = [];
	arrayStrings.forEach((element) => {
		var subArrayStrings = element.split(b);
		titles.push(subArrayStrings[0]);
	});
	return titles;
}

var example = "eefwrrttHOLA SOY FEDEooppdasdsa";
var arrayStrings = example.split('rrtt');
var arrayStrings2 = arrayStrings[1].split('oopp');
// console.log(JSON.stringify(arrayStrings2[0]));

//"type":"H3","href":null,"layout":null,"metadata":null,"text":"
//","markups":[],"__typename":"Paragraph","iframe":null