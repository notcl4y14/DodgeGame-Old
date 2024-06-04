class Sprite {
	constructor () {
		this.img = new Image();
	}

	// ============================== //

	get src () {
		return this.img.src;
	}

	set src (v) {
		this.img.src = v;
	}

	// ============================== //

	loadFromSource (src) {
		this.img.src = src;
		return this;
	}

	// ============================== //

	isLoaded () {
		return this.img.complete;
	}

	isValid () {
		return this.img.width != 0;
	}

	// ============================== //

	draw (context, x, y, dw, dh) {
		// Prevent a still loading or invalid sprite from being drawn
		if (!this.isLoaded() || !this.isValid()) {
			return;
		}

		context.drawImage(this.img, x, y, dw, dh);
	}
}