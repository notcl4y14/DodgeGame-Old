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

	Destroy () {
		let index = game.Objects.indexOf(this);
		
		if (index == -1) {
			index = game.Particles.indexOf(this);
			game.Particles.splice(index, 1);
			return;
		}
		
		game.Objects.splice(index, 1);
	}

	PreStep() {}
	Step() {}
	PostStep() {}

	OnCollisionEnter(other) {}
	OnCollisionLeave(other) {}

	Draw() {
		let x = this.position.x;
		let y = this.position.y;
		let width = this.size.width;
		let height = this.size.height;

		game.Context.fillStyle = this.color;
		game.Context.fillRect(x, y, width, height);
	}
}