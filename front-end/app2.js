const userURL = 'http://localhost:3000/users'
const hsURL = 'http://localhost:3000/high_scores'

document.addEventListener('DOMContentLoaded', () => {
    
    createUser()
    renderHS()

})

// getting info to create user
const createUser = () => { 
    
    const userForm = document.querySelector('#user-form')
    
    userForm.addEventListener('submit', (e) => {
        e.preventDefault()
        postUser(e.target[0].value)
        const loginBox = document.querySelector(".login-box")
        loginBox.hidden = true
        const gameScreen = document.querySelector('.game-screen')
        gameScreen.hidden = false    
    })
}

// creating user
const postUser = (username) => {
    fetch(userURL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'              
        }, 
        body: JSON.stringify({
            name: username
        })
    })
}

// fetching current player to create highscore
const renderUser = (score) => {
    fetch(userURL)
    .then(resp => resp.json())
    .then(json => {
        postHighScore(score, json.slice(-1)[0])
        
    })
}

// create high score with current player
const postHighScore = (score, user) => { 

    fetch(hsURL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            score: score,
            user_id: user.id
        }) 
    })
    renderHS(score, user)
}

// fetching top 3 scores in an array
const renderHS = (score, user) => {
    const ul = document.getElementById('hs-ul')
    ul.innerHTML = ""
    fetch(hsURL)
    .then(resp => resp.json())
    .then(json => {
        json.push({score: score, user: user})
        json.sort((a,b) => b.score-a.score).slice(0,3)
        displayHSArray(json.sort((a,b) => b.score-a.score).slice(0,3))
    })
}

// rendering each score from the array
const displayHSArray = (top3) => {
    top3.forEach( top => {
        displayHS(top)
    })
}

// displaying each score in a li
const displayHS = (top) => {
    const ul = document.getElementById('hs-ul')
    const li = document.createElement('li')
    li.innerHTML = `${top.user.name} - ${top.score} <br>`
    ul.append(li)
} 

