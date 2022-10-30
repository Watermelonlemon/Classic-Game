const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d") // we are making a 2D game
const scoreBoard = document.getElementById("scoreBoard")
const finalScore = document.getElementById("finalScore")
const reStartGameBtn = document.getElementById("reStartGameBtn")
const StartGameBtn = document.getElementById("StartGameBtn")
const scoreWindow = document.getElementById("scoreWindow")
const startWindow = document.getElementById("startWindow")

canvas.width = innerWidth // we get innerwidth from window
canvas.height = innerHeight

class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    } 
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x * 4
        this.y = this.y + this.velocity.y * 4
    }
}
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    } 
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x * (Math.random() + speed - 1)
        this.y = this.y + this.velocity.y * (Math.random() + speed - 1)
    }
}

class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    } 
    draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}

const x = canvas.width/2
const y = canvas.height/2

let frames = 0
let player = new Player(x, y, 15, "rgb(300, 300, 350)")
let projectiles = []
let enemies = []
let enemyColors = ["rgb(162, 81, 45)", "rgb(180, 182, 188)", "rgb(192, 206, 255)", "rgb(205, 229, 155)", "rgb(230, 159, 154)"]
let particles = []
let speed = 1
let increaseSpeed = setInterval (function() {
    speed += 0.2
}, 3000)

function init() {
    player = new Player(x, y, 15, "rgb(300, 300, 350)")
    projectiles = []
    enemies = []
    particles = []
    frames = 0
    speed = 1
    score = 0
    scoreBoard.innerHTML = score
}

function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (30 - 10) + 10
        let x
        let y
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }

        const angle = Math.atan2(player.y - y, player.x - x)
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        
        randomColor = Math.floor(Math.random() * enemyColors.length)
        enemies.push(new Enemy(x, y, radius, enemyColors[randomColor], velocity))
    }, 1500)
}

document.onkeydown = checkKey

function checkKey(e) {
    e = e || window.event

    if (e.keyCode === 65) {
        player.x -= 10
    } else if (e.keyCode === 68) {
        player.x += 10
    } else if (e.keyCode === 83) {
        player.y += 10
    } else if (e.keyCode === 87) {
        player.y -= 10
    }
    player.update
}

let animationId
let score = 0

function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    frames ++
    particles.forEach((particle, idxParticle) => {
        particle.update()
        if (particle.alpha <= 0){
            particles.splice(idxParticle, 1)
        }
    })

    projectiles.forEach((projectile, index) => {
        projectile.update()
         if (projectile.x + projectile.radius  < 0 
            || projectile.x - projectile.radius > canvas.width
            || projectile.y + projectile.radius < 0
            || projectile.y - projectile.raidus > canvas.height) {
            projectiles.splice(index, 1)
         }
    })
    enemies.forEach((enemy, idxEnemy) => {
        enemy.update()

        // This part should be placed before projectiles loop
        const distToCenter = Math.hypot(player.x - enemy.x, player.y - enemy.y) 
        if (distToCenter - player.radius - enemy.radius < 1) {
            cancelAnimationFrame(animationId)
            finalScore.innerHTML = score
            scoreWindow.style.display = 'flex'
        }

        projectiles.forEach((projectile, idxPro) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            if (dist - enemy.radius - projectile.radius < 1)  {
                
                score += 100
                scoreBoard.innerHTML = score

                for (let i = 0; i < 10; i++) {
                    particles.push(new Particle(projectile.x+projectile.radius, projectile.y+projectile.radius, Math.random() * 3, enemy.color, {x: Math.random() - 0.5, y: Math.random() - 0.5}))
                }
                setTimeout(() => {
                    if (enemy.radius > projectile.radius * 4) {
                        enemy.radius = enemy.radius - projectile.radius * 2.5
                        score += 50
                        scoreBoard.innerHTML = score
                    } else {
                        enemies.splice(idxEnemy, 1)
                        score += 100
                        scoreBoard.innerHTML = score
                    }
                    projectiles.splice(idxPro, 1)
                }, 0)
            }
        })
    })
}

window.addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x)
    
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    projectiles.push(
        new Projectile(player.x, player.y, 5, "rgb(255, 255, 255)", velocity)
    )
}) 

spawnEnemies()

reStartGameBtn.addEventListener('click', (event) => {
    init()
    animate()
    scoreWindow.style.display = 'none'
})

StartGameBtn.addEventListener('click', (event) => {
    init()
    animate()
    startWindow.style.display = 'none'
})
