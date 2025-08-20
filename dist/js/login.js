const baseUrl = 'https://rastreo.totaltracking.co/api/';

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const tokenDuration = 21600;

    if (!username.trim() == "" || !password.trim() == "") {
        const data = {
            username: username,
            password: password,
            duration: tokenDuration
        }
        try {
            await fetch(`${baseUrl}login`, {
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(res => {
                    if (res.message.includes("successfully")) {
                        sessionStorage.setItem('token', res.auth);
                        window.location.href = 'dashboard.html';
                    } else {
                        document.getElementById('text-error').style.display = 'block';
                    }
                })
                .catch(err => console.error(err));
        } catch (error) {
            console.error('Error during login:', error);
        }
    }
})