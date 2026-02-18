export function generarCodigoVerifier() {
    const numeroSecreto = new Uint8Array(64)
    crypto.getRandomValues(numeroSecreto);
    const base64Traduccion = btoa(String.fromCharCode(...numeroSecreto));
    const verifier = base64Traduccion
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    return verifier;
}

export async function generarCodigoChallenge(verifier) {
    const textoTransformado = new TextEncoder().encode(verifier);
    const resultado = await crypto.subtle.digest('SHA-256', textoTransformado);
    const bytes = new Uint8Array(resultado);
    const Traduccion = btoa(String.fromCharCode(...bytes));
    const resultadoRemplazado = Traduccion
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    return resultadoRemplazado;
}


export async function login() {
    const verificador = generarCodigoVerifier();
    const codigoChallenge = await generarCodigoChallenge(verificador);
    localStorage.setItem('code_verifier', verificador);

    const params = new URLSearchParams({
        client_id: 'e156943e4962490888ce0a7d5389c297',
        response_type: 'code',
        redirect_uri: 'https://spotify-main-stream.vercel.app/callback.html',
        scope: 'user-top-read',
        code_challenge_method: 'S256',
        code_challenge: codigoChallenge,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params}`;

}

export async function handleCallback() {
    const parametros = new URLSearchParams(window.location.search);
    const codigo = parametros.get("code");
    const verifier = localStorage.getItem("code_verifier");
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: 'e156943e4962490888ce0a7d5389c297',
            grant_type: 'authorization_code',
            code: codigo,
            redirect_uri: 'https://spotify-main-stream.vercel.app/callback.html',
            code_verifier: verifier,
        })
    });

    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('expires_at', Date.now() + data.expires_in * 1000);
    localStorage.removeItem('code_verifier');
    window.location.href = '/';
}

export async function getToken() {
    const leerAccess_token = localStorage.getItem("access_token");
    const leerExpires_at = localStorage.getItem("expires_at");
    let respuesta = null

    if (leerAccess_token == null) {
        respuesta = null
    } else {
        if (Date.now() > leerExpires_at - 60000) {
            respuesta = await refreshAccessToken()
        }
        else {
            respuesta = leerAccess_token;
        }
    }
    return respuesta
}

export async function refreshAccessToken() {
    const leerRefreshToken = localStorage.getItem("refresh_token")

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: 'e156943e4962490888ce0a7d5389c297',
            grant_type: 'refresh_token',
            refresh_token: leerRefreshToken,
        })
    });

    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('expires_at', Date.now() + data.expires_in * 1000);

    if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
    }

    return data.access_token
}


export async function logout() {
    localStorage.clear()
    window.location.href = '/';

}
