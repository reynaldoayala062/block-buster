document.addEventListener('DOMContentLoaded', () =>{
    playGame();
})

const playGame = () => {
    const grid = document.querySelector('.grid')
    const gridSquares = document.querySelectorAll('.grid div')
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const stashSquares = document.querySelectorAll('.piece-stash div')
    const takenSquares = document.querySelectorAll('#taken')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const linesDisplay = document.querySelector('#lines')
    const startBtn = document.querySelector('#start-button')
    const music = document.querySelector("body > audio")
    music.loop = true
    music.volume = 0.05;
    startBtn.innerHTML = 'Start'
    const width = 10
    let gravity = 1000
    let nextRandom = 0
    let timerId 
    let storedTetrominoA
    let storedTetrominoB
    let score = 0
    let lines = 0
    let tetrominoStatus = "No Tetromino"
    

    const colorImages= [
        'url(../front-end/images/lightblue.png)',
        'url(../front-end/images/blue.png)',
        'url(../front-end/images/orange.png)',
        'url(../front-end/images/yellow.png)',
        'url(../front-end/images/green.png)',
        'url(../front-end/images/purple.png)',
        'url(../front-end/images/red.png)'
    ]

    // The Tetrominoes
    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const jTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const lTetromino = [
        [0, 1, width+1, width*2+1],
        [2, width, width+1, width+2],
        [1, width+1, width*2+1, width*2+2],
        [width, width+1, width+2,width*2]
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const sTetromino = [
        [2, width+1, width+2, width*2+1],
        [width, width+1, width*2+1, width*2+2],
        [2, width+1, width+2, width*2+1],
        [width, width+1, width*2+1, width*2+2]
    ]

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    const zTetromino =[
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]

    const theTetrominoes = [iTetromino, jTetromino, lTetromino, oTetromino, sTetromino, tTetromino, zTetromino]

    let currentPosition = 4
    let currentRotation = 0

    //randomly select a tetromino
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]

    //draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('block')
            squares[currentPosition + index].style.backgroundImage = colorImages[random]
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('block')
            squares[currentPosition + index].style.backgroundImage = 'none'
        })
    }

    //assign functions to keyCodes
    function control(e) {
        if(e.keyCode === 37){
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39){
            moveRight()
        } else if (e.keyCode === 40){
            moveDown()
        } else if (e.keyDown === 40){
            hardDrop()
        } else if (e.keyCode === 16){
            savePiece()
        }
    }
    
    // move piece down quickly 
    function hardDrop(){
        undraw()
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            draw()
            freeze()
        } else {
            currentPosition += width
            draw()
        }
    }

    function savePiece(){
        if(!storedTetrominoA) {
            storedTetrominoA = current
            displayStashedPiece()
            undraw()
            loadNewPiece()
        } else {
            let newCurrentPiece = storedTetrominoA
            storedTetrominoA = current
            displayStashedPiece()
            undraw()
            loadStashedPiece(newCurrentPiece)
        }
    }

    
    //move down function
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    // move the tetromino left, unless is at the edge or there is a blockage
    function moveLeft(){
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if(!isAtLeftEdge) currentPosition -=1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }

    //move the tetromino right, unless edge or there is a block
    function moveRight(){
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1)
        if(!isAtRightEdge) currentPosition +=1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -=1
        }
        draw()
    }

    // Fix rotation of tetromino at the edge
    function isAtRight() {
        return current.some(index => (currentPosition + index + 1) % width ===0)
    }

    function isAtLeft() {
        return current.some(index => (currentPosition + index) % width ===0)
    }

    // start a new tetromino falling 
    function loadNewPiece() {
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
    }

    const loadStashedPiece = (stashedpiece) => {
        current = stashedpiece
        currentRotation = 0
        random = findTetroIndex(stashedpiece)        
        // currentPosition = 4
        draw()
        // displayShape()
    }

    // freeze function
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            addScore()
            loadNewPiece()
            draw()
            displayShape()
            gameOver()
        }
    }

    function checkRotatedPosition(P){
        P = P || currentPosition
        if ((P+1)%width < 4) {
            if(isAtRight()){
                currentPosition += 1
                checkRotatedPosition(P)
            }
        } else if (P % width > 5){
            if(isAtLeft()){
                currentPosition -= 1
                checkRotatedPosition(P)
            }
        }
    }
    
    function findTetroIndex(inputTetro) {
        var theIndex = null;
        theTetrominoes.forEach((tetro, index) => {
            tetro.forEach(tetroRotation => {
                if(JSON.stringify(tetroRotation) === JSON.stringify(inputTetro)) {
                    theIndex = index;
                }
            })
        });
        return theIndex;
    }
    
    //rotate the tetromino
    function rotate() {
        undraw()
        currentRotation ++ 
        if(currentRotation === current.length){
            currentRotation = 0
        }
        // var currentIndex = findTetroIndex(current)
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }

    //show up next tetromino in mini grd display
    const miniWidth = 4
    const miniIndex = 0

    //the Tetrominos without rotations
    const miniTetrominos = [
        [1, miniWidth+1, miniWidth*2+1, miniWidth*3+1], //iTetromino
        [1, miniWidth+1, miniWidth*2+1, 2], //jTetromino
        [0, 1, miniWidth+1, miniWidth*2+1], //lTetromino
        [0, 1, miniWidth, miniWidth+1], //oTetromino
        [2, miniWidth+1, miniWidth+2, miniWidth*2+1], //sTetromino
        [1, miniWidth, miniWidth+1, miniWidth+2], //tTetromino
        [0, miniWidth, miniWidth+1, miniWidth*2+1] //zTetromino
    ]

    //display the shape in the mini-grid
    function displayShape(){
        displaySquares.forEach(square =>{
            square.classList.remove('block')
            square.style.backgroundImage = 'none'
        })
        miniTetrominos[nextRandom].forEach( index => {
            displaySquares[miniIndex + index].classList.add('block')
            displaySquares[miniIndex + index].style.backgroundImage = colorImages[nextRandom]
        })
    }

    //display current tetromino in stash grid
    function displayStashedPiece(){
        stashSquares.forEach(square =>{
            square.classList.remove('block')
            square.style.backgroundImage = 'none'
        })
        miniTetrominos[random].forEach(index => {
            stashSquares[miniIndex + index].classList.add('block')
            stashSquares[miniIndex + index].style.backgroundImage = colorImages[random]
        })
    }


    //add functionality to the button
    startBtn.addEventListener('click', () => {
        if (startBtn.innerHTML === 'Start'){
            startBtn.innerHTML = 'Pause'
            music.play()
            document.addEventListener('keydown', control)
            loadNewPiece()
            timerId = setInterval(moveDown, gravity)
        } else if (startBtn.innerHTML === 'Pause'){
            startBtn.innerHTML = 'Resume'
            clearInterval(timerId)
            timerId = null
            music.pause()
            document.removeEventListener('keydown', control)
        } else if (startBtn.innerHTML === 'Resume'){
            startBtn.innerHTML = 'Pause'
            timerId = setInterval(moveDown, gravity)
            music.play()
            document.addEventListener('keydown', control)
        } else if (startBtn.innerHTML === 'New Game'){
            clearGrid()
            startBtn.innerHTML = 'Start'
        }
    })

    //add score
    function addScore(){
        for (let i = 0; i < 199; i +=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                lines += 1
                linesDisplay.innerHTML = lines
                if(gravity > 100){
                    gravity -= 50
                }
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('block')
                    squares[index].style.backgroundImage = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // game over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'Game Over'
        startBtn.innerHTML = 'New Game'
        clearInterval(timerId)
        document.removeEventListener('keydown', control)
        
        renderUser(score)
        }
    }

    function clearGrid(){
        gridSquares.forEach(square =>{
            square.classList.remove('block')
            square.classList.remove('taken')
            square.style.backgroundImage = 'none'
        })
    
        takenSquares.forEach(square => {
            square.classList.add('taken')
        })
        
        displaySquares.forEach(square =>{
            square.classList.remove('block')
            square.classList.remove('taken')
            square.style.backgroundImage = 'none'
        })

        stashSquares.forEach(square =>{
            square.classList.remove('block')
            square.classList.remove('taken')
            square.style.backgroundImage = 'none'
        })
    }
}