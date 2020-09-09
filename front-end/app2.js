const userURL = 'http://localhost:3000/users'

document.addEventListener('DOMContentLoaded', () => {
    
    createUser()
    
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

const renderUser = () => {
    fetch(userURL)
    .then(resp => resp.json())
    .then(json => console.log(json))
}