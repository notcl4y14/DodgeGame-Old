class Entity {
	constructor (position, size, color, colTags = []) {
		this.position = position;
		this.size = size;
		this.color = color;

		this.pivot = {x: 0, y: 0};

		this._ = {
			tags: colTags,
			checkCollision: true,
			collisions: []
		};
	}

	// ============================== //

	setPivot (x, y) {
		this.pivot = {x, y};
	}

	positionByPivot () {
		return {
			x: this.position.x - this.pivot.x,
			y: this.position.y - this.pivot.y
		};
	}

	// ============================== //

	hasCollisionTag (name) {
		return this._.tags.includes(name);
	}

	// ============================== //

	leaveTrail () {
		let position = Object.create(this.position);
		let size = Object.create(this.size);
		let color = this.color;
		let particle = new TrailParticle(position, size, color);
		game.spawnParticle(particle);
	}

	// ============================== //

	destroy () {
		let index = game.objects.indexOf(this);
		
		if (index == -1) {
			index = game.particles.indexOf(this);
			game.particles.splice(index, 1);
			return;
		}
		
		game.objects.splice(index, 1);
	}

	preStep () {}
	step () {}
	postStep () {}

	onCollisionEnter (other) {}
	onCollisionLeave (other) {}

	draw () {
		let {x,y} = this.positionByPivot();
		let width = this.size.width;
		let height = this.size.height;

		game.context.fillStyle = this.color;
		game.context.fillRect(x, y, width, height);
	}
}