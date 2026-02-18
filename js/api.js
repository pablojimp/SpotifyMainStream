import { getToken } from './auth.js';

export async function getTopArtist() {
    const tokenRecibido = await getToken();

    const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=short_term', {
        headers: {
            'Authorization': `Bearer ${tokenRecibido}`
        }
    });

    const data = await response.json();

    return data
}

export async function getTopTracks() {
    const tokenRecibido = await getToken();

    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term', {
        headers: {
            'Authorization': `Bearer ${tokenRecibido}`
        }
    });

    const data = await response.json();

    return data
}

export async function getTop50Artist() {
    const tokenRecibido = await getToken();

    const response = await fetch('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks', {
        headers: {
            'Authorization': `Bearer ${tokenRecibido}`
        }
    });

    const data = await response.json();

    return data
}


