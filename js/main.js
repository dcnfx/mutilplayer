const SVG_NS = "http://www.w3.org/2000/svg";
const XLink_NS = "http://www.w3.org/1999/xlink";
const svg = document.querySelector("svg");
const point = document.querySelector("#point");
const text = document.querySelector("text");
const rad = Math.PI / 180;

let requestId = null;
let t = { x: 25, y: 25 }; // translation
let mouseAngle = 0; // initial position of the bubble
let deltaAngle = mouseAngle; // angle between point and mouse pos

let spring = 3 * rad - deltaAngle / 120;
const friction = 0.80;

class Point {
    constructor(angle, elmt) {
        this.a = 0;
        this.elmt = elmt;
        this.angle = angle;
        this.x = 10 * Math.cos(this.angle);
        this.y = 10 * Math.sin(this.angle);
        this.vel = 0;
    }
    draw() {
        // elmt == the bubble
        this.elmt.setAttributeNS(null, "cx", this.x);
        this.elmt.setAttributeNS(null, "cy", this.y);

        text.setAttributeNS(null, "x", this.x);
        text.setAttributeNS(null, "y", this.y);
        text.textContent = ~~getAngleInPercents(mouseAngle);
    }

    updateAngle(target) {
        this.dist = target - this.a;
        this.acc = this.dist * spring;
        this.vel += this.acc;
        this.vel *= friction;
        this.a += this.vel;
    }

    getAngle() {
        this.angle = Math.atan2(this.y, this.x);
    }

    rotate() {
        let cos = Math.cos(this.vel);
        let sin = Math.sin(this.vel);
        let p = { x: this.x, y: this.y };
        this.x = p.x * cos - p.y * sin;
        this.y = p.x * sin + p.y * cos;
    }
}

let p = new Point(0, A); // the bubble

function Draw() {
    requestId = window.requestAnimationFrame(Draw);
    p.updateAngle(deltaAngle);
    p.rotate();
    p.draw();
}
Draw();

svg.addEventListener("click", function(e) {
        mouseAngle = getMouseAngle(e, t);
        number.value = getAngleInPercents(mouseAngle);
        onEvent();
    }, false
);

number.addEventListener("input", function(e) {
        mouseAngle = map(number.value, 0, myParameters.row*myParameters.col-1, 0, myParameters.degree) * rad;
        changeView(number.value);
        console.log(number.value);
        onEvent();
    }, false
);

function onEvent() {
    if (requestId) {
        cancelAnimationFrame(requestId);
        requestId = null;
    }
    p.getAngle(); // changes the p.angle

    if (p.angle < mouseAngle - Math.PI) {
        p.angle = p.angle + 2 * Math.PI;
    }
    if (p.angle > mouseAngle + Math.PI) {
        p.angle = p.angle - 2 * Math.PI;
    }

    deltaAngle = mouseAngle - p.angle;

    spring = 3 * rad - Math.abs(deltaAngle / 120);
    p.a = 0;
    p.dist = 0;
    p.vel = 0;
    p.acc = 0;

    Draw();
}

function oMousePosSVG(e) {
    let p = svg.createSVGPoint();
    p.x = e.clientX;
    p.y = e.clientY;
    let ctm = svg.getScreenCTM().inverse();
    p = p.matrixTransform(ctm);
    return p;
}

function transformedMousePos(e, t) {
    let m = oMousePosSVG(e);
    return {
        x: m.x - t.x,
        y: m.y - t.y
    };
}

function getMouseAngle(e, t) {
    let m = transformedMousePos(e, t);
    //console.log("mouse: ",Math.atan2(m.y,m.x)/rad)
    return Math.atan2(m.y, m.x);
}

function getAngleInPercents(angle) {
    let A = angle < 0 ? (angle + 2 * Math.PI) / rad : angle / rad;
    return map(A, 0, 360, 0, 35);
}

function map(n, a, b, _a, _b) {
    var d = b - a;
    var _d = _b - _a;
    var u = _d / d;
    return _a + n * u;
}