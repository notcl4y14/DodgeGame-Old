let ToNumber = function (num1, num2) {
	if (!num1 || !num2) {
		return null;
	}
	
	switch (num1.constructor) {
		case Number:
			return num1;
		case UIPercentage:
			return num2/100 * num1.number;
		
		default:
			return null;
	}
}

function getPos (v) {
	if (v.constructor.name == "UI") {
		return { x: 0, y: 0 };
	}
	
	let parentPos = getPos(v.parent);
	let left = ToNumber(v.styles.left, v.parent.size.width - parentPos.x);
	let right = ToNumber(v.styles.right, v.parent.size.width - parentPos.x);
	let top = ToNumber(v.styles.top, v.parent.size.height + parentPos.y);
	let bottom = ToNumber(v.styles.bottom, v.parent.size.height + parentPos.y);

	let x = v.styles["left"] == null ? v.position.x : left;
	let y = v.styles["top"] == null ? v.position.y : top;

	if (v.styles["left"] == null) {
		x = v.styles["right"] == null ? x : v.parent.size.width - right;
	}
	
	if (v.styles["top"] == null) {
		y = v.styles["bottom"] == null ? y : v.parent.size.height - bottom;
	}

	x += parentPos.x;
	y += parentPos.y;

	return { x, y };
}

class UI {
	constructor () {
		this.tree = [];
	}
	
	get position () {
		return {
			x: 0,
			y: 0
		};
	}

	get size () {
		return {
			width: window.innerWidth,
			height: window.innerHeight
		};
	}

	clear () {
		this.tree = [];
	}

	add (v) {
		let index = this.tree.push(v);
		index -= 1;
		this.tree[index].parent = this;
		return index;
	}

	update () {
		for (let v of this.tree) {
			let Input = game.input;
			let mouse = Input.mouse;
			let mouseX = mouse.x;
			let mouseY = mouse.y;

			let mouseOn = collides(
				{
					x: mouseX,
					y: mouseY
				},
				{ width: 0, height: 0 },
				{
					x: v.position.x,
					y: v.position.y
				},
				{
					width: v.size.width,
					height: v.size.height
				}
			);

			let mouseDown = Input.isAnyButtonDown();

			if (mouseOn && !v._.mouseOn) {
				v._.mouseOn = true;
				v.onMouseEnter(mouse);
			} else if (!mouseOn && v._.mouseOn) {
				v._.mouseOn = false;
				v.onMouseLeave(mouse);
			}

			if (mouseOn) {
				if (mouseDown && !v._.mouseDown) {
					v._.mouseDown = true;
					v.onMouseClick(mouse);
				} else if (!mouseDown && v._.mouseDown) {
					v._.mouseDown = false;
					v.onMouseRelease(mouse);
				}
			}

			v.update();
		}
	}

	draw () {
		for (let v of this.tree) {
			v.draw();
		}
	}
}

class UIPercentage {
	constructor (number) {
		this.number = number;
	}
}

class UIElement {
	constructor (position, size, origin = {x: 0, y: 0}) {
		this.position = position;
		this.size = size;
		this.styles = {};
		
		this.parent = null;
		this.children = [];

		this._ = {
			mouseOn: false,
			mouseDown: false
		}
	}

	addChild (v) {
		let index = this.children.push(v);
		index -= 1;
		this.children[index].parent = this;
		return index;
	}

	onMouseEnter (mouse) {}
	onMouseLeave (mouse) {}
	onMouseClick (mouse) {}
	onMouseRelease (mouse) {}

	update () {}
	draw () {}
}

class UIPanel extends UIElement {
	constructor (position, size, color) {
		super(position, size);

		this.styles["background-color"] = color;
	}

	update () {}
	draw () {
		let { x, y } = getPos(this);
		let width = this.size.width;
		let height = this.size.height;

		game.context.fillStyle = this.styles["background-color"];
		game.context.fillRect(x, y, width, height);

		this.children.forEach((v) => {
			v.draw();
		});
	}
}

class UIButton extends UIElement {
	constructor (position, size, label, bgColor, labelColor) {
		super(position, size);
		this.label = label;
		
		this.styles = {
			"background-color": bgColor,
			"color": labelColor
		};

		if (typeof(this.label) == "string") {
			this.label = new UILabel(position, size, label, labelColor);
		}
		
		this.label.parent = this;
		this.label.styles["left"] = new UIPercentage(50);
		this.label.styles["top"] = new UIPercentage(50);
	}

	update () {}
	draw () {
		let { x, y } = getPos(this);
		let width = this.size.width;
		let height = this.size.height;

		game.context.fillStyle = this.styles["background-color"];
		game.context.fillRect(x, y, width, height);

		this.label.draw();
	}
}

class UILabel extends UIElement {
	constructor (position, size, label, color) {
		super(position, size);
		this.label = label;
		
		this.styles = {
			"color": color
		};
	}

	update () {}
	draw () {
		let { x, y } = getPos(this);

		game.context.textAlign = "center";
		game.context.textBaseline = "middle";
		game.context.fillStyle = this.styles["color"];
		game.context.fillText(this.label, x, y);

		// game.context.textBaseline = "middle";
	}
}