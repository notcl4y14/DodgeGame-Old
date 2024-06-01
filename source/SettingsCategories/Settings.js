Settings.Settings = class extends SettingsCategory {
	static name = "Settings";

	constructor () {
		super(
			[
				"Prefix (Chosen)",
				"Prefix (Unchosen)",
				"Reset prefixes"
			],
			Settings
		);
	}

	async update (state, game) {
		let select = game.input.isKeyPressed("Space");
				
		if (select) {
			switch (state.option) {
				case 0:
					let prefix = prompt("Type the prefix you want to change to", game.settings.prefix);
					game.settings.prefix = prefix;

					localStorage.setItem("prefix.chosen", prefix);

					// Resetting the input so it wouldn't be detected as pressed
					game.input.keys = [];
			
					break;
				case 1:
					let prefixn = prompt("Type the prefix you want to change to", game.settings.prefixn);
					game.settings.prefixn = prefixn;

					localStorage.setItem("prefix.unchosen", prefixn);

					// Resetting the input so it wouldn't be detected as pressed
					game.input.keys = [];
			
					break;
				case 2:
					game.settings.prefix = "> ";
					game.settings.prefixn = "  ";

					localStorage.removeItem("prefix.chosen");
					localStorage.removeItem("prefix.unchosen");
			
					break;
			}
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
			
			if (i == state.option) {
				text = `${game.settings.prefix}${text}`;

				if (game.settings.prefix == game.settings.prefixn) {
					text = `${text} <<<`;
				}
			} else {
				text = `${game.settings.prefixn}${text}`;
			}

			let oldFont = game.context.font;
			game.context.textBaseline = "top";
			game.setFontSize(15);

			game.context.textAlign = "left";
			game.context.fillStyle = "#ffffff";
			game.context.fillText(text, x, y);

			game.context.font = oldFont;
			game.context.textBaseline = "middle";
		}
	}
}