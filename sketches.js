const starBad = p => {

	p.setup = function() {
		commonSetup(p, "star-bad")
		p.polygon = star
		p.guards = [
			new Point(375, 175),
			new Point(300, 100),
			new Point(225, 175),
			new Point(300, 250),
		]
	};

	p.draw = function() {
		commonDraw(p)
	};
};

const starOptimal = p => {

	p.setup = function() {
		commonSetup(p, "star-optimal")
		p.polygon = star
		p.guards = [centre]
	};

	p.draw = function() {
		commonDraw(p)
	};
};

const interactive = p => {

	p.setup = function() {
		commonSetup(p, "interactive")
	};

	p.draw = function() {
		commonDraw(p)
	};
};

new p5(starBad)
new p5(starOptimal)
new p5(interactive)
