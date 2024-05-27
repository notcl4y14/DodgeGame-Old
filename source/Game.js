class Game {
	constructor () {
		this.Canvas = null;
		this.Context = null;

		this.State = Game.State.MainMenu;

		this.Settings = {
			BackgroundColor: "rgb(10,10,10)",
			Controls: {
				MoveLeft: "KeyA",
				MoveRight: "KeyD",
				MoveUp: "KeyW",
				MoveDown: "KeyS",
				Dash: "Space"
			}
		};

		this.Input = new Input();

		this.Objects = [];
		this.Particles = [];
		this.SpawnQueue = new Queue();

		this.Ticks = 0;
		this.running = false;
	}

	static State = {
		MainMenu: 0,
		Play: 1,
		GameOver: 2
	};

	// ============================== //

	resizeCanvas () {
		this.Canvas.width = window.innerWidth;
		this.Canvas.height = window.innerHeight;
	}

	restart () {
		location.reload();
	}
	
	spawn (v) {
		let index = this.Objects.push(v);
		return index - 1;
	}
	
	spawnParticle (v) {
		let index = this.Particles.push(v);
		return index - 1;
	}

	// ============================== //

	async loop () {
		if (!this.running) return;

		this.Ticks++;
		
		this.checkCollisions();
		this.update();
		this.draw();
	
		requestAnimationFrame(() => this.loop.call(this));
	}

	// ============================== //

	checkCollisions () {
		for (let i = 0; i < this.Objects.length; i++) {
			const ent1 = this.Objects[i];
			
			for (let j = 0; j < this.Objects.length; j++) {
				const ent2 = this.Objects[j];
	
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
					ent1.OnCollisionEnter(ent2);
				} else if (!hasCollision && ent1._.collisions.includes(ent2)) {
					let index = ent1._.collisions.indexOf(ent2);
					ent1._.collisions.splice(index, 1);
					ent1.OnCollisionLeave(ent2);
				}
			}
		}
	}

	// ============================== //
	
	updateObjects () {
		for (let particle of this.Particles) {
			particle.Step();
		}

		this.Objects.forEach(ent => {
			ent.PreStep();
		});
		this.Objects.forEach(ent => {
			ent.Step();
		});
		this.Objects.forEach(ent => {
			ent.PostStep();
		});
	}

	// ============================== //
	
	update () {
		if (this.State == Game.State.GameOver) {
			if (this.Input.isKeyDown("KeyR")) {
				// Resets the game
				// game = new Game();
				this.restart();
				return;
			}
		} else if (this.State == Game.State.MainMenu) {
			if (this.Input.isKeyDown("Space")) {
				this.State = Game.State.Play;
				
				this.Particles = []; // Remove this line if you want the HurtBoxes from the MainMenu to be in game
				this.SpawnQueue.clear();
				initPlayer();
				initLevel();
			
				return;
			}

			if (this.SpawnQueue.queue.length == 0) {
				for (let i = 0; i < 25; i++) {
					let x = Math.floor(Math.random() * window.innerWidth);
					let y = Math.floor(Math.random() * window.innerHeight);

					this.SpawnQueue.add( () => {
						let pos = {x, y};
						let size = {width:25, height:25};
						let color = `rgb(255,0,0)`;
						let vel = {x: 5, y: 5};
						let duration = 75*10;
		
						let randX = Math.randomInt(0, 1);
						let randY = Math.randomInt(0, 1);
		
						if (randX) vel.x *= -1;
						if (randY) vel.y *= -1;
		
						let hurtBox = new HurtBox.DVD(pos, size, color, vel, duration);
	
						hurtBox.onDurationFinish = function () {
							this.boundOnWalls = false;
						}
		
						this.spawnParticle(hurtBox);
					}, 25 );
				}
			}
		}
	
		this.SpawnQueue.step();
		
		this.updateObjects();
	}
	
	draw () {
		this.Context.fillStyle = this.Settings.BackgroundColor;
		this.Context.fillRect(0, 0, this.Canvas.width, this.Canvas.height);
		
		this.Particles.forEach(ent => {
			ent.Draw();
		});
		
		this.Objects.forEach(ent => {
			ent.Draw();
		});

		if (this.State == Game.State.GameOver) {
			let centerW = game.Canvas.width / 2;
			let centerH = game.Canvas.height / 2;

			this.Context.fillStyle = "#000000";
			this.Context.fillRect(centerW - 50, centerH - 20, 50 * 2, 20 * 2);

			let oldFont = this.Context.font;
			this.Context.font = "15px sans-serif";
			this.Context.textAlign = "center";
			this.Context.fillStyle = "#ffffff";
			this.Context.fillText("Game Over", centerW, centerH);
			this.Context.font = oldFont;
			
			this.Context.fillText("Press R to restart", centerW, centerH + 12.5);
		} else if (this.State == Game.State.MainMenu) {
			let centerW = game.Canvas.width / 2;
			let centerH = game.Canvas.height / 2;

			this.Context.fillStyle = "#000000";
			this.Context.fillRect(centerW - 75, centerH - 20, 75 * 2, 20 * 2);

			let oldFont = this.Context.font;
			this.Context.font = "15px sans-serif";
			this.Context.textAlign = "center";
			this.Context.fillStyle = "#ffffff";
			this.Context.fillText("Press Space to start", centerW, centerH);
			this.Context.font = oldFont;

			this.Context.fillStyle = "#000000";
			this.Context.fillRect(centerW + 100, centerH - 20, 75 * 2, 35 * 2);

			this.Context.font = "20px sans-serif";
			this.Context.textAlign = "center";
			this.Context.fillStyle = "#ffffff";
			this.Context.fillText("Controls", centerW + 175, centerH);
			
			this.Context.font = "15px sans-serif";
			this.Context.textAlign = "left";
			this.Context.fillText("WASD - Move", centerW + 105, centerH + 20);
			this.Context.fillText("Space - Dash", centerW + 105, centerH + 40);
			this.Context.font = oldFont;
		}
	}
}

class Input {
	constructor () {
		this.Keys = [];
	}

	// ============================== //

	isKeyDown (key) {
		return this.Keys[key]
			? this.Keys[key]
			: false;
	}

	isKeyUp (key) {
		return this.Keys[key]
			? !this.Keys[key]
			: true;
	}
}