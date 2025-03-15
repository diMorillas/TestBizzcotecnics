export function actualizarListaJugadores() {
    playerList.innerHTML = '';

    let jugadores = getJugadores();

    jugadores.sort((a, b) => a.nombre.localeCompare(b.nombre));

    jugadores.forEach(jugador => {
        let li = document.createElement('li');
        li.textContent = `${jugador.nombre}   |    ${jugador.time} segundos`;
        playerList.appendChild(li);
    });
}

export function getJugadores() {
    return JSON.parse(localStorage.getItem("jugadores")) || [];
}

export function guardarJugadores(jugadores) {
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
}