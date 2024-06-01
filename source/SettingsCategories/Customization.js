Settings.Customization = class extends SettingsCategory {
	static name = "Customization";

	constructor () {
		super(
			[
				"Change Color",
				"Load Image",
				"Remove Image"
			],
			Settings
		);
	}

	async update (state, game) {
		let select = game.input.isKeyPressed("Space");
				
		if (select) {
			switch (state.option) {
				case 0:
					let colorPicker = document.getElementById("colorpicker");

					colorPicker.focus();
					colorPicker.click();

					state.isAwaiting = true;

					colorPicker.addEventListener("blur", (e) => {
						// Resetting the input so it wouldn't be detected as pressed
						game.input.keys = [];
						state.isAwaiting = false;
					});

					colorPicker.addEventListener("change", (e) => {
						// Resetting the input so it wouldn't be detected as pressed
						game.input.keys = [];
						game.settings.playerColor = colorPicker.value;
						state.isAwaiting = false;

						localStorage.setItem("player.color", game.settings.playerColor);
					});
			
					break;
				case 1:
					let inputFile = document.getElementById("fileloader");
					let fr = new FileReader();

					inputFile.setAttribute("accept", "image/*");
					// inputFile.setAttribute("multiple", "false");

					inputFile.value = "";

					inputFile.focus();
					inputFile.click();

					state.isAwaiting = true;
					
					inputFile.addEventListener("change", (e) => {
						inputFile.blur();

						// Resetting the input so it wouldn't be detected as pressed
						game.input.keys = [];
						state.isAwaiting = false;

						if (e.target.files.length == 0) {
							return;
						}

						// https://stackoverflow.com/a/11603685/22146374
						fr.addEventListener("load", (event) => {
							game.settings.playerImage = new Image();
							game.settings.playerImage.src = event.target.result;

							localStorage.setItem("player.image", game.settings.playerImage.src);
						}, {once: true});

						fr.readAsDataURL(e.target.files[0])
					}, {once: true});
			
					break;
				case 2:
					let playerImage = game.settings.playerImage;
					let initText = this.options[state.option];

					if (playerImage.width == 0) {
						break;
					}

					this.options[state.option] = "Are you sure? (Enter)";
					state.isAwaiting = true;
			
					let key = await new Promise (resolve => {
						document.addEventListener("keydown", resolve);
					});
					
					this.options[state.option] = initText;
					state.isAwaiting = false;

					if (key.code == "Enter") {
						playerImage = new Image();
						game.settings.playerImage = playerImage;
						
						localStorage.removeItem("player.image");
					}
			
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
			} else {
				text = `${game.settings.prefixn}${text}`;
			}

			let oldFont = game.context.font;
			game.context.textBaseline = "top";
			// game.context.font = "15px Monospace";
			game.setFontSize(15);

			game.context.textAlign = "left";
			game.context.fillStyle = "#ffffff";
			game.context.fillText(text, x, y);

			game.context.font = oldFont;
			game.context.textBaseline = "middle";
		}

		game.context.fillStyle = game.settings.playerColor;
		game.context.fillRect(centerW + panelWPart + 12, startPos.y, 50, 50);

		if (game.settings.playerImage) {
			let pos = {
				x: centerW + panelWPart + 12,
				y: startPos.y + 55
			};

			game.context.drawImage(game.settings.playerImage, pos.x, pos.y, 50, 50);
		}
	}
}