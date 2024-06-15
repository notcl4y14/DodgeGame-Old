class Game {
	static version = "1.1";

	constructor () {
		this.canvas = null;
		this.context = null;

		this.state = State.MainMenu;
		this.level = null;

		this.console = new Console();

		this.settings = {
			bgColor: "rgb(10,10,10)",
			controls: {
				MoveLeft: "KeyA",
				MoveRight: "KeyD",
				MoveUp: "KeyW",
				MoveDown: "KeyS",
				Dash: "Space",
				Quit: "KeyQ",
				ToggleConsole: "F2"
			},
			player: {
				color: `rgb(${Math.randomInt(0, 255)},${Math.randomInt(0, 255)},${Math.randomInt(0, 255)})`,
				sprite: new Sprite(),
			},
			prefix: "> ",
			prefixn: "  "
		};

		this.input = new Input();

		this.objects = [];
		this.particles = [];

		this.ticks = 0;
		this.running = false;

		this.load();
	}

	// ============================== //

	setState (state) {
		this.state = new state();
		State.loadIncludes(this.state);
		this.state.load(this);
	}

	restart () {
		if (this.level) this.level.queue.clear();
		this.clearObjects();
		this.setState(State.MainMenu);
	}

	// ============================== //
	
	spawn (v) {
		let index = this.objects.push(v);
		return index - 1;
	}
	
	spawnParticle (v) {
		let index = this.particles.push(v);
		return index - 1;
	}

	clearObjects () {
		this.objects = [];
		this.particles = [];
	}

	// ============================== //

	isControlDown (control) {
		return this.input.isKeyDown(this.settings.controls[control]);
	}

	isControlUp (control) {
		return this.input.isKeyUp(this.settings.controls[control]);
	}

	isControlPressed (control) {
		return this.input.isKeyPressed(this.settings.controls[control]);
	}

	// ============================== //

	load () {
		let localStorage = window.localStorage;
		let settings = this.settings;
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

		settings.player.color = setKey( settings.player.color, localStorage.getItem("player.color") );
		settings.player.sprite.src = setKey( settings.player.sprite.src, localStorage.getItem("player.sprite") );

		settings.prefix = setKey( settings.prefix, localStorage.getItem("prefix.chosen") );
		settings.prefixn = setKey( settings.prefixn, localStorage.getItem("prefix.unchosen") );
	}

	async loop () {
		if (!this.running) return;

		this.ticks++;
		
		this.checkPlayerCollisions();
		this.update();
		this.draw();
	
		requestAnimationFrame(() => this.loop.call(this));
	}

	// ============================== //

	checkCollisions () {
		for (let i = 0; i < this.objects.length; i++) {
			const ent1 = this.objects[i];

			if (!ent1._.checkCollision) {
				continue;
			}
			
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

	// Optimized version of checking collisions between objects
	// Since the only objects we check between each other are player and hurtbox
	// There's no point of checking the collision in other objects

	// UPDATE: Somehow, the checkCollisions() gets 230 ms meanwhile this function is 335
	// Idk how I wrote this to be less performant

	// UPDATE 2: Nevermind, it seems that's because the player exploded later
	// So there was more scripting going on
	
	checkPlayerCollisions () {
		const player = this.objects[0];

		if (!player || player.constructor.name != "Player") {
			return;
		}

		let pos1 = player.position;
		let size1 = player.size;
		
		for (let i = 0; i < this.objects.length; i++) {
			const entity = this.objects[i];
			let pos2 = entity.position;
			let size2 = entity.size;

			let hasCollision = collides(pos1, size1, pos2, size2);
			let inCollisions = player._.collisions.includes(entity);
			
			if (hasCollision && !inCollisions) {
				player._.collisions.push(entity);
				player.onCollisionEnter(entity);
			} else if (!hasCollision && inCollisions) {
				let index = player._.collisions.indexOf(entity);
				player._.collisions.splice(index, 1);
				player.onCollisionLeave(entity);
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
		let toggleConsole = this.isControlPressed("ToggleConsole");

		if (toggleConsole) {
			this.console.open();
			// this.input.keys["F2"] = false;
		}

		if (this.console.isOpened) {
			this.console.step();
			game.input.keys = [];
		}

		if (this.level) this.level.step();
		this.state.update(this);
	}
	
	draw () {
		this.context.fillStyle = this.settings.bgColor;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.state.draw(this);

		if (this.console.isOpened) {
			this.console.draw();
		}
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
		if (this.keys[index] == undefined || this.keys[index] == -1) {
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