window.onload = () => {

	// For some reason Space interrupts Arrows from being used simultaneously.
	// So you cannot Dash diagonally with Arrows and Space.

	// let changeControls = confirm ("The current controls for moving are WASD and Space. Do you want to change it to arrows and Z?");
	// if (changeControls) {
	// 	game.Settings.Controls.MoveLeft = "ArrowLeft";
	// 	game.Settings.Controls.MoveRight = "ArrowRight";
	// 	game.Settings.Controls.MoveUp = "ArrowUp";
	// 	game.Settings.Controls.MoveDown = "ArrowDown";
	// 	game.Settings.Controls.Dash = "KeyZ";
	// }
	// alert("In case you want to change controls:\n1. Ctrl+Shift+I\n2. Open Console\n3. game.Settings.Controls.MoveLeft = \"KeyA\"\n\nTo check controls: game.Settings.Controls");

	game.Canvas = document.querySelector("canvas");
	game.Context = game.Canvas.getContext("2d");

	game.Objects.push(
		new Player(
			{x:50, y:50},
			{width:50, height:50},
			`rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`
		)
	)
	game.Objects.push(
		new HurtBox(
			{x:500, y:100},
			{width:50, height:50},
			`rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`
		)
	)

	game.Objects[1].Step = function () {
		if (!this.startPos) this.startPos = Object.create(this.position);

		this.position.x = this.startPos.x + Math.sin(game.Ticks / 20) * 2;

		let x = this.position.x;
		let y = this.position.y;
		let width = this.size.width;
		let height = this.size.height;
		let color = this.color;

		let Step = function () {
			if (!this.alpha) this.alpha = 0.75;

			this.alpha -= 0.075;

			if (this.alpha <= 0) {
				this.Destroy();
			}
			
			let rgb = rgbFromString(this.color);
			this.color = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${this.alpha})`;
		}

		game.Objects.push(
			new Particle(
				{x, y},
				{width, height},
				color,
				Step
			)
		);
	}

	game.resizeCanvas();
	game.tick();
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