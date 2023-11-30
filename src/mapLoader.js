const tmx = require('tmx-parser');

async function loadMap() {
	const map = await new Promise((resolve, reject) => {
		tmx.parseFile('./tiled/winter.tmx', function(err, loadedMap) {
			if (err) return reject(err);
			
			resolve(loadedMap);	
			console.log(loadedMap);
		});
	});
	
	const layer = map.layers[0];
	const tiles = layer.tiles;
	
	// creating 2d array of tiles
	const map2D = new Array(map.height).fill('').map(() => new Array(map.width));
	
	for (let row = 0; row < map.height; row++) {
		for (let col = 0; col < map.width; col++) {
			const tile = tiles[row * map.height + col];
			//console.log(tile);
			map2D[row][col] = {
				id : tile.id,
				gid : tile.gid,
				source: tile.image.source,
			};
		}
	}
	
	//console.log(map2D);

	return map2D;
}

module.exports = {
	loadMap : loadMap,
}