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
		let position = noRef(this.position);
		let size = noRef(this.size);
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

		// 50 / 16  = 3.125
		let glowX = this.position.x - this.size.width / 3.125;
		let glowY = this.position.y - this.size.height / 3.125;
		let glowWidth = this.size.width + (this.size.width / 3.125) * 2;
		let glowHeight = this.size.height + (this.size.height / 3.125) * 2;

		Glow.draw(glowX, glowY, "#ff0000", glowWidth, glowHeight);

		game.context.fillStyle = this.color;
		game.context.fillRect(x, y, width, height);
	}
}