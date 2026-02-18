export function generateCodeVerifier() {
    const numeroSecreto = new Uint8Array(64)
    crypto.getRandomValues(numeroSecreto);
    const base64Traduccion = btoa(String.fromCharCode(...numeroSecreto));
    const verifier = base64Traduccion
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    return verifier;
}

export async function generateCodeChallenge(verifier) {
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
    const verificador = generateCodeVerifier();
    const codigoChallenge = await generateCodeChallenge(verificador);
    localStorage.setItem('code_verifier', verificador);
    


}

