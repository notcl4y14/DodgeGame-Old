class Entity {
	constructor (position, size, color, colTags = []) {
		this.position = position;
		this.size = size;
		this.color = color;

		this._ = {
			tags: colTags,
			collisions: []
		};
	}

	destroy () {
		let index = game.objects.indexOf(this);
		// if (this instanceof HurtBox) console.log(index);
		
		if (index == -1) {
			index = game.particles.indexOf(this);
			game.particles.splice(index, 1);
			return;
		}
		
		game.objects.splice(index, 1);
	}

	preStep() {}
	step() {}
	postStep() {}

	onCollisionEnter(other) {}
	onCollisionLeave(other) {}

	draw() {
		let x = this.position.x;
		let y = this.position.y;
		let width = this.size.width;
		let height = this.size.height;

		game.context.fillStyle = this.color;
		game.context.fillRect(x, y, width, height);
	}
}