class Game {
	constructor () {
		this.canvas = null;
		this.context = null;

		this.state = State.MainMenu;

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

	// ============================== //

	resizeCanvas () {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	restart () {
		// location.reload();
		this.setState(State.MainMenu);
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
		this.state = new state();
		State.loadIncludes(this.state);
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