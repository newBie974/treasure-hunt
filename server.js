/* Create node server.js */ 
var express 	= require('express');
var app 		= express();
var bodyParser 	= require('body-parser');
var path 		= require('path');
/* Controller */ 
var Game 	= require('./controller/gameController');
var Player 		= require('./controller/playerController');
/* Controller */ 
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
/* Create var */ 
var port = process.env.PORT || 8080;
var __templateFolder = path.normalize(`${__dirname}/view`);
var __tmpFolder 	 = path.normalize(`${__dirname}/tmp/`);

var router = express.Router();

/*Declare route path*/
app.get('/', (req, res) => {
	res.sendFile(`${__templateFolder}/index.html`);
})
/*This is not more powerfull method to download file*/
app.get('/download', function(req, res){
  var file = __tmpFolder + 'result.txt';
  res.download(file); // Set disposition and send it.
});
app.get('/demo', function(req, res){
  var file = __tmpFolder + 'demo1.txt';
  res.download(file); // Set disposition and send it.
});

/*	Api Treasure route */
router.route('/treasure')
	.post((req, res) => {
		let game = new Game(req);
		game.buildMap().then((result, error) => {
			if(result.status == 'success'){
				if(Object.keys(result.erreur_mapping).length == 0){
					let player = new Player(result.player);
					player.findTreasure(result.finalMap).then((result, err) => {
						if(!err){
							game.buildResultFile(result.data.map, result.data.player, __tmpFolder).then((resBuild, err)=>{
								if(!err){
									res.send({status: 'success', downloadPath: resBuild.path});
								}
								else{
									res.send({status: 'error', err:err});
								}
							});	
						}
						else{
							res.send({status: 'error', err:err})
						}
					})
				}
				else{

				}
			}
			else{
				res.send(error);
			}
		})
	})



app.use('/api', router);
app.use(express.static(`${__dirname}/node_modules`));
app.use('/assets', express.static(`${__dirname}/assets`));
/*Lunch server*/
app.listen(port, () => {
	console.log(`Server is running ${port} ${__dirname}`);
});

