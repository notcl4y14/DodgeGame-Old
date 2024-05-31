class State {
	constructor (name, include = []) {
		this.name = name;
		this.include = include;
	}

	static loadIncludes (state) {

		if (state.include) {
			state.external = {};
			
			for (let value of state.include) {
				let externalState = new State[value]();
				state.external[externalState.name] = externalState;
			}
		}
		
	}
 
	load (game) {}
	update (game) {}
	draw (game) {}
}