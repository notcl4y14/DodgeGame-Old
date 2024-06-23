class Glow {
	static sprite = new Image();

	// constructor (x, y, color) {
	// 	this.x = x;
	// 	this.y = y;
	// 	this.color = color;
	// }
	
	// https://stackoverflow.com/a/44558286/22146374
	static draw (x, y, color, w = 64, h = 64) {
		// game.context.fillStyle = color;
		// game.context.globalCompositeOperation = 'multiply';
		// game.context.fillRect(x, y, w, h);

		// game.context.globalAlpha = 0.5;
		// game.context.globalCompositeOperation = 'destination-in';
		game.context.drawImage(Glow.sprite, x, y, w, h);

		// game.context.globalCompositeOperation = 'source-over';
	}
}

Glow.sprite.src = "assets/glow.png";