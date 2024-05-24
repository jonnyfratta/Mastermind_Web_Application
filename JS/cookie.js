//ricavo il valore del cookie
function getCookie(name) {
    //recupero l'array dei cookie presenti
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        //recupero nome e valure di ogni cookie
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return cookieValue.trim();
        }
    }
    return null;
}

//setto il cookie
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}


