class SpawnBox extends Entity {
	constructor (pos, size, time, entity, color = "rgb(40,40,40)") {
		super(pos, size, color);

		this.extraSize = time;
		this.entity = entity;
	}

	step () {
		this.extraSize--;

		if (this.extraSize < 0) {
			this.destroy();
			game.spawn(this.entity);
		}
	}

	draw () {
		let x = this.position.x - this.extraSize / 2;
		let y = this.position.y - this.extraSize / 2;
		let width = this.size.width + this.extraSize;
		let height = this.size.height + this.extraSize;

		game.context.fillStyle = this.color;
		game.context.fillRect(x, y, width, height);

		game.context.strokeStyle = "#000000";
		game.context.strokeRect(this.position.x, this.position.y, this.size.width, this.size.height);
	}
}