const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
    constructor() {
        const image = new Image()
        image.src = "../image/plane_blue.png"

        this.image = image
        this.width = 50
        this.height = 50

        this.position = {
            x: (canvas.width - this.width)/2,
            y: canvas.height - this.height
        }

        this.velocity = {
            x: 0,
            y: 0
        }

    }
    
    draw() {
        ctx.beginPath()
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
    }
}

class Alien {
    constructor(x, y) {
        const image = new Image()
        image.src = "../image/alien_bright.png"

        this.width = 50
        this.height = 50
        this.image = image
        this.position = {
            x : x,
            y : y
        }
    }
    
    draw() {
        ctx.beginPath()
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        this.position.y += 1
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x,
        this.y = y
        this.radius = 4
        this.color = "rgb(255,255,0)"
    }
    
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }
    update() {
        this.draw()
        this.y -= 2
    }
}

let player = new Player()
let aliens = []
let bullets = []

function spawnAliens() {
    setInterval(() => {
        let x = Math.random() * canvas.width
        x -= x%50
        aliens.push(new Alien(x, 0))
    }, 2000)
}

window.addEventListener('keydown', function(e) {
    if(e.keyCode === 32 && e.target == document.body) {
      e.preventDefault()
    } else if (e.keyCode === 39) {
        player.position.x += 50
        player.update()
    } else if (e.keyCode === 37) {
        player.position.x -= 50
        player.update()
    }
})

window.addEventListener('click', (event) => {
    bullets.push(
        new Bullet(player.position.x + 25, player.position.y + 25)
    )
})

let animationId

function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()

    bullets.forEach((bullet, idxBullet) => {
        bullet.update()
        if (bullet.y === 0) {
            bullets.splice(idxBullet, 1)
        }
    })
    aliens.forEach((alien, idxAlien) => {
        alien.update()

        if (alien.position.y === canvas.height - 50) {
            cancelAnimationFrame(animationId)
        }

        bullets.forEach((bullet, idxBullet) => {
            if (alien.position.y - bullet.y < alien.height/2 + bullet.radius
            && alien.position.y - bullet.y > 0
            && bullet.x-alien.position.x <= 50
            && bullet.x-alien.position.x > 0) {
                setTimeout(() => {
                    aliens.splice(idxAlien, 1)
                    bullets.splice(idxBullet, 1)
                })
            }
        })

    })
}


animate()
spawnAliens()