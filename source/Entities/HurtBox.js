class HurtBox extends Entity {
	constructor (pos, size, color) {
		super(pos, size, color, ["hurt"]);
	}
}

HurtBox.DVD = class extends HurtBox {
	constructor (pos, size, color, vel, duration) {
		super(pos, size, color);
		this.vel = vel;
		this.boundOnWalls = true;
		this.destroyOutOfBounds = true;
		this.duration = duration;
		this.ticks = 0;
	}

	onDurationFinish () {
		this.destroy();
	}

	step () {
		this.position.x += this.vel.x;
		this.position.y += this.vel.y;

		this.ticks++;
		if (this.ticks >= this.duration) {
			this.onDurationFinish();
		}

		if (this.boundOnWalls) {
			if (this.position.x < 0) {
				this.position.x = 0;
				this.vel.x = Math.abs(this.vel.x);
			} else if (this.position.x > game.canvas.width - this.size.width) {
				this.position.x = game.canvas.width - this.size.width;
				this.vel.x = -Math.abs(this.vel.x);
			}
	
			if (this.position.y < 0) {
				this.position.y = 0;
				this.vel.y = Math.abs(this.vel.y);
			} else if (this.position.y > game.canvas.height - this.size.height) {
				this.position.y = game.canvas.height - this.size.height;
				this.vel.y = -Math.abs(this.vel.y);
			}
		}

		if (this.destroyOutOfBounds) {
			if (this.position.x < 0 - this.size.width || this.position.x > game.canvas.width) {
				this.destroy();
				return;
			}
	
			if (this.position.y < 0 - this.size.height || this.position.y > game.canvas.height) {
				this.destroy();
				return;
			}
		}

		let x = this.position.x;
		let y = this.position.y;
		let width = this.size.width;
		let height = this.size.height;
		let color = this.color;
		
		game.spawnParticle(
			new TrailParticle(
				{x, y},
				{width, height},
				color
			)
		);
	}
}