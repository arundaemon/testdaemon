(function() {
    let token = localStorage.getItem('UserToken')
    if (token) {
        axios.defaults.headers.common['AccessToken'] = token;
    }
    else {
        axios.defaults.headers.common['AccessToken'] = null;
    }
})()