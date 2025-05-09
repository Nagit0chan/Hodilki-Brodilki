let board = document.querySelector('.board')

//Создание grid-сетки
for(let i = 0; i < 45; i++){
    let cell = document.createElement('div')
    cell.classList.add('cell')
    board.appendChild(cell)
}

//Создание массива с игровыми полями
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

//Создание фигурки
let figure = document.createElement('div')
figure.classList.add('figure')
gameCells[0].appendChild(figure)
figure.currentCell = 0 //На каком поле находится фигурка?
figure.currentRotation = 0 //Угол поворота фигурки

let score = document.querySelector('.score')
let diceButton = document.querySelector('.dice-button')
diceButton.condition = true //Можно ли нажимать кнопку прямо сейчас?
diceButton.mouseOn = false //Находится ли мышка над кнопкой?

diceButton.addEventListener('mouseover', function(){
    diceButton.mouseOn = true
    if (diceButton.condition) {
        diceButton.style.border = '.15vw solid white'
    }
})

diceButton.addEventListener('mouseout', function(){
    diceButton.mouseOn = false
    diceButton.style.border = '.15vw solid pink'
})

function jumpLoop(jumps) {
    let promise = new Promise(function(resolve){ //Анимация движения фигурки на разных клетках
        //Анимация поворота (опционально)
        let rotateTime = 0
        if ([8, 10].includes(figure.currentCell)) {
            figure.currentRotation += 90
            anime({
                targets: figure,
                rotate: figure.currentRotation + 'deg',
                easing: 'linear',
                duration: 300,
            })
            rotateTime += 300
        } else if ([18, 20].includes(figure.currentCell)) {
            figure.currentRotation -= 90
            anime({
                targets: figure,
                rotate: figure.currentRotation + 'deg',
                easing: 'linear',
                duration: 300,
            })
            rotateTime += 300
        }
        setTimeout(function(){
            //Анимация прыжка на следующую клетку
            if (figure.currentCell < 8 || (19 < figure.currentCell && figure.currentCell < 28)) {
                anime({
                    targets: figure,
                    scale: [
                        {value: 1, duration: 0},
                        {value: 1.5, duration: 250},
                        {value: 1, duration: 250}
                    ],
                    translateX: gameCells[figure.currentCell].offsetWidth,
                    easing: 'linear',
                    duration: 500,
                    delay: 100,
                })
                .finished.then(function(){resolve()})
            } else if (9 < figure.currentCell && figure.currentCell < 18) {
                anime({
                    targets: figure,
                    scale: [
                        {value: 1, duration: 0},
                        {value: 1.5, duration: 250},
                        {value: 1, duration: 250}
                    ],
                    translateX: -gameCells[figure.currentCell].offsetWidth,
                    easing: 'linear',
                    duration: 500,
                    delay: 100,
                })
                .finished.then(function(){resolve()})
            } else if ([8, 9, 18, 19].includes(figure.currentCell)) {
                anime({
                    targets: figure,
                    scale: [
                        {value: 1, duration: 0},
                        {value: 1.5, duration: 250},
                        {value: 1, duration: 250}
                    ],
                    translateY: gameCells[figure.currentCell].offsetHeight,
                    easing: 'linear',
                    duration: 500,
                    delay: 100,
                })
                .finished.then(function(){resolve()})
            }
        }, rotateTime)
    })
    promise.then(function(){ //Перемещение фигурки в следующую клетку
        figure.currentCell++
        figure.remove() 
        figure.style.transform = `translateX(0) translateY(0) rotate(${figure.currentRotation + 'deg'})` //Очищение свойств
        gameCells[figure.currentCell].appendChild(figure)
        jumps--
        if (jumps != 0) { //Создание цикла
            jumpLoop(jumps) 
        } else { //Завершение цикла. Восстановление активности кнопки
            diceButton.condition = true
            diceButton.innerHTML = 'Бросить кубик'
            diceButton.style.opacity = 1
            if (diceButton.mouseOn) {
                diceButton.style.border = '.15vw solid white'
            }
        }

    })
}

diceButton.addEventListener('click', function(){
    if (diceButton.condition) {
        //Перевод кнопки в неактивное состояние
        diceButton.condition = false
        diceButton.innerHTML = 'Подождите...'
        diceButton.style.opacity = .5
        diceButton.style.border = '.15vw solid pink'

        anime({ //Анимация надписи числа ходов
            targets: score,
            opacity: 0,
            easing: 'linear',
            duration: 100,
        })
        .finished.then(function(){
            let jumps = Math.floor(Math.random()*6)+1
            score.innerHTML = jumps
            anime({
                targets: score,
                opacity: 1,
                easing: 'linear',
                duration: 300,
                delay: 800,
            })
            .finished.then(function(){
                jumpLoop(jumps)
            })
        })
    }
})
