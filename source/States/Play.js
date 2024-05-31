State.Play = class extends State {
	constructor () {
		super("Play", ["Quittable"]);
	}

	load (game) {
		game.objects = [];
		game.particles = [];

		initPlayer();
		initLevel();

		this.external.Quittable.load(game);
	}
	
	update (game) {
		this.external.Quittable.update(game);
		game.updateObjects();
	}
	
	draw (game) {
		game.particles.forEach(ent => {
			ent.draw();
		});
		
		game.objects.forEach(ent => {
			ent.draw();
		});

		this.external.Quittable.draw(game);
	}
}