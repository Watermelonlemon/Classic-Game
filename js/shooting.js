const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d') // we are making a 2D game

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
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
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
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

const x = canvas.width/2
const y = canvas.height/2
const player = new Player(x, y, 30, "yellow")


// const projectile = new Projectile (
//     //event.clientX, event.clientY, 5, 'black', null
//     canvas.width / 2, canvas.height / 2, 5, 'red',
//     {
//         x: 1,
//         y: 1
//     }
// )

// const projectile2 = new Projectile (
//     //event.clientX, event.clientY, 5, 'black', null
//     canvas.width / 2, canvas.height / 2, 5, 'black',
//     {
//         x: -1,
//         y: -1
//     }
// )

const projectiles = []
const enemies = []

function spawnEnemies() {
    setInterval(() => {
        // const x = Math.random() * canvas.width
        // const y = Math.random() * canvas.height
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
        const color = 'green'

        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
}

function animate() {
    requestAnimationFrame(animate)
    // projectile.draw()
    // projectile.update()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.draw()
    projectiles.forEach(projectile => {
        projectile.update()
    })

    enemies.forEach((enemy, idxEnemy) => {
        enemy.update()
        projectiles.forEach((projectile, idxPro) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            if (dist - enemy.radius - projectile.radius < 1)  {
                //enemies.splice(idxEnemy, 1)
                if (enemy.radius > projectile.radius * 2) {
                    enemy.radius = enemy.radius - projectile.radius * 2
                } else {
                    enemies.splice(idxEnemy, 1)
                }
                projectiles.splice(idxPro, 1)
            }
            const distToCenter = Math.hypot(player.x - enemy.x, player.y - enemy.y) 
            if (distToCenter - player.radius - enemy.radius < 1) {
                alert("Game Over")
            }
        })
    })
}

window.addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
    
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    projectiles.push(
        new Projectile(canvas.width / 2, canvas.height / 2, 5, 'black', velocity)
    )
}) 

animate()
spawnEnemies()