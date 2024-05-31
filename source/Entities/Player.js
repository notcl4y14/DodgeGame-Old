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

	onCollisionEnter(ent) {
		if (ent._.tags.includes("hurt")) {
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

					game.spawnParticle(
						new MovingTrailParticle(
							{x, y},
							{width, height},
							color,
							velX,
							velY
						)
					);
				}
			}

			this.destroy();
			game.setState(State.GameOver);
		}
	}
	
	preStep() {
		let keyLeft = game.input.isKeyDown(game.settings.controls.MoveLeft);
		let keyRight = game.input.isKeyDown(game.settings.controls.MoveRight);
		let keyUp = game.input.isKeyDown(game.settings.controls.MoveUp);
		let keyDown = game.input.isKeyDown(game.settings.controls.MoveDown);
		let keySpace = game.input.isKeyDown(game.settings.controls.Dash);
		
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

		let color = this.color;

		if (this.glow) {
			game.spawnParticle(
				new TrailParticle(
					{x, y},
					{width, height},
					color
				)
			);
		}
	}
	
	draw() {
		let x = this.position.x;
		let y = this.position.y;
		let width = this.size.width;
		let height = this.size.height;

		game.context.fillStyle = this.color;
		game.context.fillRect(x, y, width, height);

		if (this.dash < this.dashMax) {
			game.context.fillStyle = "rgba(255,255,255,0.5)";
			game.context.fillRect(x, y, this.dash / (this.dashMax / width), height);
		}

		game.context.fillStyle = "white";
		game.context.textAlign = "center";
		game.context.fillText(`${this.dash}/${this.dashMax}`, x + width / 2, y - 10);
	}
}