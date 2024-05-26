class SpawnBox extends Entity {
	constructor (pos, size, time, entity, color = "rgb(40,40,40)") {
		super(pos, size, color);

		this.extraSize = time;
		this.entity = entity;
	}

	Step () {
		this.extraSize--;

		if (this.extraSize < 0) {
			this.Destroy();
			game.spawn(this.entity);
		}
	}

	Draw () {
		let x = this.position.x - this.extraSize / 2;
		let y = this.position.y - this.extraSize / 2;
		let width = this.size.width + this.extraSize;
		let height = this.size.height + this.extraSize;

		game.Context.fillStyle = this.color;
		game.Context.fillRect(x, y, width, height);

		game.Context.strokeStyle = "#000000";
		game.Context.strokeRect(this.position.x, this.position.y, this.size.width, this.size.height);
	}
}