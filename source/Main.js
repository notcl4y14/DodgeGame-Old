let game = new Game();

let initGameCanvas = function () {
	game.canvas = document.querySelector("canvas");
	game.context = new Context(game.canvas);
}

let initPlayer = function () {
	let pos = {x:50, y:50};
	let size = {width:25, height:25};
	let color = game.settings.player.color;

	game.spawn( new Player(pos, size, color) );
}

let initLevel = function () {
	if (game.level == null) return;
	game.level.queue.clear();

	for (let i = 0; i < 25; i++) {
		let x = Math.floor(Math.random() * window.innerWidth);
		let y = Math.floor(Math.random() * window.innerHeight);

		game.level.queue.add( () => {
			let pos = {x, y};
			let size = {width:25, height:25};
			let color = `rgb(255,0,0)`;
			let vel = {x: 5, y: 5};
			let duration = 75*10;

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

let init = function () {
	initGameCanvas();
	game.context.font = "15px Monospace";
	game.setState(State.MainMenu);

	game.running = true;

	game.context.fillCanvasToWindow();
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