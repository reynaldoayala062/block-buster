const userURL = 'http://localhost:3000/users'
const hsURL = 'http://localhost:3000/high_scores'

document.addEventListener('DOMContentLoaded', () => {
    
    createUser()
    renderHS()
    
})

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

const renderUser = (score) => {
    fetch(userURL)
    .then(resp => resp.json())
    .then(json => {
        postHighScore(score, json.slice(-1)[0].id)
        
    })
}

// high score 
const postHighScore = (score, id) => {
        
    fetch(hsURL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            score: score,
            user_id: id
        })
    })

    renderHS()
}

const renderHS = () => {

    fetch(hsURL)
    .then(resp => resp.json())
    .then(json => displayHSArray(json.sort((a,b) => b.score-a.score).slice(0,3)))
}

const displayHSArray = (top3) => {
    top3.forEach( top => {
        displayHS(top)
    })
}

const displayHS = (top) => {
    console.log(top)
    const ul = document.getElementById('hs-ul')
    const li = document.createElement('li')
    li.innerHTML = `${top.user.name} - ${top.score} <br><br>`
    ul.append(li)
}