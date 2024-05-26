let game = new Game();

let initGameCanvas = function () {
	game.Canvas = document.querySelector("canvas");
	game.Context = game.Canvas.getContext("2d");
}

let initPlayer = function () {
	let pos = {x:50, y:50};
	let size = {width:25, height:25};
	let color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`;

	game.spawn( new Player(pos, size, color) );
}

let initLevel = function () {
	for (let i = 0; i < 25; i++) {
		let x = Math.floor(Math.random() * window.innerWidth);
		let y = Math.floor(Math.random() * window.innerHeight);

		game.SpawnQueue.add( () => {
			let pos = {x, y};
			let size = {width:25, height:25};
			let color = `rgb(255,0,0)`;
			let vel = {x: 5, y: 5};
			let duration = 75*10;

			let randX = Math.floor(Math.random() * 2);
			let randY = Math.floor(Math.random() * 2);

			if (randX) vel.x *= -1;
			if (randY) vel.y *= -1;

			let hurtBox = new HurtBox.DVD(pos, size, color, vel, duration);
	
			game.spawn(hurtBox);
		}, 250 );
	}
}

let init = function () {
	initGameCanvas();
	initPlayer();
	initLevel();

	game.SpawnQueue.start();
	game.running = true;

	game.resizeCanvas();
	game.loop();
}

window.onload = () => {
	init();
}

window.onresize = () => {
	game.resizeCanvas();
}

window.onkeydown = (key) => {
	game.Input.Keys[key.code] = true;
}

window.onkeyup = (key) => {
	game.Input.Keys[key.code] = false;
}