State.MainMenu = class extends State {
	constructor () {
		super("MainMenu", []);

		this.startKey = "Space";
		this.settingsKey = "KeyS";
	}

	load (game) {
		let size = {width:50, height:50};
		let color = `rgb(255,0,0)`;
		let duration = 75*10;
		let onDurationFinish = function () {
			this.ticks = 0;
		}

		if (game.objects.length > 0) return;

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
	}

	update (game) {
		if (game.input.isKeyDown(this.startKey)) {
			game.level = new Level();
			game.level.length = 750;
			game.level.start();
			game.setState(State.Play);
			return;
		}

		if (game.input.isKeyDown(this.settingsKey)) {
			game.setState(State.Settings);
			return;
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
		game.context.fontSize = 15;
		game.context.textAlign = "center";
		game.context.fillStyle = "#ffffff";
		game.context.fillText("Press Space to start", centerW, centerH);
		game.context.font = oldFont;

		game.context.fillStyle = "#000000";
		game.context.fillRect(centerW - 75, centerH + 30, 75 * 2, 20);

		game.context.fontSize = 12;
		game.context.textAlign = "center";
		game.context.fillStyle = "#ffffff";
		game.context.fillText("Press S to open Settings", centerW, centerH + 43);
		game.context.font = oldFont;

		game.context.fillStyle = "#000000";
		game.context.fillRect(centerW + 100, centerH - 20, 75 * 2, 45 * 2);

		game.context.fontSize = 20;
		game.context.textAlign = "center";
		game.context.fillStyle = "#ffffff";
		game.context.fillText("Controls", centerW + 175, centerH);

		let moveLeft = keyToString(game.settings.controls.MoveLeft);
		let moveRight = keyToString(game.settings.controls.MoveRight);
		let moveUp = keyToString(game.settings.controls.MoveUp);
		let moveDown = keyToString(game.settings.controls.MoveDown);
		let dash = keyToString(game.settings.controls.Dash);
		let quit = keyToString(game.settings.controls.Quit);

		let str1 = `${moveUp}${moveLeft}${moveDown}${moveRight} - Move`;
		let str2 = `${dash} - Dash`;
		let str3 = `${quit} - Quit`;
		
		game.context.fontSize = 15;
		game.context.textAlign = "left";
		game.context.fillText(str1, centerW + 105, centerH + 20);
		game.context.fillText(str2, centerW + 105, centerH + 40);
		game.context.fillText(str3, centerW + 105, centerH + 60);

		let version = `v${Game.version}`;

		game.context.textBaseline = "top";
		game.context.fillText(version, 0, 0);
		game.context.textBaseline = "middle";
	}
}