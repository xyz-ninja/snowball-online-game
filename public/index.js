
//const mapImage = new Image();
//mapImage.src = "/snowy_sheet.png";

class Tile {
	constructor(id) {
		this.id = id;
		this.image = null;
		this.isTextureLoaded = false;
	}
}

class MainScene extends Phaser.Scene {

	constructor() {
		super();
		this.images = [];
	}

	preload () {
		/*
		this.load.setBaseURL('https://labs.phaser.io');

		this.load.image('sky', 'assets/skies/space3.png');
		this.load.image('logo', 'assets/sprites/phaser3-logo.png');
		this.load.image('red', 'assets/particles/red.png');
		*/

		this.load.image('test', 'graphics/assets/Tiles/Ground Tiles/tile_ground_00.png')
	}

	create () {

		this.add.image(400, 300, 'test');

		/*
		this.add.image(400, 300, 'sky');

		const particles = this.add.particles(0, 0, 'red', {
			speed: 100,
			scale: { start: 1, end: 0 },
			blendMode: 'ADD'
		});

		const logo = this.physics.add.image(400, 100, 'logo');

		logo.setVelocity(100, 200);
		logo.setBounce(1, 1);
		logo.setCollideWorldBounds(true);

		particles.startFollow(logo);
		*/
	}

	update() {
		// search for unloaded tiles 
		for (let row = 0; row < map.length; row++) {
			for (let col = 0; col < map[row].length; col++) {
	
				const { id, source } = map[row][col];
	
				let imageID = id + "";
				
				let tile = this.add.image(imageID, col * TILE_SIZE, row * TILE_SIZE)

				if (this.images.includes(imageID) == false) {
					
					let loader = new Phaser.Loader.LoaderPlugin(this);
					loader.image(imageID, source.replace("public/", ""));

					loader.once(Phaser.Loader.Events.COMPLETE, () => {
						tile.setTexture(imageID)
					});

					loader.start();

					//this.load.image(imageID, source.replace("public/", ""));

					this.images.push(imageID);
					
				} else {
					
				}
			}
		}
	}
}

const config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	scene: MainScene,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	}
};

const game = new Phaser.Game(config);

/*
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
*/

const socket = io(`ws://localhost:5000`);

let map = [[]];

let tilesInfo = [];

const TILE_SIZE = 16;

socket.on('connect', () => {
	console.log('connected');
}); 

socket.on('map', (loadedMap) => {
	map = loadedMap;
});

/*
function loop() {

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#111111";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (let row = 0; row < map.length; row++) {
		for (let col = 0; col < map[row].length; col++) {

			const { id, source, flipX, flipY } = map[row][col];

			let tileImage = getTileImageByID(id, source, flipX, flipY);

			ctx.drawImage(tileImage, 
				0, 0, TILE_SIZE, TILE_SIZE,
				col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
		}
	}

	window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
*/

// cache tile image
function getTileImageByID(id, source, flipX, flipY) {
	for (let i = 0; i < tilesInfo.length; i++) {
		let tileInfo = tilesInfo[i];
		if (tileInfo.id === id && tileInfo.flipX == flipX && tileInfo.flipY == flipY) {
			return tileInfo.image;
		}
	}

	let image = new Image();
	image.src = source.replace("public/", "");

	console.log("new image created src: " + source  + " flipX: " + flipX + " flipY: " + flipY);

	let rotateAngle = 0;
	if (flipX) { rotateAngle = 180; } 
	else { rotateAngle = 0; }

	if (flipY) { rotateAngle = 270; }
	else { rotateAngle = 90; }

	image.style.transform = 'rotate(' + rotateAngle + 'deg)';

	let tileInfo = {
		id : id,
		image : image,
		flipX : flipX,
		flipY : flipY
	};

	tilesInfo.push(tileInfo);

	return tileInfo.image;
}