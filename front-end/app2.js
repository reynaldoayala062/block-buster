const userURL = 'http://localhost:3000/users'

document.addEventListener('DOMContentLoaded', () => {
    
    createUser()
    
})

const createUser = () => { 
    
    const userForm = document.querySelector('#user-form')
    
    userForm.addEventListener('submit', (e) => {
        e.preventDefault()
        console.log(e)
        postUser(e.target[0].value)
        const loginBox = document.querySelector(".login-box")
        loginBox.hidden = true
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