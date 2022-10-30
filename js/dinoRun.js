const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const ctxTwo = canvas.getContext("2d")
const reStartGameBtn = document.getElementById("reStartGameBtn")
const StartGameBtn = document.getElementById("StartGameBtn")
const scoreWindow = document.getElementById("scoreWindow")
let isJumping = false
let isGameOver = false
let score = 0

canvas.width = innerWidth * (2/3)
canvas.height = innerHeight * (1/3)
class Dino {
    constructor() {
        this.position = {
            x: 10,
            y: canvas.height - 60
        }
    

        const image = new Image()
        image.src = "../image/trex_icon.png"
        
        this.image = image
        this.width = 50
        this.height = 60
    
    }
    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

}

class Cactus {
    constructor(x, y) {
        this.position = {
            x: x,
            y: y
        }
        const image = new Image()
        image.src = "../image/cactus.png"

        this.image = image
        this.width = 20
        this.height = 60
    }
    draw() {
        ctx.beginPath()
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        this.position.x -= 10
    }

}

let dino = new Dino()
let cactuses = []

function spawnCactus() {
    setInterval(() => {
        randomLength = Math.random()
        let x = canvas.width - 50 + randomLength * 700
        let y = canvas.height - 60
        cactuses.push(new Cactus(x, y))
    }, 1500)
}

function jump() {
    let timerId = setInterval(function (){
        if (dino.position.y === canvas.height - 150) {
            clearInterval(timerId)
            let downTimerId = setInterval(function() {
                dino.position.y += 10
                if (dino.position.y === canvas.height - 60) {
                    clearInterval(downTimerId)
                    isJumping = false
                }
            })
        }
        dino.position.y -= 10
    }, 20) 
}

let animationId

function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctxTwo.fillStyle = "black"
    ctxTwo.lineWidth = 5
    ctxTwo.font = "20px Arial"
    ctxTwo.fillText(`Score: ${score}`, canvas.width/2-30, 50)
    ctxTwo.strokeRect(0, 0, canvas.width, canvas.height)
    dino.draw()
    console.log(cactuses)
    cactuses.forEach((cactus, cacIdx) => {
        cactus.update()
        if (cactus.position.x < dino.position.x) {
            score += 1
            cactuses.splice(cacIdx, 1)
        }
        if (cactus.position.x < dino.position.x + 20 && dino.position.y > canvas.height - 80) {
            cancelAnimationFrame(animationId)
            isGameOver = true
        }
    })
}

function control(e) {
    if (e.keyCode === 32) {
        if (!isJumping) {
            jump()
            isJumping = true
        }
    }
}
document.addEventListener('keydown', control)

animate()
spawnCactus()
