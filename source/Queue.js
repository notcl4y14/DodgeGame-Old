class Queue {
	constructor () {
		this.queue = [];
		this.index = 0;
		this.timer = 0;
	}

	get isFinished () {
		return this.index >= this.queue.length;
	}

	add (v, time = 0) {
		let element = new QueueElement(v, time);
		this.queue.push(element);
	}

	clear () {
		this.queue = [];
	}

	step () {
		if (this.isFinished) {
			return;
		}

		let element = this.queue[this.index];
		
		// https://stackoverflow.com/a/7137404/22146374

		this.timer++;

		if (this.timer > element.time) {
			element.func();

			this.timer = 0;
			this.index++;
		}
	}
}

class QueueElement {
	constructor (func, time) {
		this.func = func;
		this.time = time;
	}
}