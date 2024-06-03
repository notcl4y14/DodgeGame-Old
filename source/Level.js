class Level {
	constructor () {
		this.name = "";
		this.length = 0;
		
		this.paused = true;
		this.finished = false;
		this.ticks = 0;
		this.queue = new Queue();
	}

	// ============================== //

	start () {
		this.paused = false;
	}

	stop () {
		this.paused = true;
	}

	reset () {
		this.ticks = 0;
		this.finished = false;
		this.start();
	}

	// ============================== //

	step () {
		if (this.ticks >= this.length) {
			this.finished = true;
			this.stop();
		}

		if (this.paused) return;
		this.queue.step();
		this.ticks++;
	}
}