module.exports = class Treasure{

	constructor(data){
		this.req = data;
	}
	buildMap(){
		let that 	= this;
		let map 	= that.req.body.data.map;
		let finalMap= []
		return new Promise((resolve, reject) => {
			Object.keys(map).forEach((e) => {
				let mapParams 	= map[e].data.split('-');
				for(let i = 0; i < mapParams[2]; i++){
					finalMap[i] = [];
					for(let j = 0; j < mapParams[1]; j++){
						finalMap[i][j] = j;
					}
				}
			})
			if(finalMap.length > 0){
				resolve({
					status: 'success',
					finalMap: finalMap
				})
			}
			else{
				reject({
					status: 'error',
					msg_er: 'Error to build map'
				})
			}
		})
	}
}