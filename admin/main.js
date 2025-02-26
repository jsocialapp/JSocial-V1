if(!localStorage.getItem("key")) {
    if(location.pathname !== "/") location.pathname = "/"
} else {
    if(location.pathname == "/") location.pathname = "/main"
    const socket = io()
    socket.on("connect", () => {
        console.log(socket.id)
    })
    var navbar = document.createElement("nav")
    navbar.className = "navbar navbar-expand-lg bg-body-tertiary"
    navbar.innerHTML = `
        <div class="container-fluid">
            <a class="navbar-brand" href="/">JSocial SUPER ADMIN</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/main">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/rc">Remote Console</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            ROOT ADMIN
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/rootadmin/profiles">Profiles</a></li>
                            <li><a class="dropdown-item" href="/rootadmin/auditlog">Audit Log</a></li>
                        </ul>
                    </li>
                </ul>
                <div class="d-flex">
                    <button class="btn btn-outline-danger">LOGOUT</button>
                </div>
            </div>
        </div>
    `
    document.body.prepend(navbar)
}
