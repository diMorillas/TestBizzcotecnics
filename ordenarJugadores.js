
export function ordenarJugadoresPorNombre(jugadores) {
    return jugadores.sort((a, b) => a.nombre.localeCompare(b.nombre));
}
