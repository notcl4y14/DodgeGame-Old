class HurtBox extends Entity {
	constructor (pos, size, color) {
		super(pos, size, color, ["hurt"]);
	}
}

HurtBox.DVD = class extends HurtBox {
	constructor (pos, size, color, vel, duration) {
		super(pos, size, color);
		this.vel = vel;
		this.duration = duration;
		this.ticks = 0;
	}

	Step () {
		this.position.x += this.vel.x;
		this.position.y += this.vel.y;

		this.ticks++;
		if (this.ticks >= this.duration) {
			this.Destroy();
		}

		if (this.position.x < 0) {
			this.position.x = 0;
			this.vel.x = Math.abs(this.vel.x);
		} else if (this.position.x > game.Canvas.width - this.size.width) {
			this.position.x = game.Canvas.width - this.size.width;
			this.vel.x = -Math.abs(this.vel.x);
		}

		if (this.position.y < 0) {
			this.position.y = 0;
			this.vel.y = Math.abs(this.vel.y);
		} else if (this.position.y > game.Canvas.height - this.size.height) {
			this.position.y = game.Canvas.height - this.size.height;
			this.vel.y = -Math.abs(this.vel.y);
		}

		let x = this.position.x;
		let y = this.position.y;
		let width = this.size.width;
		let height = this.size.height;
		let color = this.color;

		let Step = function () {
			if (!this.alpha) this.alpha = 0.75;

			this.alpha -= 0.075;

			if (this.alpha <= 0) {
				this.Destroy();
			}
			
			let rgb = rgbFromString(this.color);
			this.color = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${this.alpha})`;
		}

		game.spawn(
			new Particle(
				{x, y},
				{width, height},
				color,
				Step
			)
		);
	}
}