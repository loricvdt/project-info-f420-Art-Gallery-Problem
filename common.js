class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

const centre = new Point(300, 175)
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

function reset(p) {
	p.points = []
	p.polygon = []
}

function resetGuards(p) {
	p.guards = []
}

function commonSetup(p, parent) {
	reset(p)
	let canvas = p.createCanvas(600, 350)
	canvas.parent(parent)
	p.strokeWeight(1)
}

function commonDraw(p) {
	p.background(200)

	p.noStroke()
	p.fill("orange")

	const rayLines = []
	for (const guard of p.guards) {
		rayLines.push(...drawGuardView(p, guard))
	}

	p.strokeWeight(0.5)
	p.stroke("white")

	for (const line of rayLines) {
		p.line(line[0].x, line[0].y, line[1].x, line[1].y)
	}

	p.strokeWeight(1)
	p.stroke("black")
	p.fill("black")

	let last;
	for (const i in p.points) {
		if (i >= 1) p.line(last.x, last.y, p.points[i].x, p.points[i].y)
		last = p.points[i]
		p.ellipse(p.points[i].x, p.points[i].y, 4, 4)
	}

	if (p.polygon.length > 0) {
		last = p.polygon[p.polygon.length - 1];
		for (const point of p.polygon) {
			p.line(last.x, last.y, point.x, point.y);
			last = point;
			p.ellipse(point.x, point.y, 4, 4);
		}
	}

	p.stroke("red")
	p.fill("red")

	for (const guard of p.guards) {
		p.ellipse(guard.x, guard.y, 4, 4)
	}
}

function drawGuardView(p, guard) {
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

	const rayLines = []
	p.beginShape()
	for(const i in guardView) {
		p.vertex(p.polygon[guardView[i]].x, p.polygon[guardView[i]].y)
		if((guardView[i]+1) % p.polygon.length !== guardView[(Number(i)+1) % guardView.length]) {
			const intersectSegment = findIntersect(p, guard, guardView[i], guardView[(Number(i)+1) % guardView.length])
			if(intersectSegment) {
				rayLines.push([intersectSegment[0], guard])
				p.vertex(intersectSegment[0].x, intersectSegment[0].y)
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


function findIntersect(p, guard, first, last) {
	for(let i = first; (first > last && i < p.polygon.length) || i < last; i = (i+1) % p.polygon.length) {
		if(i !== first && intersectRay(guard, p.polygon[first], p.polygon[i], p.polygon[(i+1) % p.polygon.length])) {
			return [calculateIntersect(guard, p.polygon[first], p.polygon[i], p.polygon[(i+1) % p.polygon.length]), p.polygon[first]]
		}
		if((i+1) % p.polygon.length !== last && intersectRay(guard, p.polygon[last], p.polygon[i], p.polygon[(i+1) % p.polygon.length])) {
			return [calculateIntersect(guard, p.polygon[last], p.polygon[i], p.polygon[(i+1) % p.polygon.length]), p.polygon[last]]
		}
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
