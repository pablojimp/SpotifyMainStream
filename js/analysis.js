export function calcularMainstream(artistas, canciones) {
    let mediaPopulairdadArtista = 0;
    let mediaPopularidadCanciones = 0;
    let contador = 0;
    let nivel = '';
    let indiceFinal;
    artistas.items.forEach(artista => {
        mediaPopulairdadArtista += artista.popularity;
        contador++
    });


    mediaPopulairdadArtista = mediaPopulairdadArtista / contador;


    contador = 0
    canciones.items.forEach(cancion => {
        mediaPopularidadCanciones += cancion.popularity;
        contador++
    });


    mediaPopularidadCanciones = mediaPopularidadCanciones / contador;


    indiceFinal = (mediaPopulairdadArtista * 0.6) + (mediaPopularidadCanciones * 0.4);



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