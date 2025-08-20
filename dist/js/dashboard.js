const baseUrl = 'https://rastreo.totaltracking.co/api/';

document.addEventListener('DOMContentLoaded', async function() {
    const isAuth = isAuthenticated('token');
    if (!isAuth) {
        window.location.href = 'login.html';
    }
    const tokenSession = sessionStorage.getItem('token');
    const userInfo = await getUserInfo(tokenSession);
    const plantsInfo = await getPlants(tokenSession);
    renderMenuButtons(plantsInfo.data)

    console.log('Token de sesión:', tokenSession);
    console.log('Datos del usuario:', userInfo);
    console.log('Información de las plantas:', plantsInfo);
});

document.getElementById('search-input').addEventListener('input', function(event) {
    const query = this.value.toLowerCase().trim();
    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach(button => {
        const text = button.textContent.toLowerCase();
        if (text.includes(query)) {
            button.style.display = "block"; // mostrar
        } else {
            button.style.display = "none"; // ocultar
        }
    });

});

document.getElementById('logout-button').addEventListener('click', function() {
    logout();
});


//Función para verificar si el usuario está autenticado
function isAuthenticated(tokenName) {
    if (sessionStorage.getItem(tokenName) !== null && sessionStorage.getItem(tokenName) !== undefined) {
        return true;
    } else {
        return false;
    }
}

//Función para obtener la información del usuario
async function getUserInfo(tokenSession) {
    try {
        const response = await fetch(`${baseUrl}user`, {
            method: 'GET',
            headers: {
                Authenticate: tokenSession,
            },
        })
        return await response.json();
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        return null;
    }
}

//Función para obtener el listado de las plantas
async function getPlants(tokenSession) {
    try {
        const response = await fetch(`${baseUrl}vehicles`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                authenticate: tokenSession,
            },
        })
        return await response.json();
    } catch (error) {
        console.error('Error al obtener las plantas:', error);
        return [];
    }
}

//Función para cerrar sesión
async function logout() {
    fetch(`${baseUrl}logout`, {
            method: 'GET',
            headers: {
                Authenticate: sessionStorage.getItem('token'),
            },
        }).then(response => response.json())
        .then(data => {
            if (data.message.includes('Session terminated')) {
                sessionStorage.removeItem('token');
                window.location.href = 'login.html';
            }
        })
        .catch(error => {
            console.error('Error al cerrar sesión:', error);
        });
}

//Función para renderizar los botones del menú de items
function renderMenuButtons(plants) {
    const menuContainer = document.querySelector('.menu-items');
    plants.forEach(plants => {
        const button = document.createElement('button');
        button.className = 'menu-item';
        button.textContent = plants.name;
        button.onclick = () => {
            // Pone lógica del botón aquí
            //cargar información de la planta
            console.log(`Botón ${plants.name} clickeado`);
        };
        menuContainer.appendChild(button);
    });
}