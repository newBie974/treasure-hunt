//Create our node server
var express 	= require('express');
var app 		= express();
var bodyParser 	= require('body-parser');

var Treasure 	= require('./controller/treasureController')

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', (req, res) => {
	res.json({message: 'welcome'});
})


router.route('/treasure')
	.post((req, res) => {
		//console.log('mdr', treasure);
		let treasure = new Treasure(req);
		treasure.buildMap();
	})



app.use('/api', router);

app.listen(port);
console.log(`Server is running ${port}`);