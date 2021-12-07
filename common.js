class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

const centre = new Point(300, 175)
const farPoint = new Point(10000, 10000)
const star = [
	new Point(425, 175),
	new Point(325, 150),
	new Point(300, 50),
	new Point(275, 150),
	new Point(175, 175),
	new Point(275, 200),
	new Point(300, 300),
	new Point(325, 200),
]
const savedPolygon = [new Point(156, 80), new Point(79, 172), new Point(150, 161), new Point(146, 262), new Point(84, 253), new Point(119, 299), new Point(180, 296), new Point(160, 263), new Point(168, 233), new Point(236, 229), new Point(210, 153), new Point(310, 192), new Point(281, 246), new Point(213, 284), new Point(284, 302), new Point(330, 215), new Point(351, 286), new Point(435, 169), new Point(514, 168), new Point(501, 39), new Point(367, 155), new Point(366, 83), new Point(452, 35), new Point(342, 13), new Point(330, 76), new Point(235, 61), new Point(178, 27),
]
const savedTriangulation = [
	[savedPolygon[0], savedPolygon[2]],
	[savedPolygon[3], savedPolygon[5]],
	[savedPolygon[3], savedPolygon[6]],
	[savedPolygon[3], savedPolygon[7]],
	[savedPolygon[3], savedPolygon[8]],
	[savedPolygon[2], savedPolygon[8]],
	[savedPolygon[10], savedPolygon[8]],
	[savedPolygon[10], savedPolygon[2]],
	[savedPolygon[10], savedPolygon[0]],
	[savedPolygon[25], savedPolygon[0]],
	[savedPolygon[25], savedPolygon[10]],
	[savedPolygon[24], savedPolygon[10]],
	[savedPolygon[23], savedPolygon[21]],
	[savedPolygon[21], savedPolygon[24]],
	[savedPolygon[20], savedPolygon[11]],
	[savedPolygon[24], savedPolygon[11]],
	[savedPolygon[24], savedPolygon[20]],
	[savedPolygon[12], savedPolygon[14]],
	[savedPolygon[12], savedPolygon[15]],
	[savedPolygon[11], savedPolygon[15]],
	[savedPolygon[20], savedPolygon[15]],
	[savedPolygon[19], savedPolygon[17]],
	[savedPolygon[20], savedPolygon[17]],
	[savedPolygon[15], savedPolygon[17]],
]


function reset(p) {
	resetGuards(p)
	p.polygon = []
	p.points = []
	p.lines = []
	p.greenLines = []
	p.red = []
	p.green = []
	p.blue = []
	p.yellow = []
}

function resetGuards(p) {
	p.guards = []
}

function commonSetup(p, parent, frameRate = 10) {
	reset(p)
	let canvas = p.createCanvas(600, 350)
	canvas.parent(parent)
	p.strokeWeight(1)
	p.frameRate(frameRate)
	return canvas
}

function commonDraw(p, sightLines=true) {
	p.background(200)

	// Guards field of view
	p.noStroke()
	p.fill("orange")
	const rayLines = []
	for (const guard of p.guards) {
		rayLines.push(...drawGuardView(p, guard))
	}

	// Guards line of sight
	p.strokeWeight(0.5)
	if(sightLines) {
		p.stroke("white")
		for (const line of rayLines) {
			p.line(line[0].x, line[0].y, line[1].x, line[1].y)
		}
	}

	p.stroke("black")
	p.fill("black")

	// Additional lines
	for(const line of p.lines) {
		p.line(line[0].x, line[0].y, line[1].x, line[1].y)
	}

	p.strokeWeight(1)

	// Connected point list
	let last;
	for (const i in p.points) {
		if (i >= 1) p.line(last.x, last.y, p.points[i].x, p.points[i].y)
		last = p.points[i]
		p.ellipse(p.points[i].x, p.points[i].y, 4, 4)
	}

	// Polygon
	if (p.polygon.length > 0) {
		last = p.polygon[p.polygon.length - 1];
		for (const point of p.polygon) {
			p.line(last.x, last.y, point.x, point.y);
			last = point;
			p.ellipse(point.x, point.y, 4, 4);
		}
	}

	// Green lines
	p.stroke("green")
	p.fill("green")
	for(const line of p.greenLines) {
		p.line(line[0].x, line[0].y, line[1].x, line[1].y)
	}

	// Guard positions
	p.stroke("red")
	p.fill("red")
	for (const guard of p.guards) {
		p.ellipse(guard.x, guard.y, 4, 4)
	}

	// Colouring
	for (const red of p.red) {
		p.ellipse(red.x, red.y, 4, 4)
	}
	p.stroke("lime")
	p.fill("lime")
	for (const green of p.green) {
		p.ellipse(green.x, green.y, 4, 4)
	}
	p.stroke("blue")
	p.fill("blue")
	for (const blue of p.blue) {
		p.ellipse(blue.x, blue.y, 4, 4)
	}
	p.stroke("yellow")
	p.fill("yellow")
	for (const yellow of p.yellow) {
		p.ellipse(yellow.x, yellow.y, 4, 4)
	}
}

function drawGuardView(p, guard) {
	// Find vertices in sight
	const guardView = []
	for(const i in p.polygon) {
		guardView.push(Number(i))
		for(const j in p.polygon) {
			if(i !== j && i !== ((Number(j)+1) % p.polygon.length)) {
				if(intersectSegment(guard, p.polygon[i], p.polygon[j], p.polygon[(Number(j)+1) % p.polygon.length])) {
					guardView.pop()
					break
				}
			}
		}
	}

	// Find correct intersects and draw guard view
	const rayLines = []
	p.beginShape()
	for(const i in guardView) {
		p.vertex(p.polygon[guardView[i]].x, p.polygon[guardView[i]].y)
		// Find intersects if consecutive points are not an edge
		if((guardView[i]+1) % p.polygon.length !== guardView[(Number(i)+1) % guardView.length]) {
			const intersectSegments = findClosestIntersects(p, guard, guardView[i], guardView[(Number(i)+1) % guardView.length])
			for(let segment of intersectSegments) {
				rayLines.push([segment, guard])
				p.vertex(segment.x, segment.y)
			}
		}
	}
	p.endShape()

	return rayLines
}

function orientationDeterminant(a, b, c) {
	/*
	|a.x a.y 1|
	|b.x b.y 1|
	|c.x c.y 1|
	*/
	return a.x * b.y + a.y * c.x + b.x * c.y - a.x * c.y - a.y * b.x - b.y * c.x;
}

function intersectLine(a, b, c, d) {
	// line passing a, b intersects segment [c, d]
	const determinant1 = orientationDeterminant(a, b, c);
	const determinant2 = orientationDeterminant(a, b, d);

	return (
		(determinant1 <= 0 && determinant2 > 0) ||
		(determinant1 > 0 && determinant2 <= 0)
	);
}

function intersectRay(a, b, c, d) {
	// ray from a in b direction intersects segment [c, d]
	const determinant1 = orientationDeterminant(a, b, c);
	const determinant2 = orientationDeterminant(d, c, a);

	return (
		intersectLine(a, b, c, d) &&
		((determinant1 <= 0 && determinant2 <= 0) ||
			(determinant1 >= 0 && determinant2 >= 0))
	);
}

function intersectSegment(a, b, c, d) {
	// segment [a, b] intersects segment [c, d]
	const determinant1 = orientationDeterminant(a, c, d);
	const determinant2 = orientationDeterminant(b, c, d);

	return (
		intersectLine(a, b, c, d) &&
		((determinant1 <= 0 && determinant2 > 0) ||
			(determinant1 > 0 && determinant2 <= 0))
	);
}

function getRayIntersects(polygon, points) {
	const intersects = [];

	for (let i = 0; i < polygon.length; i++) {
		if (intersectRay(points[0], points[1], polygon[i], polygon[i === polygon.length - 1 ? 0 : i + 1]))
			intersects.push([polygon[i], polygon[i === polygon.length - 1 ? 0 : i + 1]]);
	}
	return intersects;
}

function findClosestIntersects(p, guard, first, last) {
	const leftIntersects = []
	const rightIntersects = []
	// Find all intersects of polygon edges with the ray from the guard to the polygon vertex
	for(let i = first; (first > last && i >= first && i < p.polygon.length) || i < last; i = (i+1) % p.polygon.length) {
		if(i !== first && intersectRay(guard, p.polygon[first], p.polygon[i], p.polygon[(i+1) % p.polygon.length])) {
			leftIntersects.push([calculateIntersect(guard, p.polygon[first], p.polygon[i], p.polygon[(i + 1) % p.polygon.length]), p.polygon[first]])
		}
		if((i+1) % p.polygon.length !== last && intersectRay(guard, p.polygon[last], p.polygon[i], p.polygon[(i+1) % p.polygon.length])) {
			rightIntersects.push([calculateIntersect(guard, p.polygon[last], p.polygon[i], p.polygon[(i + 1) % p.polygon.length]), p.polygon[last]])
		}
	}

	// Find the closest point to the polygon vertex
	let bestLeft
	if(leftIntersects.length > 0) {
		bestLeft = leftIntersects[0]
		for(let challenger of leftIntersects) {
			if((challenger[0].x-challenger[1].x)**2 + (challenger[0].y-challenger[1].y)**2 < (bestLeft[0].x-bestLeft[1].x)**2 + (bestLeft[0].y-bestLeft[1].y)**2) {
				bestLeft = challenger
			}
		}
	}

	let bestRight
	if(rightIntersects.length > 0) {
		bestRight = rightIntersects[0]
		for(let challenger of rightIntersects) {
			if((challenger[0].x-challenger[1].x)**2 + (challenger[0].y-challenger[1].y)**2 < (bestRight[0].x-bestRight[1].x)**2 + (bestRight[0].y-bestRight[1].y)**2) {
				bestRight = challenger
			}
		}
	}

	// Remove the ones passing outside the polygon
	if(bestLeft !== undefined && getRayIntersects(p.polygon, [new Point((p.polygon[first].x + bestLeft[0].x)/2, (p.polygon[first].y + bestLeft[0].y)/2), farPoint]).length % 2 === 0) {
		bestLeft = undefined
	}
	if(bestRight !== undefined && getRayIntersects(p.polygon, [new Point((p.polygon[last].x + bestRight[0].x)/2, (p.polygon[last].y + bestRight[0].y)/2), farPoint]).length % 2 === 0) {
		bestRight = undefined
	}

	if(bestLeft !== undefined && bestRight !== undefined) {
		return [bestLeft[0], bestRight[0]]
	}
	else if(bestLeft !== undefined) {
		return [bestLeft[0]]
	}
	else if(bestRight !== undefined) {
		return [bestRight[0]]
	}
	else {
		return []
	}
}

function calculateIntersect(a, b, c, d) {
	const dx1 = b.x - a.x
	const dx2 = c.x - d.x

	let x
	let y

	if(dx1 === 0) {
		x = a.x

		const m2 = (c.y - d.y)/dx2
		const p2 = c.y - m2*c.x

		y = m2*x + p2
	}
	else if (dx2 === 0) {
		x = c.x

		const m1 = (b.y - a.y)/dx1
		const p1 = a.y - m1*a.x

		y = m1*x + p1
	}
	else {
		const m1 = (b.y - a.y)/dx1
		const p1 = a.y - m1*a.x
		const m2 = (c.y - d.y)/dx2
		const p2 = c.y - m2*c.x

		x = (p2 - p1)/(m1 - m2)
		y = m1*x + p1
	}

	return new Point(x, y)
}

function checkSimplePolygon(point, points) {
	// checks if the new point can be added (no intersections with existing edges)
	if (points.length >= 2) {
		for (let i = 0; i < points.length - 2; i++) {
			if (intersectSegment(points[i],	points[i + 1], points[points.length - 1], point)) {
				return false;
			}
		}
	}
	return true;
}

function jiggleCloser(p1, p2) {
	const d = 0.5
	const xSign = Math.sign(p2.x - p1.x)
	const ySign = Math.sign(p2.y - p1.y)

	return [
		new Point(p1.x + xSign*d, p1.y + ySign*d),
		new Point(p2.x - xSign*d, p2.y - ySign*d)
	]
}
