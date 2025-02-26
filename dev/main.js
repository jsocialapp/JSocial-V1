var navbar = document.createElement("nav")
navbar.className = "navbar bg-dark navbar-expand-lg bg-body-tertiary"
document.querySelectorAll("*").forEach(ele => {
    ele.setAttribute("data-bs-theme", "dark")
})
navbar.querySelectorAll("*").forEach(ele => {
    if(!ele.getAttribute("black")) {
        ele.style.color = "white"
    } else {
        ele.style.color = "black"
    }
})
navbar.setAttribute("data-bs-theme", "dark")
if(localStorage.getItem("token")) {
    navbar.innerHTML = `
        <div class="container-fluid">
        
            <a class="navbar-brand" style="font-family: Argon,sans-serif; font-size:26px;" href="/"><img src="/api/media/custom/jsocial.png" id="logo" alt="JSocial" height="32" class="d-inline-block align-text-top" style="margin-right: -5px"></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/app">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/bots">Bots</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/japi">JAPI</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="https://docs.jwn.social">Docs</a>
                    </li>
                </ul>
            </div>
        </div>
    `
} else {
    navbar.innerHTML = `
        <div class="container-fluid">
        
            <a class="navbar-brand" style="font-family: Argon,sans-serif; font-size:26px;" href="/"><img src="/api/media/custom/jsocial.png" id="logo" alt="JSocial" height="32" class="d-inline-block align-text-top" style="margin-right: -5px"></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="https://docs.jwn.social">Docs</a>
                    </li>
                </ul>
            </div>
        </div>
    `
}
navbar.querySelectorAll("*").forEach(ele => {
    if(!ele.getAttribute("black")) {
        ele.style.color = "white"
    } else {
        ele.style.color = "black"
    }
})
document.body.prepend(navbar)