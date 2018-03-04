module.exports = class Treasure{

	constructor(data){
		this.req = data;
	}

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
							finalMap[treasureParams[e].y][treasureParams[e].x] = `T (${treasureParams[e].nb})`;
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
							erreur_maping: error
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

	buildMountainsParams(mountainData){
		let that 			= this;
		let mountainParams 	= {};
		let i 				= 0;
		return new Promise((resolve, reject) => {
			Object.keys(mountainData).forEach((e) => {
				let mountain = mountainData[e].data.split('-');
				mountainParams[i] = {};
				mountainParams[i].x = mountain[1];
				mountainParams[i].y = mountain[2];
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

	buildTreasureParams(treasureData){
		let that = this;
		let treasureParams = {};
		let i = 0;
		return new Promise((resolve, reject) => {
			Object.keys(treasureData).forEach((e) => {
				let treasure = treasureData[e].data.split('-');
				treasureParams[i] 	= {};
				treasureParams[i].x = treasure[1];
				treasureParams[i].y = treasure[2];
				treasureParams[i].nb= treasure[3];
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

	buildPlayerParams(playerData){
		let that = this;
		let playerParams = {};
		let i = 0;
		return new Promise((resolve, reject) => {
			Object.keys(playerData).forEach((e) => {
				let player = playerData[e].data.split('-');
				playerParams[i] = {};
				playerParams[i].name = player[1];
				playerParams[i].x = player[2];
				playerParams[i].y = player[3];
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
}