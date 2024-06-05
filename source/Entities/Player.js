class Player extends Entity {
	constructor (position, size, color) {
		super(position, size, color);

		this.default = {
			speed: 5
		};

		this.speed = this.default.speed;
		this.dash = 100;
		this.dashMax = 100;
		this.glow = 0;
	}

	explode () {
		let partsX = 4;
		let partsY = 4;
		
		for (let partX = 0; partX < partsX; partX++) {
			for (let partY = 0; partY < partsY; partY++) {
				let width = this.size.width / partsX;
				let height = this.size.height / partsY;
				let x = this.position.x + (partX * width);
				let y = this.position.y + (partY * height);
				let color = this.color;
				let velX = partX - (partsX / 2.5);
				let velY = partY - (partsY / 2.5);

				// Try "let velX = partX - (partsX / 2.5) * (partX * 2.5);"
				// And touch the HurtBox :P

				let position = {x, y};
				let size = {width, height};

				let particle = new MovingTrailParticle(position, size, color, velX, velY);
				game.spawnParticle(particle);
			}
		}
	}

	shine () {
		let position = this.positionByPivot();
		let size = noRef(this.size);
		let color = this.color;

		let particle = new ResizingTrailParticle(position, size, color);
		let particle2 = new ResizingTrailParticle(position, size, color, 4, 0.75);
		let particle3 = new ResizingTrailParticle(position, size, color, 25, 0.75);

		game.spawnParticle(particle);
		game.spawnParticle(particle2);
		game.spawnParticle(particle3);
	}

	onCollisionEnter (entity) {
		if (entity.hasCollisionTag("hurt")) {
			this.explode();
			this.destroy();

			game.setState(State.GameOver);
		}
	}
	
	preStep () {
		let keyLeft = game.isControlDown("MoveLeft");
		let keyRight = game.isControlDown("MoveRight");
		let keyUp = game.isControlDown("MoveUp");
		let keyDown = game.isControlDown("MoveDown");
		let keySpace = game.isControlDown("Dash");
		
		if (keySpace && this.dash > 0) {
			this.speed = 15;
			this.glow += 1;
		} else {
			this.speed = this.default.speed;
			this.glow = 0;
		}

		let dirX = keyRight - keyLeft;
		let dirY = keyDown - keyUp;
		
		let isMoving = dirX != 0 || dirY != 0;

		// ================ //
		// Dash
		// ================ //

		// If using dash, decrease it
		if (this.dash > 0 && keySpace && isMoving) {
			this.dash -= 1;
		}
		
		// Recharge the Dash
		if (((!isMoving && keySpace) || (isMoving && !keySpace) || (!isMoving && !keySpace)) && this.dash < this.dashMax) {
			this.dash += 5;
		}

		// Cap the Dash charge
		this.dash = Math.clamp(this.dash, 0, this.dashMax);
		
		// ================ //
		
		this.position.x += dirX * this.speed;
		this.position.y += dirY * this.speed;
		
		// ================ //

		if (this.glow) {
			this.leaveTrail();
		}
		
		// ================ //
		
		if (game.input.isKeyPressed("F4")) {
			this.explode();
			this.destroy();
	
			game.setState(State.GameOver);
		}
	}
	
	draw () {
		let x = this.position.x;
		let y = this.position.y;
		let width = this.size.width;
		let height = this.size.height;
		let sprite = game.settings.player.sprite;

		if (!sprite.isValid()) {
			game.context.fillStyle = this.color;
			game.context.fillRect(x, y, width, height);
		} else {
			sprite.draw(game.context, x, y, width, height);
		}

		if (this.dash < this.dashMax) {
			game.context.fillStyle = "rgba(255,255,255,0.5)";
			game.context.fillRect(x, y, this.dash / (this.dashMax / width), height);
		}

		game.context.fillStyle = "white";
		game.context.textAlign = "center";
		game.context.fillText(`${this.dash}/${this.dashMax}`, x + width / 2, y - 10);
	}
}