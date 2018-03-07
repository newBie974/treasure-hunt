module.exports = class Player{
	constructor(player){
		this.player = player;
	}

	/*	This function is the main to help our player to find the tresure(s)
		Function findTreasure(map)
		@param map: array
		@return Promise
	*/
	findTreasure(map){
		let that = this;
		let error = {};
		let i = 0
		return new Promise((resolve, reject) => {
			Object.keys(that.player).forEach((e) => {
				that.getMoovement(that.player[e].moove).then((res, err) => {
					if(!err)
					{
						that.player[e].moove = res.moovement;
						let data = that.mooveOnTheMap(map, that.player[e]);
						resolve({
							data: data
						})
					}
					else{
						reject({
							status: 'error',
							err: err
						})
					}
					
				})
			})
		})
	}

	/*	This function make the player moove on the map
		Function mooveOnTheMap(map, player)
		@param map: array
		@param player: object
		@return data: object
	*/
	mooveOnTheMap(map, player){
		let data = {tresor:0};
		let error = {};
		let limitX = map[0].length-1;
		let limitY = map.length-1;
		let monDebugger = 0;
		player.moove.forEach((e) => {
			switch(player.orientation){	
				case "N":
					if(e == "D"){
						player.orientation = "E";
					}
					else if(e == "G"){
						player.orientation = "O"
					}
					else if(e == "A"){
						if(player.y > 0)
						{
							if(parseInt(map[player.y-1][player.x]) > 0){
								map[player.y][player.x] = map[player.y][player.x] > 0 ? map[player.y][player.x] : 0;
								data.tresor += 1;
								map[player.y-1][player.x] = parseInt(map[player.y-1][player.x])-1 >= 0 ? parseInt(map[player.y-1][player.x])-1 : 0;
								player.y = (player.y-1) <= limitY ? (player.y-1) : limitY;
							}
							else if(map[player.y-1][player.x] == 0){
								map[player.y][player.x] =map[player.y][player.x] > 0 ? map[player.y][player.x] : 0;
								map[player.y-1][player.x] = map[player.y-1][player.x] > 0 ? map[player.y-1][player.x] : 'A';
								player.y = (parseInt(player.y)-1) <= limitY ? (parseInt(player.y)-1) : limitY;
							}
						}
						
					}
					else{
						error[i] = {};
						error[i].data = e;
						error[i].msg = 'Direction is unknown';
						i++;
					}
					break;
				case "S":
					if(e == "D"){
						player.orientation = "O";
					}
					else if(e == "G"){
						player.orientation = "E"
					}
					else if(e == "A"){
						if(player.y < limitY){
							if(parseInt(map[player.y+1][player.x]) > 0){
								data.tresor += 1;
								map[player.y][player.x] = map[player.y][player.x] > 0 ? map[player.y][player.x] : 0;
								map[player.y+1][player.x] = parseInt(map[player.y+1][player.x])-1 > 0 ? parseInt(map[player.y+1][player.x])-1 : 0;
								player.y = (player.y+1) < limitY ? (parseInt(player.y)+1) : limitY;
							}
							else if(map[player.y+1][player.x] == 0){
								map[player.y][player.x] = map[player.y][player.x] > 0 ? map[player.y][player.x] : 0;
								map[player.y+1][player.x] = map[player.y+1][player.x] > 0 ? map[player.y+1][player.x] : 'A';
								player.y = (parseInt(player.y)+1) <= limitY ? (parseInt(player.y)+1) : limitY;
							}
						}
					}
					else{
						error[i] = {};
						error[i].data = e;
						error[i].msg = 'Direction is unknown';
						i++;
					}
					break;
				case "E":
					if(e == "D"){
						player.orientation = "S";
					}
					else if(e == "G"){
						player.orientation = "N";
					}
					else if(e == "A"){
						if(player.x >= 0 && player.x < limitX){
							if(parseInt(map[player.y][player.x+1]) > 0){
								map[player.y][player.x] = map[player.y][player.x] > 0 ? map[player.y][player.x] : 0;
								data.tresor += 1;
								map[player.y][player.x+1] = parseInt(map[player.y][player.x+1])-1 > 0 ? parseInt(map[player.y][player.x+1])-1 : 0; 
								player.x = (parseInt(player.x)+1) >= 0 ? (parseInt(player.x)+1) : 0;
							}
							else if(map[player.y][player.x+1] == 0){
								map[player.y][player.x] = map[player.y][player.x] > 0 ? map[player.y][player.x] : 0;
								map[player.y][player.x+1] = map[player.y][player.x+1] > 0 ? map[player.y][player.x+1] : 'A';
								player.x = (parseInt(player.x)+1) >= 0 ? (parseInt(player.x)+1) : 0;
							}
						}
						
					}
					else{
						error[i] = {};
						error[i].data = e;
						error[i].msg = 'Direction is unknown';
						i++;
					}
					break;
				case "O":
					if(e == "D"){
						player.orientation = "N";
					}
					else if(e == "G"){
						player.orientation = "S";
					}
					else if(e == "A"){
						if(player.x > 0){
							if(parseInt(map[player.y][player.x-1]) > 0){
								map[player.y][player.x] = map[player.y][player.x] > 0 ? map[player.y][player.x] : 0;
								data.tresor += 1;
								map[player.y][player.x-1] = parseInt(map[player.y][player.x-1])-1 > 0 ? parseInt(map[player.y][player.x-1])-1 : 0; 
								player.x = (parseInt(player.x)-1) >= 0 ? (parseInt(player.x)-1) : 0;
							}
							else if(map[player.y][player.x-1] == 0){
								map[player.y][player.x] = map[player.y][player.x] > 0 ? map[player.y][player.x] : 0;
								map[player.y][player.x-1] = map[player.y][player.x-1]-1 > 0 ? map[player.y][player.x-1]-1 : 'A';
								player.x = (parseInt(player.x)-1) >= 0 ? (parseInt(player.x)-1) : 0;
							}
						}
						
					}
					else{
						error[i] = {};
						error[i].data = e;
						error[i].msg = 'Direction is unknown';
						i++;
					}
					break;
			}
			monDebugger++;
		})
		data.map = map;
		player.tresor = data.tresor;
		data.player = player;
		return data;
	}

	/*	This function help our player to get is moovement
		Function getMoovement(sequence)
		@param sequence: string
		@return Promise
	*/
	getMoovement(sequence){
		let moovement = sequence.split("");
		return new Promise((resolve, reject) => {
			if(moovement.length > 0){
				resolve({
					status: 'success',
					moovement: moovement
				})
			}
			else{
				reject({
					moovement: moovement
				})
			}
		})
	}

}