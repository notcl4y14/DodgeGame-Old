class Game {
	constructor () {
		this.canvas = null;
		this.context = null;

		this.state = Game.State.MainMenu;

		this.settings = {
			bgColor: "rgb(10,10,10)",
			controls: {
				MoveLeft: "KeyA",
				MoveRight: "KeyD",
				MoveUp: "KeyW",
				MoveDown: "KeyS",
				Dash: "Space"
			}
		};

		this.input = new Input();

		this.objects = [];
		this.particles = [];
		this.spawnQueue = new Queue();

		this.ticks = 0;
		this.running = false;

		this.load();
	}

	static State = {
		_Quittable: {
			load: function (game) {
				this.exitTime = 0;
				this.exitTimeMax = 90;
				this.showQuitText = true;
			},

			update: function (game) {
				if (this.exitTime > this.exitTimeMax) {
					game.restart();
				}

				if (game.input.isKeyDown("Escape")) {
					this.exitTime++;
				} else {
					this.exitTime = 0;
				}
			},

			draw: function (game) {
				if (!this.showQuitText) return;
				let fraction = this.exitTimeMax / this.exitTime;
				let alpha = 1 / fraction;
				game.context.textBaseline = "middle";
				game.context.textAlign = "left";
				game.context.fillStyle = `rgba(255,255,255,${alpha})`;
				game.context.fillText(`Quitting to the Main Menu... (${this.exitTime}/${this.exitTimeMax})`, 0, window.innerHeight - 10);
			}
		},
		MainMenu: {
			load: (game) => {},

			update: (game) => {
				if (game.input.isKeyDown("Space")) {
					game.spawnQueue.clear();
					game.setState(Game.State.Play);
					
					// game.particles = []; // Remove game line if you want the HurtBoxes from the MainMenu to be in game
					// initPlayer();
					// initLevel();
				
					return;
				}

				if (game.input.isKeyDown("KeyS")) {
					game.setState(Game.State.Settings);
					
					// game.particles = []; // Remove game line if you want the HurtBoxes from the MainMenu to be in game
					// initPlayer();
					// initLevel();
				
					return;
				}

				if (game.spawnQueue.queue.length == 0) {
					let size = {width:50, height:25};
					let color = `rgb(255,0,0)`;
					let duration = 75*10;
					let onDurationFinish = function () {
						game.boundOnWalls = false;
					}

					// I have NO IDEA how the hurtboxes go off-sync from each other despite that they have been spawned in identical positions
					// But by adding/subtracting them with 10 fixes it
					// what

					// Top-Left
					game.spawnQueue.add( () => {
						let hurtBox = new HurtBox.DVD(
							{x: 0, y: 0},
							size,
							color, {x: 5, y: 5},
							duration
						);
		
						hurtBox.onDurationFinish = onDurationFinish;
		
						game.spawnParticle(hurtBox);
					}, 25);

					// Top-Right
					game.spawnQueue.add( () => {
						let hurtBox = new HurtBox.DVD(
							{x: window.innerWidth - size.width + 10, y: 10},
							size,
							color, {x: -5, y: 5},
							duration
						);
		
						hurtBox.onDurationFinish = onDurationFinish;
		
						game.spawnParticle(hurtBox);
					}, 0);

					// Bottom-Left
					game.spawnQueue.add( () => {
						let hurtBox = new HurtBox.DVD(
							{x: 0, y: window.innerHeight - size.height},
							size,
							color, {x: 5, y: -5},
							duration
						);
		
						hurtBox.onDurationFinish = onDurationFinish;
		
						game.spawnParticle(hurtBox);
					}, 0);

					// Bottom-Right
					game.spawnQueue.add( () => {
						let hurtBox = new HurtBox.DVD(
							{x: window.innerWidth - size.width + 10, y: window.innerHeight - size.height - 10},
							size,
							color, {x: -5, y: -5},
							duration
						);
		
						hurtBox.onDurationFinish = onDurationFinish;
		
						game.spawnParticle(hurtBox);
					}, 0);

					// for (let i = 0; i < 25; i++) {
					// 	let x = Math.floor(Math.random() * window.innerWidth);
					// 	let y = Math.floor(Math.random() * window.innerHeight);

					// 	game.spawnQueue.add( () => {
					// 		let pos = {x, y};
							// let size = {width:25, height:25};
							// let color = `rgb(255,0,0)`;
					// 		let vel = {x: 5, y: 5};
							// let duration = 75*10;
			
					// 		let randX = Math.randomInt(0, 1);
					// 		let randY = Math.randomInt(0, 1);
			
					// 		if (randX) vel.x *= -1;
					// 		if (randY) vel.y *= -1;
			
					// 		let hurtBox = new HurtBox.DVD(pos, size, color, vel, duration);
		
					// 		hurtBox.onDurationFinish = function () {
					// 			game.boundOnWalls = false;
					// 		}
			
					// 		game.spawnParticle(hurtBox);
					// 	}, 25 );
					// }
				}

				game.updateObjects();
			},

			draw: (game) => {
				game.particles.forEach(ent => {
					ent.draw();
				});
				
				game.objects.forEach(ent => {
					ent.draw();
				});

				let centerW = game.canvas.width / 2;
				let centerH = game.canvas.height / 2;
	
				game.context.fillStyle = "#000000";
				game.context.fillRect(centerW - 75, centerH - 20, 75 * 2, 20 * 2);
	
				let oldFont = game.context.font;
				game.context.font = "15px sans-serif";
				game.context.textAlign = "center";
				game.context.fillStyle = "#ffffff";
				game.context.fillText("Press Space to start", centerW, centerH);
				game.context.font = oldFont;
	
				game.context.fillStyle = "#000000";
				game.context.fillRect(centerW - 75, centerH + 30, 75 * 2, 20);

				game.context.font = "12px sans-serif";
				game.context.textAlign = "center";
				game.context.fillStyle = "#ffffff";
				game.context.fillText("Press S to open Settings", centerW, centerH + 43);
				game.context.font = oldFont;
	
				game.context.fillStyle = "#000000";
				game.context.fillRect(centerW + 100, centerH - 20, 75 * 2, 35 * 2);
	
				game.context.font = "20px sans-serif";
				game.context.textAlign = "center";
				game.context.fillStyle = "#ffffff";
				game.context.fillText("Controls", centerW + 175, centerH);
				
				game.context.font = "15px sans-serif";
				game.context.textAlign = "left";
				game.context.fillText("WASD - Move", centerW + 105, centerH + 20);
				game.context.fillText("Space - Dash", centerW + 105, centerH + 40);

				game.context.textBaseline = "middle";
			}
		},
		Settings: {
			load: function (game) {
				this.option = 0;
				this.options = [
					"MoveLeft",
					"MoveRight",
					"MoveUp",
					"MoveDown",
					"Dash"
				];
				this.isAwaiting = false;
			},

			update: async function (game) {
				if (game.input.isKeyDown("Backspace")) {
					game.state = Game.State.MainMenu;
					return;
				}

				let up = game.input.isKeyPressed("ArrowUp");
				let down = game.input.isKeyPressed("ArrowDown");
				let select = game.input.isKeyPressed("Space");
				// let toSpace = game.input.isKeyPressed("KeyF");

				let dir = up - down;

				if (!this.isAwaiting)
					this.option -= dir;
				
				if (this.option < 0) {
					this.option = this.options.length - 1;
				} else if (this.option > this.options.length - 1) {
					this.option = 0;
				}

				// if (toSpace && !this.isAwaiting) {
				// 	let option = this.options[this.option];
				// 	game.settings.controls[option] = "Space";
				// }

				if (select && !this.isAwaiting) {
					// Avoiding the key from being detected as pressed
					// game.input.keys["Space"] = -1;

					// let key = prompt("Choose a key (KeyW, KeyA, LeftShift, Space, ArrowLeft)");
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
			},

			draw: function (game) {
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
					// text = `${text}:${game.settings.controls[text]}`;
					
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
		},
		Play: {
			include: {
				"quit": "_Quittable"
			},

			load: function (game) {
				game.objects = [];
				game.particles = [];

				initPlayer();
				initLevel();

				this.external.quit.load(game);
			},
			update: function (game) {
				this.external.quit.update(game);
				game.updateObjects();
			},
			draw: function (game) {
				game.particles.forEach(ent => {
					ent.draw();
				});
				
				game.objects.forEach(ent => {
					ent.draw();
				});

				this.external.quit.draw(game);
			}
		},
		GameOver: {
			include: {
				"quit": "_Quittable"
			},
			
			load: function (game) {
				this.external.quit.load(game);
				this.external.quit.exitTimeMax = 0;
				this.external.quit.showQuitText = false;
			},

			update: function (game) {
				if (game.input.isKeyDown("KeyR")) {
					// Resets the game
					// game = new Game();
					// game.restart();
					game.setState(Game.State.Play);
					return;
				}

				this.external.quit.update(game);

				game.updateObjects();
			},
			draw: function (game) {
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
				game.context.font = "15px sans-serif";
				game.context.textAlign = "center";
				game.context.textBaseline = "bottom";
				game.context.fillStyle = "#ffffff";
				game.context.fillText("Game Over", centerW, centerH);
				
				game.context.font = "10px sans-serif";
				game.context.fillText("Press R to restart", centerW, centerH + 12.5);
				
				game.context.font = oldFont;
				game.context.textAlign = "left";
				game.context.textBaseline = "middle";
				game.context.fillText("Press Esc to quit to the main menu", 0, window.innerHeight - 10);

				this.external.quit.draw(game);
			}
		}
	};

	// ============================== //

	resizeCanvas () {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	restart () {
		// location.reload();
		this.setState(Game.State.MainMenu);
		this.spawnQueue.clear();
		this.objects = [];
		this.particles = [];
	}
	
	spawn (v) {
		let index = this.objects.push(v);
		return index - 1;
	}
	
	spawnParticle (v) {
		let index = this.particles.push(v);
		return index - 1;
	}

	setState (state) {
		this.state = state;

		if (this.state.include) {
			this.state.external = {};
			
			for (let [key, value] of Object.entries(this.state.include)) {
				this.state.external[key] = Game.State[value];
			}
		}

		this.state.load(this);
	}

	// ============================== //

	load () {
		let localStorage = window.localStorage;
		// localStorage.setItem("controls.MoveLeft", )
		let controls = this.settings.controls;
		
		let setKey = function (key, item) {
			if (item == null) return key;
			return item;
		}

		controls.MoveLeft = setKey( controls.MoveLeft, localStorage.getItem("controls.MoveLeft") );
		controls.MoveRight = setKey( controls.MoveRight, localStorage.getItem("controls.MoveRight") );
		controls.MoveUp = setKey( controls.MoveUp, localStorage.getItem("controls.MoveUp") );
		controls.MoveDown = setKey( controls.MoveDown, localStorage.getItem("controls.MoveDown") );
		controls.Dash = setKey( controls.Dash, localStorage.getItem("controls.Dash") );
	}

	async loop () {
		if (!this.running) return;

		this.ticks++;
		
		this.checkCollisions();
		this.update();
		this.draw();
	
		requestAnimationFrame(() => this.loop.call(this));
	}

	// ============================== //

	checkCollisions () {
		for (let i = 0; i < this.objects.length; i++) {
			const ent1 = this.objects[i];
			
			for (let j = 0; j < this.objects.length; j++) {
				const ent2 = this.objects[j];
	
				if (ent1 === ent2) {
					continue;
				}
	
				let pos1 = ent1.position;
				let size1 = ent1.size;
				let pos2 = ent2.position;
				let size2 = ent2.size;
	
				let hasCollision = collides(pos1, size1, pos2, size2);
				
				if (hasCollision && !ent1._.collisions.includes(ent2)) {
					ent1._.collisions.push(ent2);
					ent1.onCollisionEnter(ent2);
				} else if (!hasCollision && ent1._.collisions.includes(ent2)) {
					let index = ent1._.collisions.indexOf(ent2);
					ent1._.collisions.splice(index, 1);
					ent1.onCollisionLeave(ent2);
				}
			}
		}
	}

	// ============================== //
	
	updateObjects () {
		for (let particle of this.particles) {
			particle.step();
		}

		this.objects.forEach(ent => {
			ent.preStep();
		});
		this.objects.forEach(ent => {
			ent.step();
		});
		this.objects.forEach(ent => {
			ent.postStep();
		});
	}

	// ============================== //
	
	update () {
		this.spawnQueue.step();
		this.state.update(this);
	}
	
	draw () {
		this.context.fillStyle = this.settings.bgColor;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.state.draw(this);
	}
}

class Input {
	constructor () {
		this.keys = [];
		this.mouse = {
			x: 0,
			y: 0,
			buttons: [false, false, false]
		};
	}

	// ============================== //

	isKeyDown (key) {
		return this.keys[key]
			? this.keys[key] >= 0
			: false;
	}

	isKeyUp (key) {
		return this.keys[key]
			? this.keys[key] < 0
			: true;
	}

	isKeyPressed (key) {
		return this.keys[key]
			? this.keys[key] <= 1 && this.keys[key] > -1
			: false;
	}

	async updateKey (index) {
		if (this.keys[index] == -1) {
			return;
		}
		
		this.keys[index] += 1;
		window.requestAnimationFrame(() => this.updateKey(index));
	}

	// ============================== //
	
	isButtonDown (button) {
		return this.mouse.buttons[button]
			? this.mouse.buttons[button]
			: false;
	}
	
	isButtonUp (button) {
		return this.mouse.buttons[button]
			? !this.mouse.buttons[button]
			: true;
	}

	isAnyButtonDown () {
		for (let button of this.mouse.buttons) {
			if (button == true) return true;
		}

		return false;
	}
}