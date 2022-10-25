const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus")
const alert = document.querySelector(".alert")
const countJump = document.querySelector(".countJump")
let count = 0
let gameOver = false
let pressedOnce = false

//countJump.innerHTML = count

function jump() {
    if (dino.classList != "jump") {
        dino.classList.add("jump");

        setTimeout(function () {
            dino.classList.remove("jump");
        }, 300);
    }
}

let isAlive = setInterval(function() {
    let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));
    let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

    if (cactusLeft <60 && cactusLeft > 30 && dinoTop >= 140) {
        alert.innerHTML = "Game Over!" 
        gameOver = true
    }
}, 10);

if (pressedOnce) {
    alert.innerHTML = count
}

let jumpCount = setInterval(function () {
    if (!gameOver) {
        count ++
    }
    countJump.innerHTML = count
}, 1500)

document.addEventListener("keydown", function (event) {
    jump();
    pressedOnce = true
});