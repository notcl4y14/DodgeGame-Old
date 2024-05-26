Math.randomInt = function (min, max) {
	max += 1;
	return Math.floor( Math.random() * (max - min) + min );
}

let rgbFromString = function(str) {
	if (str.substring(0, 3) == "rgb") {
		return rgbfsRGB(str);
	} else if (str[0] == "#") {
		return rgbfsHex(str);
	}
}

let rgbfsRGB = function (str) {
	let r = 0;
	let g = 0;
	let b = 0;

	let number = 0;
	let temp = "";
	let state = 0;
	
	/**
	 * States:
	 * 0: None,
	 * 1: Number
	 */

	for (let i = 0; i < str.length; i++) {
		// Already found all the numbers, break
		if (number > 2) {
			break;
		}

		temp += str[i];

		if (state == 1) {
			if (isNaN(parseInt(str[i]))) {
				switch (number) {
					case 0:
						r = parseInt(temp);
					case 1:
						g = parseInt(temp);
					case 2:
						b = parseInt(temp);
				}
				number++;
				temp = "";
				state = 0;
			}
		} else if (!isNaN(parseInt(str[i]))) {
			temp = "";
			state = 1;
			temp += str[i];
		}
	}

	return {r, g, b};
}

let rgbfsHex = function (str) {
	// https://stackoverflow.com/a/5624139/22146374
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	str = str.replace(shorthandRegex, function(m, r, g, b) {
	  return r + r + g + g + b + b;
	});
  
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(str);
	return result ? {
	  r: parseInt(result[1], 16),
	  g: parseInt(result[2], 16),
	  b: parseInt(result[3], 16)
	} : null;
}

// https://love2d.org/wiki/BoundingBox.lua
let collides = function (pos1, size1, pos2, size2) {
	let x1 = pos1.x;
	let y1 = pos1.y;
	let w1 = size1.width;
	let h1 = size1.height;
	let x2 = pos2.x;
	let y2 = pos2.y;
	let w2 = size2.width;
	let h2 = size2.height;

	return x1 < x2+w2 &&
	       x2 < x1+w1 &&
	       y1 < y2+h2 &&
	       y2 < y1+h1;
}