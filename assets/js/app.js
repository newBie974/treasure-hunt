var app = angular.module('app', []);

/*Directive to import file for our game*/
app.directive('importFile', ['$http', '$location', ($http, $location) => {
	return {
		template: 	`<div class="row center-align">
						<div class="col-s12" style="margin-top:5%;">
						<a id="demo" class="waves-effect waves-light btn red accent-4" href="/demo" ng-click="demoDownload()"><i class="material-icons right">code</i>demo file</a>
						</div>
						<div class="col-s12" style="margin-top:5%;">
					    <input name="myFile" type="file">
					    </div>
					    <div class="col-s12" style="margin-top:5%;">
					    <a class="waves-effect waves-light btn" ng-click="startGame()"><i class="material-icons right">send</i>start the game</a>
					    </div>
					    <div class="col-s12">
					    <a class="waves-effect waves-light btn red accent-4" href="/download" ng-show="dowloadPath"><i class="material-icons right">file_download</i>download result</a>
					    </div>
				  	</div>`,
		link: (scope, element, attr) => {
			var reader 		= new FileReader();
			let data = {
				map: {},
				mountain: {},
				player: {},
				treasure: {}
			}
			let cptMountain = 0,
				cptMap 		= 0, 
				cptTreasure = 0,
				cptPlayer 	= 0;

			reader.onload = (progressEvent) => {
				let lines = progressEvent.target.result.split(`\n`);
				lines.forEach((e) => {
					if(e.startsWith('C') || e.startsWith('M') || e.startsWith('T') || e.startsWith('A')){
						if(e.startsWith('C')){
							data.map[cptMap] = {};
							data.map[cptMap].data = e.replace(/(\r\n|\n|\r|\s)/gm,"");
							cptMap++;
						}
						else if(e.startsWith('M')){
							data.mountain[cptMountain] = {};
							data.mountain[cptMountain].data = e.replace(/(\r\n|\n|\r|\s)/gm,"");
							cptMountain++;
						}
						else if(e.startsWith('T')){
							data.treasure[cptTreasure] = {};
							data.treasure[cptTreasure].data = e.replace(/(\r\n|\n|\r|\s)/gm,"");
							cptTreasure++;
						}
						else{
							data.player[cptPlayer] = {};
							data.player[cptPlayer].data = e.replace(/(\r\n|\n|\r|\s)/gm,"");
							cptPlayer++;
						}
					}
					else if(e.startsWith('#')){
						//console.log('cest un commentaire', e);
					}
					else
					{
						//console.log('nothing to do here');
					}
				})
			}
			element.bind('change', (event) => {
				let file = event.target.files[0];
				reader.readAsText(file);				
			})

			scope.startGame = () => {
				if(Object.keys(data.map).length == 1 && Object.keys(data.player).length == 1){
					$http.post(`${$location.$$absUrl}api/treasure`, {data:data}).then((res) => {
						if(res.data.status == 'success'){
							if(res.data.downloadPath){
								scope.dowloadPath = res.data.downloadPath;
							}
							else{
								swal('erreur');
							}
						}
						else{
							swal('probleme');
						}
					})
				}
				else{
					swal('Votre fichier doit comporter 1 seule map / 1 seul joueur');
				}
			}

			scope.demoDownload = () => {
				let demoBtn = angular.element(document.querySelector('#demo'));
				demoBtn.removeClass('red accent-4').addClass('grey darken-1');
			}
		}
	}
}])