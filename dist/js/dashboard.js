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
    //Poner grupo
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



//Función para renderizar los botones del menú de items
function renderMenuButtons(plants) {
    const menuContainer = document.querySelector('.menu-items');
    let ecoplantType = '';
    plants.forEach(plant => {
        const button = document.createElement('button');
        ecoplantType = plant.info.description == null ? 'Sin información disponible' : getTypeNumber(plant.info.description);
        button.className = 'menu-item';
        button.innerHTML = `<strong>${plant.name}</strong> <br> Modelo: ${ecoplantType}   <br> Imei: ${plant.device}`;
        button.onclick = () => {
            // Pone lógica del botón aquí
            //cargar información de la planta
            const namePlant = document.getElementById('ecoplant-name');
            namePlant.textContent = plant.name;
            putImage(plant.id);
        };
        menuContainer.appendChild(button);
    });
}

//Función para renderizar el panel de descripción
function renderDescriptionPanel(plant) {


}

//Función para poner la imagen en el panel de descripción
function putImage(idPlant) {
    const img = document.getElementById('image-plant');
    img.onerror = function() {
        this.onerror = null; // Previene bucle si la imagen de fallback tampoco existe
        this.src = '/dist/img/image-not-available.jpg';
    };
    img.src = `${baseUrl}images/vehicles/${idPlant}/photo`;
}


//Función para extraer el tipo de planta
function getTypeNumber(text) {
    const match = text.match(/\*type:Ecoplant\s*(\d+)/i);
    if (match) {
        return parseInt(match[1], 10);
    }
    return null;
}



/////Funciones para el responsive.
const hamburger = document.getElementById('hamburger');
const panelLeft = document.getElementById('panel-left');

hamburger.addEventListener('click', () => {
    panelLeft.classList.toggle('open');
    hamburger.classList.toggle('active');
    document.body.style.overflow = panelLeft.classList.contains('open') ? 'hidden' : '';
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
        panelLeft.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }
});


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