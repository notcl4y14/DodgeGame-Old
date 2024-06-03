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

	step () {
		this.alpha -= this.decrement;

		if (this.alpha <= 0) {
			this.destroy();
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

	step () {
		this.alpha -= this.decrement;

		if (this.alpha <= 0) {
			this.destroy();
		}

		this.position.x += this.velX;
		this.position.y += this.velY;
		
		let rgb = rgbFromString(this.color);
		this.color = `rgba(${rgb.r},${rgb.g},${rgb.b},${this.alpha})`;
	}
}

class ResizingTrailParticle extends Particle {
	constructor (pos, size, color, increment = 1, alpha = 1, decrement = 0.025) {
		super(pos, size, color);
		this.increment = increment;
		this.alpha = alpha;
		this.decrement = decrement;
	}

	step () {
		this.alpha -= this.decrement;
		
		this.size.width += this.increment;
		this.size.height += this.increment;

		if (this.alpha <= 0) {
			this.destroy();
		}
		
		let rgb = rgbFromString(this.color);
		this.color = `rgba(${rgb.r},${rgb.g},${rgb.b},${this.alpha})`;
	}

	draw () {
		let x = this.position.x;
		let y = this.position.y;
		let width = this.size.width;
		let height = this.size.height;

		game.context.fillStyle = this.color;
		game.context.fillRect(x - width / 2, y - height / 2, width, height);
	}
}