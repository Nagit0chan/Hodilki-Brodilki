let board = document.querySelector('.board')

for(let i = 0; i < 45; i++){
    let cell = document.createElement('div')
    cell.classList.add('cell')
    board.appendChild(cell)
}

let cells = document.querySelectorAll('.cell')
let gameCells = []

for(i = 0; i < 9; i++) {
    gameCells.push(cells[i])
}
gameCells.push(cells[17])
for(i = 26; i > 17; i--) {
    gameCells.push(cells[i])
}
gameCells.push(cells[27])
for(i = 36; i < 45; i++) {
    gameCells.push(cells[i])
}

//Добавление тегов
gameCells.forEach(function(cell){
    cell.classList.add('game')
})
gameCells[0].classList.add('start')
gameCells[28].classList.add('finish')

//Добавление надписей
for(let i = 1; i < gameCells.length-1; i++){
    gameCells[i].innerHTML = i
}
gameCells[0].innerHTML = 'СТАРТ'
gameCells[28].innerHTML = 'ФИНИШ'


let score = document.querySelector('.score')
let diceButton = document.querySelector('.dice-button')
diceButton.condition = true //Можно ли нажимать кнопку прямо сейчас?
diceButton.mouseOn = false //Находится ли мышка над кнопкой?

diceButton.addEventListener('mouseover', function(){
    diceButton.mouseOn = true
    if (diceButton.condition) {
        diceButton.style.border = '2px solid white'
    }
})

diceButton.addEventListener('mouseout', function(){
    diceButton.mouseOn = false
    diceButton.style.border = '2px solid pink'
})

diceButton.addEventListener('click', function(){
    if (diceButton.condition) {
        diceButton.condition = false
        diceButton.innerHTML = 'Подождите...'
        diceButton.style.opacity = .5
        diceButton.style.border = '2px solid pink'

        anime({ 
            targets: score,
            opacity: 0,
            easing: 'linear',
            duration: 100,
        })
        .finished.then(function(){
            score.innerHTML = Math.floor(Math.random()*6)+1
            anime({
                targets: score,
                opacity: 1,
                easing: 'linear',
                duration: 300,
                delay: 800,
            })
            .finished.then(function(){
                diceButton.condition = true
                diceButton.innerHTML = 'Бросить кубик'
                diceButton.style.opacity = 1
                if (diceButton.mouseOn) {
                    diceButton.style.border = '2px solid white'
                }
            })
        })
    }
})
