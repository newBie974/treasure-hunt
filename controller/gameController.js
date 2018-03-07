module.exports = class Game{

	constructor(data){
		this.req = data;
	}
	/*	This function build our map
		Function buildMap()
		@return Promise
	*/
	buildMap(){
		let that 	= this;
		let map 	= that.req.body.data.map;
		let mountain= that.req.body.data.mountain;
		let treasure= that.req.body.data.treasure;
		let player	= that.req.body.data.player;
		let finalMap= [];
		let error = {};
		let cpt_erreur = 0;
		return new Promise((resolve, reject) => {
			Promise.all([that.buildMountainsParams(mountain), that.buildTreasureParams(treasure), that.buildPlayerParams(player)]).then((res) => {
				if(!res[0].err && !res[1].err && !res[2].err)
				{
					let mountainParams = res[0].mountainParams;
					let treasureParams = res[1].treasureParams;
					let playerParams   = res[2].playerParams;
					Object.keys(map).forEach((e) => {
						let mapParams 	= map[e].data.split('-');
						for(let i = 0; i < mapParams[2]; i++){
							finalMap[i] = [];
							for(let j = 0; j < mapParams[1]; j++){
								finalMap[i][j] = 0;
							}
						}
					});
					Object.keys(mountainParams).forEach((e) =>{
						if(finalMap[mountainParams[e].y][mountainParams[e].x] == 0){
							finalMap[mountainParams[e].y][mountainParams[e].x] = 'M';
						}
						else{
							error[cpt_erreur] = {};
							error[cpt_erreur].mountain = `Erreur ${finalMap[mountainParams[e].y][mountainParams[e].x]} | Mapping: ${mountainParams[e].y} - ${mountainParams[e].x}`;
							cpt_erreur++;
						}
					})
					Object.keys(treasureParams).forEach((e) => {
						if(finalMap[treasureParams[e].y][treasureParams[e].x] == 0){
							finalMap[treasureParams[e].y][treasureParams[e].x] = `${treasureParams[e].nb}`;
						}
						else{
							error[cpt_erreur] = {};
							error[cpt_erreur].treasure = `Erreur ${finalMap[treasureParams[e].y][treasureParams[e].x]} | Mapping: ${treasureParams[e].y} - ${treasureParams[e].x}`;
							cpt_erreur++;
						}
					})
					Object.keys(playerParams).forEach((e)=> {
						if(finalMap[playerParams[e].y][playerParams[e].x] == 0){
							finalMap[playerParams[e].y][playerParams[e].x] = 'A';
						}
						else{
							error[cpt_erreur] = {};
							error[cpt_erreur].player = `Erreur ${finalMap[playerParams[e].y][playerParams[e].x]} | Mapping: ${playerParams[e].y} - ${playerParams[e].x}`;
							cpt_erreur++;
						}
					})
					if(finalMap.length > 0){
						resolve({
							status: 'success',
							finalMap: finalMap,
							player: playerParams,
							mountain: mountainParams,
							treasureParams: treasureParams,
							erreur_mapping: error
						})
					}
					else{
						reject({
							status: 'error',
							msg_er: 'Error to build map'
						})
					}
				}
				else{
					reject({
						status: 'error',

					})
				}
				
			})
			
		})
	}
	/*	This function build mountains params to put it on map
		Function buildMountainsParams(mountainData)
		@param mountainData: object
		@return Promise
	*/
	buildMountainsParams(mountainData){
		let that 			= this;
		let mountainParams 	= {};
		let i 				= 0;
		return new Promise((resolve, reject) => {
			Object.keys(mountainData).forEach((e) => {
				let mountain = mountainData[e].data.split('-');
				mountainParams[i] = {};
				mountainParams[i].x = parseInt(mountain[1]);
				mountainParams[i].y = parseInt(mountain[2]);
				i++;
			})
			if(mountainParams.length == mountainData.length){
				resolve({
					status: 'success',
					mountainParams: mountainParams,
					err: null
				})
			}
			else{
				reject({
					status: 'error',
					err: 'Error to get params for mountain'
				})
			}
		})
	}
	/*	This function build mountains params to put it on map
		Function buildMountainsParams(mountainData)
		@param mountainData: object
		@return Promise
	*/
	buildTreasureParams(treasureData){
		let that = this;
		let treasureParams = {};
		let i = 0;
		return new Promise((resolve, reject) => {
			Object.keys(treasureData).forEach((e) => {
				let treasure = treasureData[e].data.split('-');
				treasureParams[i] 	= {};
				treasureParams[i].x = parseInt(treasure[1]);
				treasureParams[i].y = parseInt(treasure[2]);
				treasureParams[i].nb= parseInt(treasure[3]);
				i++;
			})
			if(treasureParams.length == treasureData.length){
				resolve({
					status: 'success',
					treasureParams: treasureParams,
					err: null
				})
			}
			else{
				reject({
					status: 'error',
					err: 'Error to get params for treasure'
				})
			}
		})
	}
	/*	This function build player params to put it on map
		Function buildPlayerParams(playerData)
		@param playerData: object
		@return Promise
	*/
	buildPlayerParams(playerData){
		let that = this;
		let playerParams = {};
		let i = 0;
		return new Promise((resolve, reject) => {
			Object.keys(playerData).forEach((e) => {
				let player = playerData[e].data.split('-');
				playerParams[i] = {};
				playerParams[i].name = player[1];
				playerParams[i].x = parseInt(player[2]);
				playerParams[i].y = parseInt(player[3]);
				playerParams[i].orientation = player[4];
				playerParams[i].moove = player[5];
				i++;
			})
			if(playerParams[i] == playerData.length){
				resolve({
					status: 'success',
					playerParams: playerParams,
					err: null
				})
			}
			else{
				reject({
					status: 'error',
					err: 'Error to get player params'
				})
			}
		})
	}
	/*	This function at then end of the game build result file
		Function buildResultFile(map, player, sendingPath)
		@param map: array
		@param player: object
		@sendingPath: string
		@return Promise
	*/
	buildResultFile(map, player, sendingPath){
		var fs = require('fs');
		var path = require('path');
		let msg = `C - ${map[0].length} - ${map.length}\r\n`;
		map.forEach((e, i) => {
			e.forEach((ee, ind) => {
				if(ee == 'M'){
					msg += `M - ${i} - ${ind}\r\n`;
				}
				else if(ee > 0){
					msg += `#{T comme Trésor} - {Axe horizontal} - {Axe vertical} - {Nb. de trésors restants}\r\nT - ${i} - ${ind} - ${ee}\r\n`;
				}
			})
		})
		msg += `# {A comme Aventurier} - {Nom de l’aventurier} - {Axe horizontal} - {Axe vertical} - {Orientation} - {Nb. trésors ramassés}\r\nA - ${player.name} - ${player.x} - ${player.y} - ${player.orientation} - ${player.tresor}\r\n`;
		let p = path.normalize(`${sendingPath}/result.txt`);
		return new Promise((resolve, reject) => {
			fs.writeFile(p, msg, (err) => {
				if(err){
					reject({status: 'error', err:err});
				}else{
					resolve({path: 'create'})
				}
			})
		})
		
	}
}