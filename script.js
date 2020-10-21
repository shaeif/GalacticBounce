const canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')

canvas.width = innerWidth > 425 ? 425 : innerWidth
canvas.height = innerHeight > 908 ? 908 : innerHeight

let mouse = {
    x: innerWidth,
    y: innerHeight
}

let score = 0;


const gravity = 1;
const friction = 0.8;


let status = false;
//Event Listener
addEventListener('resize', () => {
    canvas.width = innerWidth > 500 ? 500 : innerWidth
    canvas.height = innerHeight > 800 ? 800 : innerHeight
    init();
})
addEventListener('keypress', (e) => {
    if (status == false) {
        init()
    } else ball.throw()
})
addEventListener('touchstart', (e) => {
    if (status == false) {
        init()
    } else ball.throw()
})
//Backgroud
const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']
let mouseDown = false
class Particle {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.shadowColor = this.color
        ctx.shadowBlur = 15
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
    }

    update() {
        this.draw()
    }
}


//Line Object 
class Object {
    constructor(dx, y) {
        this.y = y
        this.x1 = dx - 60
        this.x2 = dx + 60
    }
    draw() {
        ctx.beginPath();
        ctx.moveTo(0, this.y)
        ctx.lineTo(this.x1, this.y)
        ctx.lineCap = "round";
        ctx.lineWidth = 10

        ctx.moveTo(this.x2, this.y)
        ctx.lineTo(canvas.width, this.y)

        ctx.strokeStyle = 'white'
        ctx.stroke()
        ctx.closePath()
    }
}

//Ball Object
class Ball {
    constructor(x, y, dx, dy, radius, color) {
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.radius = radius
        this.color = color
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
    }

    update() {
        if (this.y + this.radius + this.dy > canvas.height) this.dy = 0;
        else this.dy += gravity;
        if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius + this.dx < 0) this.dx = -this.dx
        this.x += this.dx
        this.y += this.dy
        this.draw()

    }
    throw () {
        this.dy = -15
    }
}

randomMath = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

randomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}


let object;
let ball;
let radius;
let y;
// Initialization
let particles

function init() {
    particles = []

    for (let i = 0; i < 1500; i++) {
        const canvasWidth = canvas.width + 1000
        const canvasHeight = canvas.height + 2000

        const x = Math.random() * canvasWidth - canvasWidth / 2
        const y = Math.random() * canvasHeight - canvasHeight / 2
        const radius = 2 * Math.random()

        const color = colors[Math.floor(Math.random() * colors.length)]
        particles.push(new Particle(x, y, radius, color))
    }

    i = 0, j = 0, score = 0
    status = true
    radius = 30;
    y = canvas.height / 2;
    dy = randomMath(-2, 2);
    ball = new Ball(canvas.width / 2, y, 2, dy, radius, "#0B42FF");
    animate()
}
let i = 0
let x, j = 0;

const getStatus = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y2 - y1, 2))
}
const scoreBoard = (x) => {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Score : ${x}`, canvas.width / 2, 35)
}
let radians = 0
let alpha = 1
const animate = () => {
    if (status) {
        requestAnimationFrame(animate)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        //////background-----------------------------------------
        ctx.fillStyle = `rgba(10, 10, 10, ${alpha})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.save()
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(radians)
        particles.forEach((particle) => {
            particle.update()
        })
        ctx.restore()

        radians += 0.003

        if (mouseDown && alpha >= 0.03) {
            alpha -= 0.
        } else if (!mouseDown && alpha < 1) {
            alpha += 0.01
        }
        //////background-----------------------------------------
        scoreBoard(score)
        if (i > canvas.height) {
            i = 0
            j = 0
        } else i = i
        x = i === 0 ? randomMath(60, (canvas.width) - 60) : x
        object = new Object(x, i++)
        object.draw();
        ball.update();
        for (let n = 0; n <= object.x1; n++) {
            if (getStatus(ball.x, ball.y, n, object.y) <= ball.radius ||
                getStatus(ball.x, ball.y, n, object.y) <= ball.radius) {
                status = false
            }
        }
        for (let n = object.x2; n <= canvas.width; n++) {
            if (getStatus(ball.x, ball.y, n, object.y) <= ball.radius ||
                getStatus(ball.x, ball.y, n, object.y) <= ball.radius) {
                status = false
            }
        }
        if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) status = false
        if (ball.y - object.y < 0 && j == 0) {
            j++
            score++
            console.log(score)
        }

    } else {
        start()
    }

}

const start = () => {
    if (status == false) {
        ctx.font = "20px Arial";
        ctx.fillStyle = "#0B42FF";
        ctx.textAlign = "center";
        ctx.fillText("CLICK TO START", canvas.width / 2, canvas.height / 2)
    }
}
start()