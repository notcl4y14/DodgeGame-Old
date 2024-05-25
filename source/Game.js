let game = {
	Canvas: null,
	Context: null,

	// ============================== //

	Settings: {
		BackgroundColor: "rgb(10,10,10)",
		Controls: {
			MoveLeft: "KeyA",
			MoveRight: "KeyD",
			MoveUp: "KeyW",
			MoveDown: "KeyS",
			Dash: "Space"
		}
	},

	Input: {
		Keys: []
	},

	// ============================== //
	
	Objects: [],

	// ============================== //
	
	Ticks: 0
};

// ============================== //

game.Input.isKeyDown = function(key) {
	return this.Keys[key]
		? this.Keys[key]
		: false;
}

game.Input.isKeyUp = function(key) {
	return this.Keys[key]
		? !this.Keys[key]
		: true;
}

// ============================== //

game.resizeCanvas = function() {
	this.Canvas.width = window.innerWidth;
	this.Canvas.height = window.innerHeight;
}

// ============================== //

game.tick = function() {
	this.Ticks++;
	
	this.checkCollisions();
	this.update();
	this.draw();

	requestAnimationFrame(() => game.tick.call(this));
}

// ============================== //

game.checkCollisions = function () {
	for (let i = 0; i < game.Objects.length; i++) {
		const ent1 = game.Objects[i];
		
		for (let j = 0; j < game.Objects.length; j++) {
			const ent2 = game.Objects[j];

			if (ent1 === ent2) {
				continue;
			}

			let pos1 = ent1.position;
			let size1 = ent1.size;
			let pos2 = ent2.position;
			let size2 = ent2.size;

			let hasCollision = collides(pos1, size1, pos2, size2);
			
			if (hasCollision && !ent1._.collisions.includes(ent2)) {
				ent1._.collisions.push(ent2);
				ent1.OnCollisionEnter(ent2);
			} else if (!hasCollision && ent1._.collisions.includes(ent2)) {
				let index = ent1._.collisions.indexOf(ent2);
				ent1._.collisions.splice(index, 1);
				ent1.OnCollisionLeave(ent2);
			}
		}
	}
}

game.update = function() {
	game.Objects.forEach(ent => {
		ent.PreStep();
	});
	game.Objects.forEach(ent => {
		ent.Step();
	});
	game.Objects.forEach(ent => {
		ent.PostStep();
	});
}

game.draw = function() {
	game.Context.fillStyle = this.Settings.BackgroundColor;
	game.Context.fillRect(0, 0, game.Canvas.width, game.Canvas.height);
	
	game.Objects.forEach(ent => {
		ent.Draw();
	});
}