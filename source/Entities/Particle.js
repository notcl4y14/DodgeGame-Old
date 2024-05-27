class Particle extends Entity {
	constructor (pos, size, color) {
		super(pos, size, color);
	}
}

class TrailParticle extends Particle {
	constructor (pos, size, color, alpha = 0.75, decrement = 0.075) {
		super(pos, size, color);
		this.alpha = alpha;
		this.decrement = decrement;
	}

	Step () {
		this.alpha -= this.decrement;

		if (this.alpha <= 0) {
			this.Destroy();
		}
		
		let rgb = rgbFromString(this.color);
		this.color = `rgba(${rgb.r},${rgb.g},${rgb.b},${this.alpha})`;
	}
}

class MovingTrailParticle extends Particle {
	constructor (pos, size, color, velX = 0, velY = 0, alpha = 1, decrement = 0.0075) {
		super(pos, size, color);
		this.velX = velX;
		this.velY = velY;
		this.alpha = alpha;
		this.decrement = decrement;
	}

	Step () {
		this.alpha -= this.decrement;

		if (this.alpha <= 0) {
			this.Destroy();
		}

		this.position.x += this.velX;
		this.position.y += this.velY;
		
		let rgb = rgbFromString(this.color);
		this.color = `rgba(${rgb.r},${rgb.g},${rgb.b},${this.alpha})`;
	}
}