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
		const canvas = commonSetup(p, "interactive", 60)
		canvas.mouseClicked(p.click)
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

const triangle = p => {

	p.setup = function() {
		commonSetup(p, "triangle")
		p.polygon = [
			new Point(300, 100),
			new Point(225, 225),
			new Point(375, 225),
		]
		p.guards = [centre]
	};

	p.draw = function() {
		commonDraw(p)
	};
};

const triangulated = p => {

	p.setup = function() {
		commonSetup(p, "triangulated")
		p.polygon = savedPolygon
		p.guards = [
			new Point(119, 272),
			new Point(150, 282),
			new Point(158, 269),
			new Point(155, 254),
			new Point(155, 218),
			new Point(174, 186),
			new Point(210, 205),
			new Point(171, 130),
			new Point(120, 143),
			new Point(200, 98),
			new Point(186, 50),
			new Point(261, 92),
			new Point(283, 139),
			new Point(336, 138),
			new Point(350, 96),
			new Point(347, 52),
			new Point(386, 41),
			new Point(331, 188),
			new Point(310, 217),
			new Point(256, 278),
			new Point(294, 251),
			new Point(367, 226),
			new Point(373, 180),
			new Point(425, 125),
			new Point(478, 126)
		]
		p.lines = savedTriangulation
	};

	p.draw = function() {
		commonDraw(p, false)
	};
};


const coloured = p => {

	p.setup = function() {
		commonSetup(p, "coloured")
		p.polygon = savedPolygon
		p.lines = savedTriangulation
		p.red = [
			savedPolygon[0],
			savedPolygon[8],
			savedPolygon[6],
			savedPolygon[4],
			savedPolygon[24],
			savedPolygon[22],
			savedPolygon[15],
			savedPolygon[13],
			savedPolygon[19],
		]
		p.green = [
			savedPolygon[1],
			savedPolygon[10],
			savedPolygon[3],
			savedPolygon[26],
			savedPolygon[20],
			savedPolygon[23],
			savedPolygon[12],
			savedPolygon[16],
			savedPolygon[18],
		]
		p.blue = [
			savedPolygon[2],
			savedPolygon[9],
			savedPolygon[7],
			savedPolygon[5],
			savedPolygon[25],
			savedPolygon[11],
			savedPolygon[21],
			savedPolygon[14],
			savedPolygon[17],
		]
	};

	p.draw = function() {
		commonDraw(p)
	};
};

const redGuards = p => {

	p.setup = function() {
		commonSetup(p, "redGuards")
		p.polygon = savedPolygon
		p.lines = savedTriangulation
		p.guards = [
			new Point(savedPolygon[0].x+0.5, savedPolygon[0].y),
			savedPolygon[4],
			new Point(savedPolygon[6].x-0.5, savedPolygon[6].y),
			new Point(savedPolygon[8].x, savedPolygon[8].y-0.5),
			savedPolygon[13],
			savedPolygon[15],
			new Point(savedPolygon[19].x, savedPolygon[19].y+0.5),
			savedPolygon[22],
			new Point(savedPolygon[24].x, savedPolygon[24].y+0.5)
		]
	};

	p.draw = function() {
		commonDraw(p)
	};
};

const adjacent = p => {

	p.setup = function() {
		commonSetup(p, "adjacent")
		p.polygon = savedPolygon
		p.lines = savedTriangulation
		p.red = [
			savedPolygon[0],
			savedPolygon[8],
			savedPolygon[6],
			savedPolygon[4],
			savedPolygon[24],
			savedPolygon[22],
			savedPolygon[15],
			savedPolygon[13],
			savedPolygon[19],
		]
		p.greenLines = [
			[savedPolygon[0], savedPolygon[1]],
			[savedPolygon[0], savedPolygon[2]],
			[savedPolygon[0], savedPolygon[10]],
			[savedPolygon[0], savedPolygon[25]],
			[savedPolygon[0], savedPolygon[26]],
			[savedPolygon[4], savedPolygon[3]],
			[savedPolygon[4], savedPolygon[5]],
			[savedPolygon[6], savedPolygon[3]],
			[savedPolygon[6], savedPolygon[5]],
			[savedPolygon[6], savedPolygon[7]],
			[savedPolygon[8], savedPolygon[2]],
			[savedPolygon[8], savedPolygon[3]],
			[savedPolygon[8], savedPolygon[7]],
			[savedPolygon[8], savedPolygon[9]],
			[savedPolygon[8], savedPolygon[10]],
			[savedPolygon[8], savedPolygon[10]],
			[savedPolygon[13], savedPolygon[12]],
			[savedPolygon[13], savedPolygon[14]],
			[savedPolygon[15], savedPolygon[11]],
			[savedPolygon[15], savedPolygon[12]],
			[savedPolygon[15], savedPolygon[14]],
			[savedPolygon[15], savedPolygon[16]],
			[savedPolygon[15], savedPolygon[17]],
			[savedPolygon[15], savedPolygon[20]],
			[savedPolygon[19], savedPolygon[17]],
			[savedPolygon[19], savedPolygon[18]],
			[savedPolygon[19], savedPolygon[20]],
			[savedPolygon[22], savedPolygon[21]],
			[savedPolygon[22], savedPolygon[23]],
			[savedPolygon[24], savedPolygon[10]],
			[savedPolygon[24], savedPolygon[11]],
			[savedPolygon[24], savedPolygon[20]],
			[savedPolygon[24], savedPolygon[21]],
			[savedPolygon[24], savedPolygon[23]],
			[savedPolygon[24], savedPolygon[25]],
		]
		p.yellow = [
			savedPolygon[1],
			savedPolygon[2],
			savedPolygon[3],
			savedPolygon[5],
			savedPolygon[7],
			savedPolygon[9],
			savedPolygon[10],
			savedPolygon[11],
			savedPolygon[12],
			savedPolygon[14],
			savedPolygon[16],
			savedPolygon[17],
			savedPolygon[18],
			savedPolygon[20],
			savedPolygon[21],
			savedPolygon[23],
			savedPolygon[25],
			savedPolygon[26],
		]
	};

	p.draw = function() {
		commonDraw(p)
	};
};

const starShaped = p => {

	p.setup = function() {
		commonSetup(p, "starShaped")
		p.polygon = savedPolygon
		p.red = [
			savedPolygon[0],
			savedPolygon[8],
			savedPolygon[6],
			savedPolygon[4],
			savedPolygon[24],
			savedPolygon[22],
			savedPolygon[15],
			savedPolygon[13],
			savedPolygon[19],
		]
		p.greenLines = [
			[savedPolygon[2], savedPolygon[10]],
			[savedPolygon[25], savedPolygon[10]],
			[savedPolygon[25], savedPolygon[10]],
			[savedPolygon[3], savedPolygon[5]],
			[savedPolygon[3], savedPolygon[7]],
			[savedPolygon[11], savedPolygon[20]],
			[savedPolygon[12], savedPolygon[14]],
			[savedPolygon[17], savedPolygon[20]],
			[savedPolygon[21], savedPolygon[23]],
		]
		for(const i in savedPolygon) {
			p.greenLines.push([savedPolygon[i], savedPolygon[(Number(i) +1) % savedPolygon.length]])
		}
	};

	p.draw = function() {
		commonDraw(p)
	};
};


new p5(starBad)
new p5(starOptimal)
const interactiveObject = new p5(interactive)
new p5(triangle)
new p5(triangulated)
new p5(coloured)
new p5(redGuards)
new p5(adjacent)
new p5(starShaped)
