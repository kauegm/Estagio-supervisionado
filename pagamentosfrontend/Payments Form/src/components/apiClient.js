async function apiRequest(endpoint, method = "GET", body = null) {
    const options = {
        method
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    return await fetch(`http://localhost:8080${endpoint}`, options);
}

export { apiRequest };
