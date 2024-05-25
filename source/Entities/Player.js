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

	OnCollisionEnter(ent) {
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
					
					// let velX = Math.floor(Math.random() * 2);
					// let velY = Math.floor(Math.random() * 2);

					let Step = function () {
						// if (!this.ticks) this.ticks = 0;
						if (!this.alpha) this.alpha = 1;
						if (!this.velX) this.velX = velX;
						if (!this.velY) this.velY = velY;

						// this.ticks++;
						this.alpha -= 0.0075;

						// if (this.ticks > 200) {
						// 	this.Destroy();
						// }

						if (this.alpha < 0) {
							this.Destroy();
						}

						// let alpha = 1 / this.ticks;
						// if (alpha == Infinity) {
						// 	alpha = 0.1;
						// }

						this.position.x += this.velX;
						this.position.y += this.velY;
						
						let rgb = rgbFromString(this.color);
						this.color = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${this.alpha})`;
					}

					game.Objects.push(
						new Particle(
							{x, y},
							{width, height},
							color,
							Step
						)
					);
				}
			}

			this.position.x = 0;
			this.position.y = 0;
		}
	}
	
	PreStep() {
		let keyLeft = game.Input.isKeyDown(game.Settings.Controls.MoveLeft);
		let keyRight = game.Input.isKeyDown(game.Settings.Controls.MoveRight);
		let keyUp = game.Input.isKeyDown(game.Settings.Controls.MoveUp);
		let keyDown = game.Input.isKeyDown(game.Settings.Controls.MoveDown);
		let keySpace = game.Input.isKeyDown(game.Settings.Controls.Dash);
		
		if (keySpace && this.dash > 0) {
			this.speed = 15;
			this.glow += 1;
		} else {
			this.speed = this.default.speed;
			this.glow = 0;
		}

		let dirX = keyRight - keyLeft;
		let dirY = keyDown - keyUp;

		// ================ //
		// Dash
		// ================ //

		if (this.dash > 0) {
			this.dash -= Math.abs(Math.sign(dirX)) + Math.abs(Math.sign(dirY));
		}
		
		if (!keySpace && this.dash < this.dashMax) {
			this.dash += 5;
		}

		if (this.dash > this.dashMax) this.dash = this.dashMax;
		
		// ================ //
		
		this.position.x += dirX * this.speed;
		this.position.y += dirY * this.speed;
	}
	
	Draw() {
		let x = this.position.x;
		let y = this.position.y;
		let width = this.size.width;
		let height = this.size.height;

		game.Context.fillStyle = this.color;
		game.Context.fillRect(x, y, width, height);

		if (this.dash < this.dashMax) {
			// console.log(this.dash / (this.dashMax / width));
			game.Context.fillStyle = "rgba(255,255,255,0.5)";
			game.Context.fillRect(x, y, this.dash / (this.dashMax / width), height);
		}

		game.Context.fillStyle = "white";
		game.Context.fillText(`${this.dash}/${this.dashMax}`, 0, 10);

		let color = this.color;

		if (this.glow) {
			let Step = function () {
				if (!this.alpha) this.alpha = 0.75;

				this.alpha -= 0.075;

				if (this.alpha <= 0) {
					this.Destroy();
				}
				
				let rgb = rgbFromString(this.color);
				this.color = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${this.alpha})`;
			}

			game.Objects.push(
				new Particle(
					{x, y},
					{width, height},
					color,
					Step
				)
			);
		}
	}
}