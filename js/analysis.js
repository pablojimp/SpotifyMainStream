import { getArtistsDetails } from './api.js';

export async function calcularMainstream(artistas, canciones) {
    let mediaPopularidadArtista = 0;
    let mediaPopularidadCanciones = 0;
    let contador = 0;
    let nivel = '';
    let indiceFinal;

    // Pedimos los detalles completos con popularity
    const ids = artistas.items.map(artista => artista.id);
    const detalles = await getArtistsDetails(ids);

    // Ahora usamos detalles.artists en vez de artistas.items
    detalles.artists.forEach(artista => {
        mediaPopularidadArtista += artista.popularity;
        contador++
    });

    mediaPopularidadArtista = mediaPopularidadArtista / contador;

    contador = 0;
    canciones.items.forEach(cancion => {
        mediaPopularidadCanciones += cancion.popularity;
        contador++
    });

    mediaPopularidadCanciones = mediaPopularidadCanciones / contador;

    indiceFinal = (mediaPopularidadArtista * 0.6) + (mediaPopularidadCanciones * 0.4);

    if (indiceFinal <= 20) {
        nivel = 'Underground';
    } else if (indiceFinal <= 40) {
        nivel = 'Indie';
    } else if (indiceFinal <= 60) {
        nivel = 'Mixto';
    } else if (indiceFinal <= 80) {
        nivel = 'Mainstream';
    } else {
        nivel = 'Hiperpopular';
    }

    return {
        indice: indiceFinal,
        nivel: nivel
    }
}