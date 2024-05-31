State.Quittable = class extends State {
	constructor () {
		super("Quittable", []);
	}

	load (game) {
		this.exitTime = 0;
		this.exitTimeMax = 50;
		this.showQuitText = true;
	}

	update (game) {
		if (this.exitTime > this.exitTimeMax) {
			game.restart();
		}

		if (game.input.isKeyDown("Escape")) {
			this.exitTime++;
		} else {
			this.exitTime = 0;
		}
	}

	draw (game) {
		if (!this.showQuitText) return;
		let fraction = this.exitTimeMax / this.exitTime;
		let alpha = 1 / fraction;
		game.context.textBaseline = "middle";
		game.context.textAlign = "left";
		game.context.fillStyle = `rgba(255,255,255,${alpha})`;
		game.context.fillText(`Quitting to the Main Menu... (${this.exitTime}/${this.exitTimeMax})`, 0, window.innerHeight - 10);
	}
}