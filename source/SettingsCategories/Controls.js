Settings.Controls = class extends SettingsCategory {
	static name = "Controls";

	constructor () {
		super(
			[
				"MoveLeft",
				"MoveRight",
				"MoveUp",
				"MoveDown",
				"Dash"
			],
			Settings
		);
	}

	async update (state, game) {
		let select = game.input.isKeyPressed("Space");

		if (select && !state.isAwaiting) {
			let option = state.options[state.option];
			
			game.settings.controls[option] = "Awaiting...";
			state.isAwaiting = true;
			
			let key = await new Promise (resolve => {
				document.addEventListener("keydown", resolve);
			});

			game.settings.controls[option] = key.code;
			localStorage.setItem(`controls.${option}`, key.code);
			
			document.addEventListener("keyup", (e) => {
				state.isAwaiting = false;
			}, {once: true});
		}
	}

	draw (state, game) {
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

		for (let i = 0; i < this.options.length; i++) {
			let x = startPos.x;
			let y = startPos.y + i * interval;
			let text = this.options[i];

			let valueX = centerW + panelWPart - offsetX;
			let valueText = game.settings.controls[text];
			
			if (i == state.option) {
				text = `${game.settings.prefix}${text}`;
			} else {
				text = `${game.settings.prefixn}${text}`;
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
