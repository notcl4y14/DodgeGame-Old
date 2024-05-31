State.Settings = class extends State {
	constructor () {
		super("Settings", []);
	}

	load (game) {
		this.option = 0;
		this.options = [
			"MoveLeft",
			"MoveRight",
			"MoveUp",
			"MoveDown",
			"Dash"
		];
		this.isAwaiting = false;
	}

	async update (game) {
		if (game.input.isKeyDown("Backspace")) {
			game.setState(State.MainMenu);
			return;
		}

		let up = game.input.isKeyPressed("ArrowUp");
		let down = game.input.isKeyPressed("ArrowDown");
		let select = game.input.isKeyPressed("Space");

		let dir = up - down;

		if (!this.isAwaiting)
			this.option -= dir;
		
		if (this.option < 0) {
			this.option = this.options.length - 1;
		} else if (this.option > this.options.length - 1) {
			this.option = 0;
		}

		if (select && !this.isAwaiting) {
			let option = this.options[this.option];
			
			game.settings.controls[option] = "Awaiting...";
			this.isAwaiting = true;
			
			let key = await new Promise (resolve => {
				document.addEventListener("keydown", resolve);
			});

			game.settings.controls[option] = key.code;
			localStorage.setItem(`controls.${option}`, key.code);
			
			document.addEventListener("keyup", (e) => {
				this.isAwaiting = false;
			}, {once: true});
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

		game.context.fillStyle = "#ffffff";
		game.context.textAlign = "left";
		game.context.fillText("<<< Back (Backspace)", 0, 10);

		game.context.fillStyle = "#000000";
		game.context.fillRect(centerW - panelWPart, centerH - panelHPart, panelWidth, panelHeight);

		game.context.textBaseline = "bottom";
		game.context.fillStyle = "#ffffff";

		// Thanks to Google for the arrows (search: "arrow up"/"arrow up code")
		let arrowUp = String.fromCharCode(8593);
		let arrowDown = String.fromCharCode(8595);
		game.context.fillText(`${arrowUp} ${arrowDown} - Move; Space - Select`,
			startPos.x,
			centerH + panelHPart - offsetY
		);

		for (let i = 0; i < this.options.length; i++) {
			let x = startPos.x;
			let y = startPos.y + i * interval;
			let text = this.options[i];

			let valueX = centerW + panelWPart - offsetX;
			let valueText = game.settings.controls[text];
			
			if (i == this.option) {
				text = `> ${text}`;
			}

			game.context.textBaseline = "top";

			game.context.textAlign = "left";
			game.context.fillStyle = "#ffffff";
			game.context.fillText(text, x, y);

			game.context.textAlign = "right";
			game.context.fillStyle = "#00aa00";
			if (valueText == "Awaiting...") {
				game.context.fillStyle = "#fbce00";
			}
			game.context.fillText(valueText, valueX, y);

			game.context.textAlign = "left";
			game.context.textBaseline = "middle";
		}
	}
}