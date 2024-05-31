State.Settings = class extends State {
	constructor () {
		super("Settings", []);
	}

	load (game) {
		this.option = 0;
		this.setting = Settings;
		this.isAwaiting = false;
	}

	async update (game) {
		if (game.input.isKeyPressed("Backspace")) {
			if (this.setting.parent) {
				this.setting = this.setting.parent;
			} else {
				game.setState(State.MainMenu);
			}

			return;
		}

		let up = game.input.isKeyPressed("ArrowUp");
		let down = game.input.isKeyPressed("ArrowDown");

		let dir = up - down;

		if (!this.isAwaiting)
			this.option -= dir;
		
		if (this.option < 0) {
			this.option = this.setting.options.length - 1;
		} else if (this.option > this.setting.options.length - 1) {
			this.option = 0;
		}

		this.setting?.update(this, game);

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

		game.context.fillText(this.setting.name,
			centerW - panelWPart,
			centerH - panelHPart - 10
		);

		this.setting?.draw(this, game);
	}
}

// =============================== //
// Settings Categories
// =============================== //

class SettingsCategory {
	static name = "";
	static options = [];
	static parent = null;

	// constructor (name, options, parent) {
	// 	this.name = name;
	// 	this.options = options;

	// 	this.parent = parent;
	// }

	static update (state, game) {}
	static draw (state, game) {}
}

class Settings extends SettingsCategory {
	static name = "Settings";
	static options = [];
	static parent = null;

	// constructor () {
	// 	super("Settings", [], null);
	// }

	static async update (state, game) {
		let select = game.input.isKeyPressed("Space");

		if (select) {
			state.setting = this.options[state.option];
			state.option = 0;
		}
	}

	static draw (state, game) {
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
				name = `> ${name}`;
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

Settings.Controls = class extends SettingsCategory {
	static name = "Controls";
	static options = [
		"MoveLeft",
		"MoveRight",
		"MoveUp",
		"MoveDown",
		"Dash"
	];
	static parent = Settings;

	static async update (state, game) {
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

	static draw (state, game) {
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

Settings.Customization = class extends SettingsCategory {
	static name = "Customization";
	static options = [
		"Change Color",
		"Load Image",
		"Remove Image"
	];
	static parent = Settings;

	static async update (state, game) {
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

					if (playerImage == null) {
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

	static draw (state, game) {
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
				text = `> ${text}`;
			}

			game.context.textBaseline = "top";

			game.context.textAlign = "left";
			game.context.fillStyle = "#ffffff";
			game.context.fillText(text, x, y);

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

Settings.options = [
	Settings.Controls,
	Settings.Customization
];

// let Settings = {
// 	name: "Settings",
// 	options: [
// 		{
// 			name: "Controls",
// 			parent: null,
			
// 			options: [
// 				"MoveLeft",
// 				"MoveRight",
// 				"MoveUp",
// 				"MoveDown",
// 				"Dash"
// 			],

// 			update: async function (state, game) {
// 				let select = game.input.isKeyPressed("Space");

// 				if (select && !state.isAwaiting) {
// 					let option = state.options[state.option];
					
// 					game.settings.controls[option] = "Awaiting...";
// 					state.isAwaiting = true;
					
// 					let key = await new Promise (resolve => {
// 						document.addEventListener("keydown", resolve);
// 					});
		
// 					game.settings.controls[option] = key.code;
// 					localStorage.setItem(`controls.${option}`, key.code);
					
// 					document.addEventListener("keyup", (e) => {
// 						state.isAwaiting = false;
// 					}, {once: true});
// 				}
// 			},

// 			draw: function (state, game) {
// 				let centerW = game.canvas.width / 2;
// 				let centerH = game.canvas.height / 2;
		
// 				let panelWidth = 500;
// 				let panelHeight = 300;
		
// 				let panelWPart = panelWidth / 2;
// 				let panelHPart = panelHeight / 2;
		
// 				let offsetX = 12;
// 				let offsetY = 12;
		
// 				let interval = 15;
		
// 				let startPos = {
// 					x: centerW - panelWPart + offsetX,
// 					y: centerH - panelHPart + offsetY
// 				}

// 				for (let i = 0; i < this.options.length; i++) {
// 					let x = startPos.x;
// 					let y = startPos.y + i * interval;
// 					let text = this.options[i];
		
// 					let valueX = centerW + panelWPart - offsetX;
// 					let valueText = game.settings.controls[text];
					
// 					if (i == state.option) {
// 						text = `> ${text}`;
// 					}
		
// 					game.context.textBaseline = "top";
		
// 					game.context.textAlign = "left";
// 					game.context.fillStyle = "#ffffff";
// 					game.context.fillText(text, x, y);
		
// 					game.context.textAlign = "right";
// 					game.context.fillStyle = "#00aa00";
// 					if (valueText == "Awaiting...") {
// 						game.context.fillStyle = "#fbce00";
// 					}
// 					game.context.fillText(valueText, valueX, y);
		
// 					game.context.textAlign = "left";
// 					game.context.textBaseline = "middle";
// 				}
// 			}
// 		},
// 		{
// 			name: "Customization",
// 			parent: null,
			
// 			options: [
// 				"Change Color",
// 				"Load Image",
// 				"Remove Image"
// 			],

// 			update: async function (state, game) {
// 				let select = game.input.isKeyPressed("Space");
				
// 				if (select) {
// 					switch (state.option) {
// 						case 0:
// 							let colorPicker = document.getElementById("colorpicker");

// 							colorPicker.focus();
// 							colorPicker.click();

// 							state.isAwaiting = true;

// 							colorPicker.addEventListener("blur", (e) => {
// 								// Resetting the input so it wouldn't be detected as pressed
// 								game.input.keys = [];
// 								state.isAwaiting = false;
// 							});

// 							colorPicker.addEventListener("change", (e) => {
// 								// Resetting the input so it wouldn't be detected as pressed
// 								game.input.keys = [];
// 								game.settings.playerColor = colorPicker.value;
// 								state.isAwaiting = false;

// 								localStorage.setItem("player.color", game.settings.playerColor);
// 							});
					
// 							break;
// 						case 1:
// 							let inputFile = document.getElementById("fileloader");
// 							let fr = new FileReader();

// 							inputFile.setAttribute("accept", "image/*");
// 							// inputFile.setAttribute("multiple", "false");

// 							inputFile.value = "";

// 							inputFile.focus();
// 							inputFile.click();

// 							state.isAwaiting = true;
							
// 							inputFile.addEventListener("change", (e) => {
// 								inputFile.blur();

// 								// Resetting the input so it wouldn't be detected as pressed
// 								game.input.keys = [];
// 								state.isAwaiting = false;

// 								if (e.target.files.length == 0) {
// 									return;
// 								}

// 								// https://stackoverflow.com/a/11603685/22146374
// 								fr.addEventListener("load", (event) => {
// 									game.settings.playerImage = new Image();
// 									game.settings.playerImage.src = event.target.result;

// 									localStorage.setItem("player.image", game.settings.playerImage.src);
// 								}, {once: true});

// 								fr.readAsDataURL(e.target.files[0])
// 							}, {once: true});
					
// 							break;
// 						case 2:
// 							let playerImage = game.settings.playerImage;
// 							let initText = this.options[state.option];

// 							if (playerImage == null) {
// 								break;
// 							}

// 							this.options[state.option] = "Are you sure? (Enter)";
// 							state.isAwaiting = true;
					
// 							let key = await new Promise (resolve => {
// 								document.addEventListener("keydown", resolve);
// 							});
							
// 							this.options[state.option] = initText;
// 							state.isAwaiting = false;

// 							if (key.code == "Enter") {
// 								playerImage = new Image();
// 								game.settings.playerImage = playerImage;
								
// 								localStorage.removeItem("player.image");
// 							}
					
// 							break;
// 					}
// 				}
// 			},

// 			draw: function (state, game) {
// 				let centerW = game.canvas.width / 2;
// 				let centerH = game.canvas.height / 2;
		
// 				let panelWidth = 500;
// 				let panelHeight = 300;
		
// 				let panelWPart = panelWidth / 2;
// 				let panelHPart = panelHeight / 2;
		
// 				let offsetX = 12;
// 				let offsetY = 12;
		
// 				let interval = 15;
		
// 				let startPos = {
// 					x: centerW - panelWPart + offsetX,
// 					y: centerH - panelHPart + offsetY
// 				}

// 				for (let i = 0; i < this.options.length; i++) {
// 					let x = startPos.x;
// 					let y = startPos.y + i * interval;
// 					let text = this.options[i];
					
// 					if (i == state.option) {
// 						text = `> ${text}`;
// 					}
		
// 					game.context.textBaseline = "top";
		
// 					game.context.textAlign = "left";
// 					game.context.fillStyle = "#ffffff";
// 					game.context.fillText(text, x, y);

// 					game.context.textBaseline = "middle";
// 				}

// 				game.context.fillStyle = game.settings.playerColor;
// 				game.context.fillRect(centerW + panelWPart + 12, startPos.y, 50, 50);

// 				if (game.settings.playerImage) {
// 					let pos = {
// 						x: centerW + panelWPart + 12,
// 						y: startPos.y + 55
// 					};

// 					game.context.drawImage(game.settings.playerImage, pos.x, pos.y, 50, 50);
// 				}
// 			}
// 		}
// 	],

// 	update: function (state, game) {
// 		let select = game.input.isKeyPressed("Space");

// 		if (select) {
// 			state.setting = this.options[state.option];
// 			state.option = 0;
// 		}
// 	},

// 	draw: function (state, game) {
// 		let centerW = game.canvas.width / 2;
// 		let centerH = game.canvas.height / 2;

// 		let panelWidth = 500;
// 		let panelHeight = 300;

// 		let panelWPart = panelWidth / 2;
// 		let panelHPart = panelHeight / 2;

// 		let offsetX = 12;
// 		let offsetY = 12;

// 		let interval = 15;

// 		let startPos = {
// 			x: centerW - panelWPart + offsetX,
// 			y: centerH - panelHPart + offsetY
// 		}

// 		for (let i = 0; i < this.options.length; i++) {
// 			let x = startPos.x;
// 			let y = startPos.y + i * interval;
// 			let name = this.options[i].name;
			
// 			if (i == state.option) {
// 				name = `> ${name}`;
// 			}

// 			game.context.textBaseline = "top";

// 			game.context.textAlign = "left";
// 			game.context.textBaseline = "top";
// 			game.context.fillStyle = "#ffffff";
// 			game.context.fillText(name, x, y);

// 			game.context.textBaseline = "middle";
// 		}
// 	}
// }

// Settings.options[0].parent = Settings;
// Settings.options[1].parent = Settings;