class Console {
	constructor () {
		this.isOpened = false;
		this.log = [];
		this.logMax = 20;

		this.input = "";
		this.inputLog = [];
		this.inputLogMax = 100;
		this.inputLogIndex = -1;

		this.bgColor = "rgba(0,0,0,0.5)";
		this.textColor = "#ffffff";

		this.textOffsetX = 10;
		this.textOffsetY = 10;
		this.lineInterval = 2;

		this.isAwaiting = false;
	}

	// ============================== //

	open () {
		this.isOpened = true;
	}

	close () {
		this.isOpened = false;
	}

	// ============================== //

	addLog (str) {
		this.log.push(str);

		let delta = this.log.length - this.logMax;

		if (delta > 0) {
			for (let i = 0; i < delta; i++) {
				this.log.splice(i, 1);
			}
		}
	}
	
	clearLog () {
		this.log = [];
	}

	// ============================== //

	async interpretInput (str) {
		let returnValue = undefined;

		this.inputLog.splice(0, 0, str);
		
		try {
			returnValue = eval(str);
		} catch (e) {
			this.addLog(e);
		}

		this.addLog(`<- ${returnValue}`);
	}

	// ============================== //

	async step () {
		this.isAwaiting = true;

		if (game.input.isKeyPressed("Backspace")) {
			this.input = this.input.substring(0, this.input.length - 1);
		} else if (game.input.isKeyPressed("Enter")) {
			let input = this.input;
			this.input = "";
			this.inputLogIndex = -1;
			this.interpretInput(input);
		} else if (game.input.isKeyPressed("Escape")) {
			this.close();
		} else if (game.input.isKeyPressed("ArrowUp")) {
			this.inputLogIndex += 1;
			if (this.inputLogIndex >= this.inputLog.length) {
				this.inputLogIndex = this.inputLog.length - 1;
				return;
			}
			this.input = this.inputLog[this.inputLogIndex];
		} else if (game.input.isKeyPressed("ArrowDown")) {
			this.inputLogIndex -= 1;
			this.input = this.inputLog[this.inputLogIndex];

			if (this.inputLogIndex < 0) {
				this.inputLogIndex = -1;
				this.input = "";
			}
		}
			
		let key = await new Promise (resolve => {
			document.addEventListener("keypress", resolve);
		});

		if (!this.isAwaiting) {
			return;
		}
		
		this.input += String.fromCharCode(key.charCode);

		this.isAwaiting = false;
		// for (let i = 0; i < game.input.keys.length; i++) {
		// 	game.input.keys[i] = -1;
		// }
	}

	draw () {
		game.context.fillStyle = this.bgColor;
		game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);

		game.context.textBaseline = "top";
		game.context.fillStyle = this.textColor;
		
		for (let i = 0; i < this.log.length; i++) {
			const line = this.log[i];
			let x = this.textOffsetX;
			let y = this.textOffsetY + (i * 10 * this.lineInterval);
			game.context.fillText(line, x, y);
		}

		game.context.textBaseline = "bottom";
		game.context.fillText(`> ${this.input}`, this.textOffsetX, game.canvas.height - this.textOffsetY);
		game.context.textBaseline = "middle";
	}
}