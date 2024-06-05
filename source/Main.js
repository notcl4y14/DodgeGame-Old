let game = new Game();

let initGameCanvas = function () {
	game.canvas = document.querySelector("canvas");
	game.context = new Context(game.canvas);
	game.context.fillCanvasToWindow();
}

let initPlayer = function () {
	let pos = {x: window.innerWidth / 2, y: window.innerHeight / 2};
	let size = {width:25, height:25};
	let color = game.settings.player.color;

	pos.x -= size.width / 2;
	pos.y -= size.height / 2;

	game.spawn( new Player(pos, size, color) );
}

let initLevel = function () {
	let level = game.level;

	if (level == null) {
		return;
	}

	level.queue.clear();

	let duration = 75*10;
	let color = `rgb(255,0,0)`;
	let size = {width:25, height:25};

	let amountW = 25/4;
	let amountH = 4;
	let intervalX = 150;
	let intervalY = 150;
	let offsetX = 50;
	let offsetY = 50;

	for (let y = 0; y < amountH; y++) {
		for (let x = 0; x < amountW; x++) {
			level.queue.add( () => {
				let pos = {
					x: x * intervalX + offsetX,
					y: y * intervalY + offsetY
				};
				let vel = {x: 5, y: 5};
		
				let randX = Math.randomInt(0, 1);
				let randY = Math.randomInt(0, 1);
		
				if (randX) vel.x *= -1;
				if (randY) vel.y *= -1;
		
				let hurtBox = new HurtBox.DVD(pos, size, color, vel, duration);
				let spawnBox = new SpawnBox(pos, size, 50, hurtBox);
		
				game.spawnParticle(spawnBox);
			}, 25 );
		}
	}
}

let init = function () {
	initGameCanvas();

	game.context.font = "15px Monospace";
	game.setState(State.MainMenu);

	game.running = true;
	game.loop();
}

window.onload = () => {
	init();
}

window.onresize = () => {
	game.context.fillCanvasToWindow();
}

window.onkeydown = (key) => {
	game.input.keys[key.code] = 0;
	game.input.updateKey(key.code);
}

window.onkeyup = (key) => {
	game.input.keys[key.code] = -1;
}

window.onmousemove = (mouse) => {
	game.input.mouse.x = mouse.x;
	game.input.mouse.y = mouse.y;
}

window.onmousedown = (mouse) => {
	game.input.mouse.buttons[mouse.which] = true;
}

window.onmouseup = (mouse) => {
	game.input.mouse.buttons[mouse.which] = false;
}