class Queue {
	constructor () {
		this.queue = [];
		this.index = 0;
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

	async start () {
		if (this.isFinished) {
			return;
		}

		let element = this.queue[this.index];
		
		// https://stackoverflow.com/a/7137404/22146374
		await new Promise(resolve => {
			window.setTimeout( resolve, element.time );
		} );
		element.func();

		this.index++;
		this.start();
	}
}

class QueueElement {
	constructor (func, time) {
		this.func = func;
		this.time = time;
	}
}