//Create our node server
var express 	= require('express');
var app 		= express();
var bodyParser 	= require('body-parser');

var Treasure 	= require('./controller/treasureController')

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var __templateFolder = `${__dirname}/view`;

var router = express.Router();

app.get('/', (req, res) => {
	res.sendFile(`${__templateFolder}/index.html`);
})


router.route('/treasure')
	.post((req, res) => {
		//console.log('mdr', treasure);
		let treasure = new Treasure(req);
		treasure.buildMap().then((res, err) => {
			console.log(res);
		})
	})



app.use('/api', router);

app.listen(port, () => {
	app.use('/node_modules', express.static(__dirname + '/node_modules'));
	app.use('/assets', express.static(__dirname + '/assets'));
	console.log(`Server is running ${port}`);
});
