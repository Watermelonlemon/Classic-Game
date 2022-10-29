document.addEventListener('DOMContentLoaded', ()=> {
    const cat = document.querySelector('.cat')
    const grid = document.querySelector('.grid')
    const alert = document.getElementById('alert')
    let isJumping = 0
    let gravity = 0.9
    let isGameOver = false

    function control(e) {
        if (e.keyCode === 32) {
            if (isJumping < 2) {
                isJumping += 1
                jump()
            }
        }
    }
    document.addEventListener('keyup', control)

    position = 0
    function jump() {
        let count = 0
        let timerId = setInterval(function (){
            // Move down
            if (count === 15) {
                clearInterval(timerId)
                console.log("down")
                let downTimerId = setInterval(function () {
                    if (count === 0) {
                        clearInterval(downTimerId)
                        isJumping = 0
                    }
                    position -= 4
                    position *= gravity
                    count --
                    cat.style.bottom = position + 'px'
                }, 20)
            }

            // Move up
            console.log('up')
            count ++
            position += 30
            position *= gravity
            cat.style.bottom = position +'px'
        }, 20)
    }

    function generateObstacles() {
        let randomTime = Math.random() * 5000
        let obstaclePosition = 1000
        const obstacle = document.createElement('div')
        if (!isGameOver) obstacle.classList.add('obstacle')
        grid.appendChild(obstacle)
        obstacle.style.left = obstaclePosition + 'px'

        let timerId = setInterval(function() {
            if (obstaclePosition > 0 && obstaclePosition < 60 && position < 50) {
                clearInterval(timerId)
                alert.innerHTML = 'Game Over'
                isGameOver = true
            } 

            obstaclePosition -= 10
            obstacle.style.left = obstaclePosition + 'px'
            
        }, 20)
        if (!isGameOver) setTimeout(generateObstacles, randomTime)
    }
    generateObstacles()
})