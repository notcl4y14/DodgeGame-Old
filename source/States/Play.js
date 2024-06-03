State.Play = class extends State {
	constructor () {
		super("Play", ["Quittable"]);
	}

	load (game) {
		game.objects = [];
		game.particles = [];

		initPlayer();
		initLevel();

		this.external.Quittable.load(game);
	}
	
	update (game) {
		this.external.Quittable.update(game);
		game.updateObjects();

		if (game.level.finished) {
			// game.setState(State.MainMenu);
			// game.restart();
			game.setState(State.Success);
		}
	}
	
	draw (game) {
		game.particles.forEach(ent => {
			ent.draw();
		});
		
		game.objects.forEach(ent => {
			ent.draw();
		});

		let centerW = window.innerWidth / 2;
		let offsetY = -25;
		let rectWidth = 500;
		let rectHeight = 25;
		let rectWPart = rectWidth / 2;
		let rectHPart = rectHeight / 2;

		game.context.strokeStyle = "rgba(255,255,255,0.25)";
		game.context.strokeRect(
			centerW - rectWPart,
			window.innerHeight - rectHPart + offsetY,
			rectWidth,
			rectHeight
		);

		let innerOffsetX = 4;
		let innerOffsetY = 4;
		let width = (rectWidth - innerOffsetX * 2) * (game.level.ticks / game.level.length);

		game.context.fillStyle = "rgba(255,255,255,0.25)";
		game.context.fillRect(
			centerW - rectWPart + innerOffsetX,
			window.innerHeight - rectHPart + offsetY + innerOffsetY,
			width,
			rectHeight - innerOffsetY * 2
		);

		this.external.Quittable.draw(game);
	}
}