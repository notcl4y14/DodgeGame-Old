State.Success = class extends State {
	constructor () {
		super("Success", ["Quittable"]);
	}

	load (game) {
		this.external.Quittable.load(game);
		this.external.Quittable.exitTimeMax = 0;
		this.external.Quittable.showQuitText = false;

		let player = game.objects[0];
		player.shine();
		player.destroy();
	}

	update (game) {
		if (game.input.isKeyDown("KeyR")) {
			// Restarts the game
			game.level.reset();
			game.setState(State.Play);
			return;
		}

		this.external.Quittable.update(game);

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
		game.context.fillRect(centerW - 60, centerH - 20, 60 * 2, 20 * 2);

		let oldFont = game.context.font;
		game.context.fontSize = 15;
		game.context.textAlign = "center";
		game.context.textBaseline = "bottom";
		game.context.fillStyle = "#ffffff";
		game.context.fillText("You did it!", centerW, centerH);
		
		game.context.fontSize = 10;
		game.context.fillText("Press R to try again", centerW, centerH + 12.5);
		
		game.context.font = oldFont;
		game.context.textAlign = "left";
		game.context.textBaseline = "middle";
		game.context.fillText(`Press ${keyToString(game.settings.controls.Quit)} to quit to the main menu`, 0, window.innerHeight - 10);

		this.external.Quittable.draw(game);
	}
}