
//const mapImage = new Image();
//mapImage.src = "/snowy_sheet.png";

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const socket = io(`ws://localhost:5000`);

let map = [[]];
let tilesInfo = [];

const TILE_SIZE = 16;

socket.on('connect', () => {
	console.log('connected');
}); 

socket.on('map', (loadedMap) => {
	map = loadedMap;
	console.log('map', map);
});

function loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#111111";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (let row = 0; row < map.length; row++) {
		for (let col = 0; col < map[row].length; col++) {

			const { id, source } = map[row][col];

			let tileImage = getTileImageByID(id, source);

			ctx.drawImage(tileImage, 
				0, 0, TILE_SIZE, TILE_SIZE,
				col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);

			/*
			ctx.drawImage(tileImage, 
				0, 0, TILE_SIZE, TILE_SIZE,
				col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
			*/
		}
	}

	window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);

// cache tile image
function getTileImageByID(id, source) {
	for (let i = 0; i < tilesInfo.length; i++) {
		let tileInfo = tilesInfo[i];
		if (tileInfo.id === id) {
			return tileInfo.image;
		}
	}

	let image = new Image();
	image.src = source.replace("public/", "");
	let tileInfo = {
		id : id,
		image : image 
	};

	tilesInfo.push(tileInfo);

	return tileInfo.image;
}