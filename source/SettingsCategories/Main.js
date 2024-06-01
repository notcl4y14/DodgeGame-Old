class Settings extends SettingsCategory {
	static name = "Settings";

	constructor () {
		super(
			[
				Settings.Controls,
				Settings.Customization,
				Settings.Settings
			],
			null
		);
	}

	async update (state, game) {
		let select = game.input.isKeyPressed("Space");

		if (select) {
			state.category = new this.options[state.option]();
			state.option = 0;
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
			let name = this.options[i].name;
			
			if (i == state.option) {
				name = `${game.settings.prefix}${name}`;
			} else {
				name = `${game.settings.prefixn}${name}`;
			}

			game.context.textBaseline = "top";

			game.context.textAlign = "left";
			game.context.textBaseline = "top";
			game.context.fillStyle = "#ffffff";
			game.context.fillText(name, x, y);

			game.context.textBaseline = "middle";
		}
	}
}