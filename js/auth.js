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

