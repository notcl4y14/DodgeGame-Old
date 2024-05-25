class Particle extends Entity {
	constructor (pos, size, color, Step = function(){}) {
		super(pos, size, color);
		this.Step = Step;
	}
}