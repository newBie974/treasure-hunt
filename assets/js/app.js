var app = angular.module('app', []);

app.directive('importFile', ['$http', '$location', ($http, $location) => {
	return {
		template: 	`<div class="row">
					    <input name="myFile" type="file">
					    <a class="waves-effect waves-light btn" ng-click="startGame()"><i class="material-icons right">cloud</i>button</a>
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
						console.log('cest un commentaire', e);
					}
					else
					{
						console.log('nothing to do here');
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
						console.log(res);
					})
				}
				else{
					console.log('Votre fichier doit comporter 1 seule map / 1 seul joueur');
				}
			}
		}
	}
}])