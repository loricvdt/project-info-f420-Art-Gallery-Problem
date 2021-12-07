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
		const canvas = commonSetup(p, "interactive")
		canvas.mouseClicked(p.click)
		// p.importPolygon()
	};

	p.draw = function() {
		commonDraw(p)
	};

	p.click = function(event) {
		const point = new Point(event.layerX, event.layerY)
		if(p.polygon.length === 0) {
			if(p.points[0] && Math.sqrt((point.x-p.points[0].x)**2 + (point.y-p.points[0].y)**2) < 6) {
				p.closePolygon()
			}
			else if(checkSimplePolygon(point, p.points)) {
				p.points.push(point);
			}
		}
		else if(getRayIntersects(p.polygon, [point, farPoint]).length % 2 !== 0) {
			p.guards.push(point)
		}
	}

	p.clearAll = function() {
		reset(p)
	}

	p.clearGuards = function() {
		resetGuards(p)
	}

	p.closePolygon = function() {
		if (p.polygon.length === 0 && p.points.length > 2 && checkSimplePolygon(p.points[0], p.points.slice(1))) {
			p.polygon = p.points.slice();
			p.points = []
		}
	}

	p.importPolygon = function() {
		reset(p)
		p.polygon = savedPolygon
	}
};

new p5(starBad)
new p5(starOptimal)
const interactiveObject = new p5(interactive)
