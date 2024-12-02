let candidatosDiv = document.getElementById('candidatos');
let resultadosDiv = document.getElementById('resultados');
let contenidoPrincipal = document.getElementById('contenido-principal');
let formularioSesion = document.getElementById('formulario-sesion');
let iniciarEleccionesBtn = document.getElementById('iniciarElecciones');
let cerrarEleccionesBtn = document.getElementById('cerrarElecciones');


let datosAcceso = {
    "username": "admin",
    "password": "adso2874057"
};


let sesionIniciada = false;


let eleccionesIniciadas = false;


let votos = {};

async function obtenerCandidatos() {
    let response = await fetch('https://raw.githubusercontent.com/cesarmcuellar/Elecciones/refs/heads/main/candidatos.json');
    let candidatos = await response.json();
    mostrarCandidatos(candidatos);
    return candidatos;
}
//candidatos postulados °
function mostrarCandidatos(candidatos) {
    candidatosDiv.innerHTML = '';
    candidatos.forEach(candidato => {
        let div = document.createElement('div');
        div.className = 'candidato';
        div.innerHTML = `
            <h3>${candidato.nombre}</h3>
            <img src="${candidato.foto}" alt="${candidato.nombre}" onclick="votar('${candidato.nombre}')">
            <p id="votos-${candidato.nombre}">Votos: 0</p>
        `;
        candidatosDiv.appendChild(div);
    });
}
//inio de las elecciones 
async function iniciarElecciones() {
    if (sesionIniciada) {
        if (!eleccionesIniciadas) {
            let candidatos = await obtenerCandidatos();
            eleccionesIniciadas = true;
            iniciarEleccionesBtn.disabled = true;
            cerrarEleccionesBtn.disabled = false;
            alert("Elecciones iniciadas con éxito");
        } else {
            alert("Las elecciones ya han iniciado");
        }
    } else {
        alert("Debes iniciar sesión para iniciar las elecciones");
    }
}
//cierre de las elecciones 
async function cerrarElecciones() {
    if (sesionIniciada) {
        if (eleccionesIniciadas) {
            let ganador = obtenerGanador();
            mostrarResultados(ganador);
            eleccionesIniciadas = false;
            iniciarEleccionesBtn.disabled = false;
            cerrarEleccionesBtn.disabled = true;
            alert("Elecciones cerradas con éxito");
        } else {
            alert("Las elecciones no han iniciado");
        }
    } else {
        alert("Debes iniciar sesión para cerrar las elecciones");
    }
}

function votar(nombreCandidato) {
    if (eleccionesIniciadas) {
        // Preguntar al usuario si está seguro de que quiere votar por el candidato
        if (confirm(`¿Está seguro de que desea votar por ${nombreCandidato}?`)) {
            if (votos[nombreCandidato]) {
                votos[nombreCandidato]++;
            } else {
                votos[nombreCandidato] = 1;
            }
            document.getElementById(`votos-${nombreCandidato}`).innerHTML = `Votos: ${votos[nombreCandidato]}`;
            alert(`Voto registrado por ${nombreCandidato}`);
        } else {
            alert("Voto cancelado");
        }
    } else {
        alert("Las elecciones no han iniciado");
    }
}

function obtenerGanador() {
    let maxVotos = 0;
    let ganador = "";
    for (let candidato in votos) {
        if (votos[candidato] > maxVotos) {
            maxVotos = votos[candidato];
            ganador = candidato;
        }
    }
    return ganador;
}
//resultados
function mostrarResultados(ganador) {
    resultadosDiv.innerHTML = `
        <h2>Resultados de las Elecciones</h2>
        <p><strong>Ganador:</strong> ${ganador} con ${votos[ganador]} votos</p>
    `;
    resultadosDiv.style.display = 'block';
}

// inicio de sesión
document.getElementById('iniciar-sesion-btn').addEventListener('click', () => {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    if (username === datosAcceso.username && password === datosAcceso.password) {
        sesionIniciada = true;
        formularioSesion.style.display = 'none';
        contenidoPrincipal.style.display = 'block';
        alert("Sesión iniciada con éxito");
    } else {
        alert("Credenciales incorrectas");
    }
});


iniciarEleccionesBtn.addEventListener('click', iniciarElecciones);
cerrarEleccionesBtn.addEventListener('click', cerrarElecciones);


iniciarEleccionesBtn.disabled = false;
cerrarEleccionesBtn.disabled = true;

