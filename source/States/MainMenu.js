State.MainMenu = class extends State {
	constructor () {
		super("MainMenu", []);
	}

	load (game) {}

	update (game) {
		if (game.input.isKeyDown("Space")) {
			game.spawnQueue.clear();
			game.setState(State.Play);
		
			return;
		}

		if (game.input.isKeyDown("KeyS")) {
			game.setState(State.Settings);
		
			return;
		}

		if (game.spawnQueue.queue.length == 0) {
			let size = {width:50, height:50};
			let color = `rgb(255,0,0)`;
			let duration = 75*10;
			let onDurationFinish = function () {
				// this.boundOnWalls = false;
				this.ticks = 0;
			}

			// I have NO IDEA how the hurtboxes go off-sync from each other despite that they have been spawned in identical positions
			// But by adding/subtracting them with 10 fixes it
			// what
			// NEVERMIND, I figured it out
			// The queue spawns one element at each tick
			// So it was waiting for another tick to spawn another HurtBox
			// Meanwhile, the other one has moved already
			// And so on

			game.spawnQueue.add( () => {
				// Top-Left
				let hurtBox = new HurtBox.DVD(
					{x: 0, y: 0},
					size,
					color, {x: 5, y: 5},
					duration
				);

				hurtBox.onDurationFinish = onDurationFinish;

				game.spawn(hurtBox);

				// Top-Right
				hurtBox = new HurtBox.DVD(
					{x: window.innerWidth - size.width, y: 0},
					size,
					color, {x: -5, y: 5},
					duration
				);

				hurtBox.onDurationFinish = onDurationFinish;

				game.spawn(hurtBox);

				// Bottom-Left
				hurtBox = new HurtBox.DVD(
					{x: 0, y: window.innerHeight - size.height},
					size,
					color, {x: 5, y: -5},
					duration
				);

				hurtBox.onDurationFinish = onDurationFinish;

				game.spawn(hurtBox);

				// Bottom-Right
				hurtBox = new HurtBox.DVD(
					{x: window.innerWidth - size.width, y: window.innerHeight - size.height},
					size,
					color, {x: -5, y: -5},
					duration
				);

				hurtBox.onDurationFinish = onDurationFinish;

				game.spawn(hurtBox);
			}, 25);
		}

		game.updateObjects();
	}

	draw (game) {
		game.particles.forEach(ent => {
			ent.draw();
		});
		
		game.objects.forEach(ent => {
			ent.draw();
		});

		let centerW = game.canvas.width / 2;
		let centerH = game.canvas.height / 2;

		game.context.fillStyle = "#000000";
		game.context.fillRect(centerW - 75, centerH - 20, 75 * 2, 20 * 2);

		let oldFont = game.context.font;
		game.context.font = "15px sans-serif";
		game.context.textAlign = "center";
		game.context.fillStyle = "#ffffff";
		game.context.fillText("Press Space to start", centerW, centerH);
		game.context.font = oldFont;

		game.context.fillStyle = "#000000";
		game.context.fillRect(centerW - 75, centerH + 30, 75 * 2, 20);

		game.context.font = "12px sans-serif";
		game.context.textAlign = "center";
		game.context.fillStyle = "#ffffff";
		game.context.fillText("Press S to open Settings", centerW, centerH + 43);
		game.context.font = oldFont;

		game.context.fillStyle = "#000000";
		game.context.fillRect(centerW + 100, centerH - 20, 75 * 2, 35 * 2);

		game.context.font = "20px sans-serif";
		game.context.textAlign = "center";
		game.context.fillStyle = "#ffffff";
		game.context.fillText("Controls", centerW + 175, centerH);
		
		game.context.font = "15px sans-serif";
		game.context.textAlign = "left";
		game.context.fillText("WASD - Move", centerW + 105, centerH + 20);
		game.context.fillText("Space - Dash", centerW + 105, centerH + 40);

		game.context.textBaseline = "middle";
	}
}