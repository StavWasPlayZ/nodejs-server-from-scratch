async function logout() {
    // Send logout request
    if ((await fetch("/action", {
        method: "POST",
        body: "logout",
        mode: "no-cors"
    })).ok) {
        // Upon success, redirect
        window.location.href = "/login";
        return;
    }
    // Something went wrong? idk, session got reset maybe
    window.location.href = "/login";
}