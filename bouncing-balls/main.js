// define variable for ball count paragraph

const para = document.querySelector('p');
let count = 0;

// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

// x and y coordinates — the horizontal and vertical coordinates where the ball starts on the screen. 
// This can range between 0 (top left hand corner) to the width and height of the browser viewport 
// (bottom right hand corner).
// horizontal and vertical velocity (velX and velY) — each ball is given a horizontal and vertical 
// velocity; in real terms these values are regularly added to the x/y coordinate values when we animate 
// the balls, to move them by this much on each frame.
// color — each ball gets a color.
// size — each ball gets a size — this is its radius, in pixels.

function Ball(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
}

// Using this function, we can tell the ball to draw itself onto the screen, by calling a series of 
// members of the 2D canvas context we defined earlier (ctx). The context is like the paper, and now we
// want to command our pen to draw something on it:

// First, we use beginPath() to state that we want to draw a shape on the paper.
// Next, we use fillStyle to define what color we want the shape to be — we set it to our ball's color property.
// Next, we use the arc() method to trace an arc shape on the paper. Its parameters are:
// The x and y position of the arc's center — we are specifying the ball's x and y properties.
// The radius of the arc — in this case, the ball's size property.
// The last two parameters specify the start and end number of degrees around the circle that the arc
// is drawn between. Here we specify 0 degrees, and 2 * PI, which is the equivalent of 360 degrees 
// in radians (annoyingly, you have to specify this in radians). That gives us a complete circle. 
// If you had specified only 1 * PI, you'd get a semi-circle (180 degrees).
// Last of all, we use the fill() method, which basically states "finish drawing the path we started
// with beginPath(), and fill the area it takes up with the color we specified earlier in fillStyle."

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

// The first four parts of the function check whether the ball has reached the edge of the canvas. 
// If it has, we reverse the polarity of the relevant velocity to make the ball travel in the opposite 
// direction. So for example, if the ball was traveling upwards (positive velY), then the vertical 
// velocity is changed so that it starts to travel downwards instead (negative velY).

// In the four cases, we are checking to see:

// if the x coordinate is greater than the width of the canvas (the ball is going off the right edge).
// if the x coordinate is smaller than 0 (the ball is going off the left edge).
// if the y coordinate is greater than the height of the canvas (the ball is going off the bottom edge).
// if the y coordinate is smaller than 0 (the ball is going off the top edge).

Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

Ball.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
}

// Animating the ball
let balls = [];
while (balls.length < 25) {
    let size = random(10, 20);
    let ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size
    );

    balls.push(ball);
}

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
    }

    requestAnimationFrame(loop);
}
loop();