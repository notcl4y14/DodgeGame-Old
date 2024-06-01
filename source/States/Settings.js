State.Settings = class extends State {
	constructor () {
		super("Settings", []);
	}

	load (game) {
		this.option = 0;
		this.category = new Settings();
		this.isAwaiting = false;
	}

	async update (game) {

		// =============================== //
		// Go Back
		// =============================== //
		
		if (game.input.isKeyPressed("Backspace")) {
			if (this.category.parent) {
				this.category = new this.category.parent();
			} else {
				game.setState(State.MainMenu);
			}

			return;
		}

		// =============================== //
		// Move between options
		// =============================== //

		let up = game.input.isKeyPressed("ArrowUp");
		let down = game.input.isKeyPressed("ArrowDown");

		let dir = up - down;

		if (!this.isAwaiting)
			this.option -= dir;

		// =============================== //
		// Cap the movement
		// =============================== //
		
		if (this.option < 0) {
			this.option = this.category.options.length - 1;
		} else if (this.option > this.category.options.length - 1) {
			this.option = 0;
		}

		// =============================== //
		// Update Category
		// =============================== //

		this.category.update(this, game);

		// =============================== //
		// Update Game Background
		// =============================== //

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

		let panelWidth = 500;
		let panelHeight = 300;

		let panelWPart = panelWidth / 2;
		let panelHPart = panelHeight / 2;

		let offsetX = 12;
		let offsetY = 12;

		let interval = 15;

		let startPos = {
			x: centerW - panelWPart + offsetX,
			y: centerH - panelHPart + offsetY
		}

		// =============================== //
		// Back text
		// =============================== //

		game.context.fillStyle = "#ffffff";
		game.context.textAlign = "left";
		game.context.fillText("<<< Back (Backspace)", 0, 10);

		// =============================== //
		// Body Frame
		// =============================== //

		game.context.fillStyle = "#000000";
		game.context.fillRect(
			centerW - panelWPart,
			centerH - panelHPart,
			panelWidth,
			panelHeight
		);

		// =============================== //
		// Instructions
		// =============================== //

		game.context.textBaseline = "bottom";
		game.context.fillStyle = "#ffffff";

		// Thanks to Google for the arrows (search: "arrow up"/"arrow up code")
		let arrowUp = String.fromCharCode(8593);
		let arrowDown = String.fromCharCode(8595);
		game.context.fillText(`${arrowUp} ${arrowDown} - Move; Space - Select`,
			startPos.x,
			centerH + panelHPart - offsetY
		);

		// =============================== //
		// Settings Category name
		// =============================== //

		let categoryName = this.category.constructor.name;

		let measure = game.context.measureText(categoryName);

		game.context.fillStyle = "#000000";
		game.context.fillRect(
			centerW - panelWPart,
			centerH - panelHPart - 35,
			measure.width + 20,
			30
		);

		game.context.textBaseline = "middle";
		game.context.fillStyle = "#ffffff";
		game.context.fillText(
			categoryName,
			centerW - panelWPart + 10,
			centerH - panelHPart - 20
		);

		// =============================== //
		// Draw category
		// =============================== //

		this.category.draw(this, game);
	}
}