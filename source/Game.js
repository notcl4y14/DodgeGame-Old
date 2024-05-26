class Game {
	constructor () {
		this.Canvas = null;
		this.Context = null;

		this.State = Game.State.Play;

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
	
	update () {
		if (this.State == Game.State.GameOver) {
			if (game.Input.isKeyDown("KeyR")) {
				// Resets the game
				// game = new Game();
				this.restart();
				return;
			}
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
	
	draw () {
		this.Context.fillStyle = this.Settings.BackgroundColor;
		this.Context.fillRect(0, 0, this.Canvas.width, this.Canvas.height);
		
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