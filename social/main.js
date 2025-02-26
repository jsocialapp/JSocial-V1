//addon manager
class ContextMenuElement {
    constructor(name, onclick) {
        this.name=name
        this.onclick = onclick
    }

}
class ContextMenu {
    constructor(openMenu) {
        this.openMenu = openMenu
    }
}
document.addEventListener("click", (e) => {
    document.querySelectorAll("*[disapearWhenScreenClicked]").forEach(ele => {
        ele.remove()
    })
})
class JAPIContextMangerC {
    constructor() {
        this.adddonContexts = []
        this.builtinContexts = []
    }
    open(x,y,elementbelow) {
        var appended = []
        document.querySelectorAll("*[disapearWhenScreenClicked]").forEach(ele => {
            ele.remove()
        })
        var menu = document.createElement("div")
        menu.style.backgroundColor = 'RGB(64,64,64)'
        menu.style.padding = '5px'
        menu.style.borderRadius = '10px'
        menu.setAttribute("disapearWhenScreenClicked", "true")
        menu.style.position = "fixed"
        menu.style.top = y + "px"
        menu.style.left = x + "px"
        this.builtinContexts.forEach(contextmenu => {
            var submenu = document.createElement("div")
            var submenutitle = document.createElement("h3")
            submenutitle.innerText = contextmenu.catname
            submenutitle.style.fontSize = "16px"
            submenutitle.className = "muted"
            submenu.append(submenutitle)
            contextmenu.contextManger.openMenu(x,y,elementbelow).forEach(ele => {
                var btn = document.createElement("button")
                btn.style.marginBottom = "5px"
                btn.onclick = function () {
                    ele.onclick(x,y,elementbelow)
                }
                btn.innerText = ele.name
                btn.className = "btn btn-secondary"
                btn.style.width = "100%"
                submenu.append(btn)
            })
            if(contextmenu.contextManger.openMenu(x,y,elementbelow).length > 0) {
                menu.append(submenu)
                appended.push(contextmenu)
            }
        })
        this.adddonContexts.forEach(contextmenu => {
            var submenu = document.createElement("div")
            var submenutitle = document.createElement("h3")
            submenutitle.innerText = contextmenu.catname
            submenutitle.style.fontSize = "16px"
            submenutitle.className = "muted"
            submenu.append(submenutitle)
            contextmenu.contextMenu.openMenu(x,y,elementbelow).forEach(ele => {
                var btn = document.createElement("button")
                btn.style.marginBottom = "5px"
                btn.onclick = function () {
                    ele.onclick(x,y,elementbelow)
                }
                btn.innerText = ele.name
                btn.className = "btn btn-secondary"
                btn.style.width = "100%"
                submenu.append(btn)
            })
            if(contextmenu.contextMenu.openMenu(x,y,elementbelow).length > 0) {
                menu.append(submenu)
                appended.push(contextmenu)
            }
        })
        if(appended.length > 0) {
            document.body.append(menu)
        }

    }
    addMenu(contextMenu, catname) {
        this.adddonContexts.push({contextMenu, catname})
    }
    addJMenu(contextMenu, catname) {
        this.builtinContexts.push({contextMenu, catname})
    }
}
var JAPIContextManger = new JAPIContextMangerC()
if (document.addEventListener) {
    document.addEventListener('contextmenu', function(e) {
        JAPIContextManger.open(e.x,e.y,e.originalTarget)
        e.preventDefault();
    }, false);
} else {
    document.attachEvent('oncontextmenu', function() {
        JAPIContextManger.open(e.x,e.y,e.originalTarget)
        window.event.returnValue = false;
    });
}
class Addon {
    constructor(json) {
        this.data = json
        json.forEach(file => {
            if(file.filename == "info.json") {
                if(file.type == "JSON") {
                    this.info = file.content
                } else {
                    console.error("ERROR LOADING ADDON: info.json not in JSON type")
                }
            }
        })
    }
    load() {
        this.info.loadfiles.forEach(tfilename => {
            this.data.forEach(file => {
                if(file.filename == tfilename) {
                    if(file.type == "JS") {
                        var script = document.createElement("script")
                        script.innerHTML = file.content
                        document.body.append(script)
                    }
                    if(file.type == "CSS") {
                        var style = document.createElement("style")
                        style.innerHTML = file.content
                        document.head.append(style)
                    }
                }
            })
        })
    }
    install() {
        var prefs = JSON.parse(localStorage.getItem("prefs"))
        var canitbeinstalled = true
        prefs.addons.forEach(addon => {
            if(new Addon(addon).info.id === this.info.id) {
                canitbeinstalled = false
            }
        })
        if(canitbeinstalled) {
            if(!localStorage.getItem("extension." + this.info.id)) {
                localStorage.setItem("extension." + this.info.id, JSON.stringify({
                    enabled:true
                }))
            }
            prefs.addons.push(this.data)
        }
        localStorage.setItem("prefs",JSON.stringify(prefs))
        return canitbeinstalled
    }
    canIInstall() {
        var prefs = JSON.parse(localStorage.getItem("prefs"))
        var canitbeinstalled = true
        prefs.addons.forEach(addon => {
            if(new Addon(addon).info.id === this.info.id) {
                canitbeinstalled = false
            }
        })
        return canitbeinstalled
    }
    getAsJSON() {
        return JSON.stringify(this.data)
    }
}
const audio = document.createElement("audio");
audio.id = "notificationAudio"
audio.setAttribute("controls","true");
audio.style.display = "none";
document.body.append(audio);
var socket = io()
if(!localStorage.getItem("prefs")) {
    localStorage.setItem("prefs", JSON.stringify({
        darkmode:false,
        addons:[],
        notif:"new-notification"
    }))
}
if(!JSON.parse(localStorage.getItem("prefs")).addons) {
    var prefs = JSON.parse(localStorage.getItem("prefs"))
    prefs.addons = []
    localStorage.setItem("prefs", JSON.stringify(prefs))
}
if(!JSON.parse(localStorage.getItem("prefs")).notif) {
    var prefs = JSON.parse(localStorage.getItem("prefs"))
    prefs.notif = "new-notification"
    localStorage.setItem("prefs", JSON.stringify(prefs))
}
function getMonthName(num) {
    switch (num) {
        case 1:
            return "Jan";
        case 2:
            return "Feb";
        case 3:
            return "Mar";
        case 4:
            return "Apr";
        case 5:
            return "May";
        case 6:
            return "Jun";
        case 7:
            return "Jul";
        case 8:
            return "Aug";
        case 9:
            return "Sep";
        case 10:
            return "Oct";
        case 11:
            return "Nov";
        case 12:
            return "Dec";
        default:
            return "UNKNOWN"
    }
}
function formatHour(hour) {
    return {
        pm: hour > 11,
        hour: hour > 12 ? hour - 12 : hour
    }
}
    var disconnected = false
    socket.on("connect", () => {
        if(disconnected) {
            document.getElementById("staticBackdrop").remove()
            document.body.className = ""
            document.body.style.marginRight = "0px"
            document.body.style.marginRight = "scroll"
            disconnected = false
        }
        console.log("connected as "+socket.id)
        if(localStorage.getItem("token") != null) {
            socket.emit("login", localStorage.getItem("token"),false)
            setInterval(function () {
                socket.emit("ping", localStorage.getItem("token"))
            },100)
        }
    })
setInterval(() => {
    document.querySelectorAll(".customsize").forEach(ele => {
        ele.style.fontSize = ele.getAttribute("size") + "px"
    })
})
socket.on("disconnect", () => {
    var disconectedmodal = document.createElement("div")
    document.body.className = "modal-open"
    document.body.style.marginRight = "0px"
    document.body.style.marginRight = "scroll"
    disconectedmodal.className = "modal show"
    disconectedmodal.id = "staticBackdrop"
    disconectedmodal.setAttribute("data-bs-backdrop", "static")
    disconectedmodal.setAttribute("data-bs-keyboard","false")
    disconectedmodal.setAttribute("aria-hidden","true")
    disconectedmodal.setAttribute("tabindex","-1")
    disconectedmodal.setAttribute("aria-modal","true")
    disconectedmodal.setAttribute("role","dialog")
    disconectedmodal.style.display = "block"
    disconectedmodal.innerHTML = `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">Disconnected</h1>
      </div>
      <div class="modal-body">
        You have disconnected from the server. Check your internet connection. If your internet still works wait a little we might be updating or under maintainance.
      </div>
    </div>
  </div>
`
    document.body.append(disconectedmodal)
    disconnected = true
})
let isgodmode = false
if(location.pathname.startsWith("/login") && localStorage.getItem("token")) {
    location.pathname = "/"
}
if(location.pathname.startsWith("/signup") && localStorage.getItem("token")) {
    location.pathname = "/"
}
if(location.pathname.startsWith("/admin")) {
    checkpriv("admin.menu").then(res => {
        if(!res) {
            location.pathname = "/"
        }
    })
}
function shortenAmount(amount) {
    if(amount >= 1000 && amount < 100000) {
        return Math.floor(amount / 100) / 10 + "k"
    }
    if(amount >= 100000 && amount < 1000000) {
        return Math.floor(amount / 1000) + "k"
    }
    if(amount >= 1000000 && amount < 100000000) {
        return Math.floor(amount / 100000) / 10 + "m"
    }
    if(amount >= 100000000 && amount < 1000000000) {
        return Math.floor(amount / 1000000) + "m"
    }
    if(amount >= 1000000000 && amount < 100000000000) {
        return Math.floor(amount / 100000000) / 10 + "b"
    }
    if(amount >= 100000000000 && amount < 1000000000000) {
        return Math.floor(amount / 1000000000) + "b"
    }
    if(amount >= 1000000000000 && amount < 100000000000000) {
        return Math.floor(amount / 100000000000) / 10 + "t"
    }
    if(amount >= 100000000000000 && amount < 1000000000000000) {
        return Math.floor(amount / 1000000000000) + "t"
    }
    if(amount >= 1000000000000) {
        return 'Alot'
    }
    return String(amount)
}
async function generatePost(where, postid,ifthereisauserputinauser,order) {
    if(!ifthereisauserputinauser) {
        await fetch("/api/getPost/" + postid).then(res => res.json()).then(res => {
            console.table({"POST ID":res.id,"POST TITLE":res.title,"POST CONTENT": res.content})
            var postele = document.createElement("div");
            postele.innerHTML = `<div class="card mb-2" style="min-width: 24rem; max-width: 32rem; margin-left: 2rem;"><div class="card-body">
                <h6 class="card-title" postname><img src="/api/media/pfp/" pfp height="24px" width="24px" style="border-radius: 15px; margin-right: .25rem;" >[DISPLAYNAME]</h6>
                <h5 posttitle></h5>
                <p class="card-text" posttxt></p>
                <button likebtn class="btn btn-danger">Like (UNKNOWN)</button>
                
            </div><div class="card-footer text-body-secondary" time>
    
  </div></div>`
            if (localStorage.getItem("token")) {
                postele.querySelector("button[likebtn]").innerText = res.likes.includes(localStorage.getItem("token").split(".")[0]) ? `Liked (${shortenAmount(res.likes.length)})` : `Like (${res.likes.length})`
            } else {
                postele.querySelector("button[likebtn]").innerText = `Like (${shortenAmount(res.likes.length)})`
            }
            if (res.time) {
                var time = new Date(res.time)
                var hour = formatHour(time.getHours())
                var date = getMonthName(time.getMonth() + 1) + " " + time.getDate() + " " + time.getFullYear() + ", " + hour.hour + ":" + String(time.getMinutes()).padStart(2,"0") + " " + (hour.pm ? "PM" : "AM")
                postele.querySelector("div[time]").innerText = date
            } else {
                postele.querySelector("div[time]").innerText = "Time unavailable"
            }
            var posttext = res.content
            var postlist = []
            postlist = posttext.split(" ")
            var list2 = []
            postlist.forEach(ele => {
                if(ele.startsWith("http://") || ele.startsWith("https://")) {
                    list2.push(`<a href="${ele}">${ele}</a>`)
                } else {
                    list2.push(ele)
                }
            })
            postele.querySelector("p[posttxt]").innerHTML = list2.join(" ")
            postele.querySelector("h5[posttitle]").innerText = res.title
            fetch("/api/user/" + postid.split(".")[0]).then(re1s => re1s.json()).then(user => {
                postele.querySelector("h6[postname]").innerHTML = postele.querySelector("h6[postname]").innerHTML.replaceAll("[DISPLAYNAME]", user.displayname)
                postele.querySelector("img[pfp]").src = `/api/media/pfp/${user.uid}`
                postele.querySelector(".card-title").addEventListener("click", () => {
                    location.pathname = "/user/" + user.url
                })
                postele.querySelector("button[likebtn]").onclick = function () {
                    if (localStorage.getItem("token")) {
                        if (!res.likes.includes(localStorage.getItem("token").split(".")[0])) {
                            var myHeaders = new Headers();
                            myHeaders.append("token", localStorage.getItem("token"));

                            var requestOptions = {
                                method: 'POST',
                                headers: myHeaders,
                                redirect: 'follow'
                            };

                            fetch(`/user/${user.url}/like/${res.id}`, requestOptions)
                                .then(response => response.text())
                                .then(result => {
                                    if (result === "Done") {
                                        res.likes.push(localStorage.getItem("token").split(".")[0])
                                        postele.querySelector("button[likebtn]").innerText = res.likes.includes(localStorage.getItem("token").split(".")[0]) ? `Liked (${res.likes.length})` : `Like (${res.likes.length})`
                                    }
                                })
                                .catch(error => console.error('error', error));
                        }
                    }

                }
            })
            if(order) {
                where.append(postele)
            } else {
                where.prepend(postele)
            }
        })
    } else {
        var postele = document.createElement("div");
        var res = null
        ifthereisauserputinauser.posts.forEach(thepost => {
            if(ifthereisauserputinauser.uid + "." + thepost.id == postid) {
                res = thepost
            }
        })
        console.table({"POST ID":res.id,"POST TITLE":res.title,"POST CONTENT": res.content})
        postele.innerHTML = `<div class="card mb-2" style="min-width: 24rem; max-width: 32rem; margin-left: 2rem;"><div class="card-body">
                <h6 class="card-title" postname><img src="/api/media/pfp/" pfp height="24px" width="24px" style="border-radius: 15px; margin-right: .25rem;" >[DISPLAYNAME]</h6>
                <h5 posttitle></h5>
                <p class="card-text" posttxt></p>
                <button likebtn class="btn btn-danger">Like (UNKNOWN)</button>
            </div><div class="card-footer text-body-secondary" time>
    
  </div></div>`
        if (localStorage.getItem("token")) {
            postele.querySelector("button[likebtn]").innerText = res.likes.includes(localStorage.getItem("token").split(".")[0]) ? `Liked (${res.likes.length})` : `Like (${res.likes.length})`
        } else {
            postele.querySelector("button[likebtn]").innerText = `Like (${res.likes.length})`
        }


        if (res.time) {
            var time = new Date(res.time)
            var hour = formatHour(time.getHours())
            var date = getMonthName(time.getMonth() + 1) + " " + time.getDate() + " " + time.getFullYear() + ", " + hour.hour + ":" + String(time.getMinutes()).padStart(2,"0") + " " + (hour.pm ? "PM" : "AM")
            postele.querySelector("div[time]").innerText = date
        } else {
            postele.querySelector("div[time]").innerText = "Time unavailable"
        }
        var posttext = res.content
        var postlist = []
        postlist = posttext.split(" ")
        var list2 = []
        postlist.forEach(ele => {
            if(ele.startsWith("http://") || ele.startsWith("https://")) {
                list2.push(`<a href="${ele}">${ele}</a>`)
            } else {
                list2.push(ele)
            }
        })
        postele.querySelector("p[posttxt]").innerHTML = list2.join(" ")
        postele.querySelector("h5[posttitle]").innerText = res.title
        postele.querySelector(".card-title").addEventListener("click", () => {
            location.pathname = "/user/" + ifthereisauserputinauser.url
        })
        postele.querySelector("h6[postname]").innerHTML = postele.querySelector("h6[postname]").innerHTML.replaceAll("[DISPLAYNAME]", ifthereisauserputinauser.displayname)
        postele.querySelector("img[pfp]").src = `/api/media/pfp/${ifthereisauserputinauser.uid}`
        postele.querySelector("button[likebtn]").onclick = function () {
            if (localStorage.getItem("token")) {
                if (!res.likes.includes(localStorage.getItem("token").split(".")[0])) {
                    var myHeaders = new Headers();
                    myHeaders.append("token", localStorage.getItem("token"));

                    var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        redirect: 'follow'
                    };

                    fetch(`/user/${ifthereisauserputinauser.url}/like/${res.id}`, requestOptions)
                        .then(response => response.text())
                        .then(result => {
                            if (result === "Done") {
                                res.likes.push(localStorage.getItem("token").split(".")[0])
                                postele.querySelector("button[likebtn]").innerText = res.likes.includes(localStorage.getItem("token").split(".")[0]) ? `Liked (${res.likes.length})` : `Like (${res.likes.length})`
                            }
                        })
                        .catch(error => console.error('error', error));
                }
            }

        }
        if(order) {
            where.append(postele)
        } else {
            where.prepend(postele)
        }

    }

}
function createNotification(title, message, imagelink, displaytoast, playsound, soundtype, buttons) {
    if(displaytoast) {
        var toast = document.createElement("div")
        toast.className = "toast"
        toast.role = "alert"
        toast["area-live"] = "assertive"
        toast["area-atomic"] = "true"
        var toasttop = document.createElement("div")
        var toastImage = document.createElement("img")
        var toastbody = document.createElement("div")
        var toastTitle = document.createElement("strong")
        var toastClose = document.createElement("button")
        toastImage.height = 24
        toasttop.className = "toast-header"
        toastClose.type = "button"
        toastClose.className = "btn-close"
        toastClose.onclick = function () {
            toast.remove()
        }
        toastImage.className = "rounded me-2"
        toastImage.src = imagelink
        toastbody.innerText = message
        toastbody.className = "toast-body"
        if(buttons != null) {
            if(buttons.length != 0) {
                var toastbtns = document .createElement("div")
                toastbtns.className = "mt-2 pt-2 border-top"
                buttons.forEach(btn => {
                    var button = document.createElement("button")
                    button.type = "button"
                    button.className = `btn btn-${btn.style} btn-sm`
                    button.innerHTML = btn.text
                    if (btn.type === "link") {
                        button.onclick = function () {
                            window.location.href = btn.link;
                        };
                    }
                    toastbtns.append(button)
                })
                toastbody.append(toastbtns)
            }
        }

        toastTitle.innerText = title
        toastTitle.className = "me-auto"
        toasttop.append(toastImage)
        toasttop.append(toastTitle)
        toasttop.append(toastClose)
        toast.append(toasttop)
        toast.append(toastbody)
        toast.style.display = "block"
        if(playsound) {
            audio.play()
        }
        document.getElementById("toastBox").appendChild(toast)
    }
    if(playsound && !displaytoast) {
        var playingsound = soundtype
        if(playingsound == "") {
            if(JSON.parse(localStorage.getItem("prefs")).notif == "custom") {
                const savedAudioData = localStorage.getItem('notificationAudio');

                if (savedAudioData) {
                    audio.src = savedAudioData;
                    audio.play();
                } else {
                    console.warn('No audio data found. Please upload an audio file.');
                }
            } else {
                playingsound = JSON.parse(localStorage.getItem("prefs")).notif
                var audio2 = new Audio("/api/media/sounds/" + playingsound + ".mp3")
                audio2.play()
            }


        } else {
            var audio2 = new Audio("/api/media/sounds/" + playingsound + ".mp3")
            audio2.play()
        }
    }
}
async function checkbadge(badgename) {
    if(!(localStorage.getItem("token") == null)) {
        var returnval = false;
        await fetch(`/api/user/${localStorage.getItem("token").split(".")[0]}`)
            .then(response => response.text())
            .then(result => {
                if(result !== "Unable to find account") {
                    var user = JSON.parse(result)
                    returnval = user.badges.includes(badgename)
                }
            })
        return returnval
    } else {
        return false
    }
}
async function checkpriv(privname) {
    if(!(localStorage.getItem("token") == null)) {
        var returnval = false;
        await fetch(`/api/user/${localStorage.getItem("token").split(".")[0]}`)
            .then(response => response.text())
            .then(result => {
                if(result !== "Unable to find account") {
                    var user = JSON.parse(result)
                    returnval = user.privileges.includes(privname)
                }
            })
                return returnval
    } else {
        return false
    }
}

function godmode() {
    if(isgodmode) {
        location.reload()
    } else {
        isgodmode = true
        checkpriv("admin.godmode").then(res =>{
            if(res) {
                createNotification("GODMODE ACTIVATED", "You have activated god mode. You have insane power dont overuse it. This feature is only for admins. If you use it as a regular person you will be banned.", "", true, false, "", null)
            }
        })
    }
}
if (document.getElementById("toastBox")) document.getElementById("toastBox").style.position = "fixed"
var navbar = document.createElement("nav")
navbar.className = "navbar navbar-expand-lg bg-body-tertiary"
if(localStorage.getItem("prefs")) {
    var prefs = JSON.parse(localStorage.getItem("prefs"))
    prefs.addons.forEach(addonjson => {
        var addon = new Addon(addonjson)
        if(localStorage.getItem("extension." + addon.info.id)) {
            if(JSON.parse(localStorage.getItem("extension." + addon.info.id)).enabled) {
                addon.load()
            }
        }

    })
}
setInterval(() => {
    if(localStorage.getItem("prefs")) {
        var prefs = JSON.parse(localStorage.getItem("prefs"))
        var istheretheme = false
        prefs.addons.forEach(addon => {
            var addonn = new Addon(addon)
            if(addonn.info.permissions.includes("themes")) {
                istheretheme = true
            }
        })
        if(istheretheme) {
            prefs.addons.forEach(addon => {
                var addonn = new Addon(addon)
                if(addonn.info.permissions.includes("themes")) {
                    addonn.data.forEach(file => {
                        if(file.filename == "theme.js" && file.type == "JS") {
                            eval(file.content)
                        }
                    })
                }
            })
        } else {
            if(prefs.darkmode) {
                if(document.getElementById("logo")) {
                    document.getElementById("logo").src = "/api/media/custom/jsocial.png"
                }
                if(location.pathname.startsWith("/messenger")) {
                    document.getElementById("leftside").style.backgroundColor = "#5d5d5d"
                    document.getElementById("textbox").style.backgroundColor = "#919191"
                }
                if(location.pathname.startsWith("/user/")) {
                    document.querySelectorAll(".stats a,.stats span").forEach(ele => {
                        ele.style.color="white"
                    })
                }
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
            } else {
                if(document.getElementById("logo")) {
                    document.getElementById("logo").src = "/api/media/custom/jsocial.png"
                }
                if(location.pathname.startsWith("/user/")) {
                    document.querySelectorAll(".stats a,.stats span").forEach(ele => {
                        ele.style.color="black"
                    })
                }

                navbar.className = "navbar navbar-expand-lg bg-body-tertiary"
                document.querySelectorAll("*").forEach(ele => {
                    ele.setAttribute("data-bs-theme", "light")
                })
                navbar.querySelectorAll("*").forEach(ele => {
                    ele.style.color = "black"
                })
                navbar.setAttribute("data-bs-theme", "light")
            }
        }
    }
},1)

fetch("/api/devmode").then(res => res.json()).then(res => {
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
                    <li class="nav-item" id="logged-in1">
                        <a class="nav-link" href="/messenger">Messages</a>
                    </li>
                    <form class="container-fluid justify-content-start" id="not-logged-in" style="display: none;">
                        <a href="/login"><button class="btn btn-success me-2" type="button">Login</button></a>
                        <a href="/signup"><button class="btn btn-success me-2" type="button">Signup</button></a>
                    </form>
                    <li class="nav-item dropdown" id="logged-in" style="display: none;">
                        <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            My account
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/login" id="profilenavlink">Profile</a></li>
                            <li><a class="dropdown-item" href="/editprofile">Edit profile</a></li>
                            <li><a class="dropdown-item" href="/manage">Manage account</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-white bg-danger" href="/logout">Logout</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown" id="admin-logged-in" style="display: none;">
                        <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Admin
                        </a>
                        <ul class="dropdown-menu">
                            <li id="admindashboard"><a class="dropdown-item" href="/admin/dashboard" id="profilenavlink">Dashboard</a></li>
                            <li id="adminprofiles"><a class="dropdown-item" href="/admin/profiles">Profiles</a></li>
                            <li id="adminchats"><a class="dropdown-item" href="/admin/chats">Chats</a></li>
                            <li id="admingodmode"><button class="dropdown-item" onclick="godmode()">God Mode</button></li>
                            <li id="adminmassmail"><a class="dropdown-item" href="/admin/mm">Mass mail</a></li>
                        
                        </ul>
                    </li>
                </ul>
                <form class="d-flex" role="search" action="/search">
                    <input class="form-control me-2" type="search" name="query" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
        </div>
    `
    document.body.prepend(navbar)
    // var footer = document.createElement("footer")
    // footer.innerHTML = `
    //     <h5>JSocial ${res.mode} ${res.version}</h5>
    //     <p>Made by <a href="https://justwhatever.net">JustWhatever</a></p>
    //     ${res.mode == "DEV" ? "<p>Welcome to your testing bench for all kinds of activites. If you need an admin account login with NAME:admin password:admin1234 pin:0000. If this account is missing any permissions make sure to add them to publicuserdb.json. Thank you for developing JSocial" : `<p>Shoutout to <a href="/user/cookiekiller">cookiekiller</a> for helping bug fix and give ideas</p>
    //     <p>Shoutout to <a href="jwn.social/user/in">riwey</a> for carrying me in fortnite</p>`}
    //
    // `
    // function adjustFooterPosition() {
    //     var thefooter = document.querySelector("footer")
    //     if(document.querySelector("main")) {
    //         const isContentFullHeight = document.querySelector("main").offsetHeight >= window.innerHeight;
    //         thefooter.style.position = isContentFullHeight ? 'static' : 'fixed';
    //     } else if(document.querySelector("*[main]")){
    //         const isContentFullHeight = document.querySelector("*[main]").offsetHeight >= window.innerHeight;
    //         thefooter.style.position = isContentFullHeight ? 'static' : 'fixed';
    //     } else {
    //         document.querySelector("footer").remove()
    //     }
    //
    // }
    // if(document.querySelector("main") || document.querySelector("*[main]")) {
    //     if (location.pathname !== "/messenger") {
    //         document.body.append(footer)
    //         adjustFooterPosition();
    //     }
    // }
    // window.addEventListener('resize', adjustFooterPosition);
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};



if(!(localStorage.getItem("token") == null)) {
    fetch(`/api/user/${localStorage.getItem("token").split(".")[0]}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            if(result !== "Unable to find account") {
                var user = JSON.parse(result)
                document.getElementById("logged-in").style.display = "block"
                document.getElementById("logged-in1").style.display = "block"
                document.getElementById("not-logged-in").style.display = "none"
                document.getElementById("profilenavlink").href = "/user/" + user.url
                if(user.privileges.includes("admin.menu")) {
                    document.getElementById("admin-logged-in").style.display = "block"
                    if(!user.privileges.includes("admin.dashboard")) document.getElementById("admindashboard").remove()
                    if(!user.privileges.includes("admin.profiles")  ) document.getElementById("adminprofiles").remove()
                    if(!user.privileges.includes("admin.godmode")) document.getElementById("admingodmode").remove()
                    if(!user.privileges.includes("admin.chats")) document.getElementById("adminchats").remove()
                    if(!user.privileges.includes("admin.massmail")) document.getElementById("adminmassmail").remove()
                }
                if(user.banned.value) {
                    setInterval(() => {
                        function calculateTimeInMillis(seconds, minutes, hours, days, weeks, months, years) {
                            var returntime = 0;
                            returntime += seconds * 1000
                            returntime += minutes * 60000
                            returntime += hours * 1000 * 60 * 60
                            returntime += days * 1000 * 60 * 60 * 24
                            returntime += weeks * 1000 * 60 * 60 * 24 * 7
                            returntime += months * 1000 * 60 * 60 * 24 * (365.25 / 12)
                            returntime += years * 1000 * 60 * 60 * 24 * 365.25
                            return returntime
                        }

                        function calculateTimeInObject(millis) {
                            var delta = Math.abs(millis)
                            var years = Math.floor(delta / 31557600000)
                            delta -= years * 31557600000;

                            var months = Math.floor(delta / 2635200000)
                            delta -= months * 2635200000;

                            var days = Math.floor(delta / 86400000);
                            delta -= days * 86400000;

                            var hours = Math.floor(delta / 3600000) % 24;
                            delta -= hours * 3600000;
                            var minutes = Math.floor(delta / 60000) % 60;
                            delta -= minutes * 60000;
                            var seconds = Math.floor((delta / 1000)) % 60;
                            return {
                                seconds,
                                minutes,
                                hours,
                                days,
                                months,
                                years
                            }
                        }
                        var thetimetillfinish = calculateTimeInObject(new Date(user.banned.endDate).getTime() - Date.now())
                        if (Date.now() > new Date(user.banned.endDate).getTime()) {
                            location.reload()
                        }
                       document.body.innerHTML = `
                           <div class="center">
        <h1 class="text-center">You have been banned</h1>
        <h2 class="text-center">${user.banned.reason}</h2>
        <h3 class="text-center">${thetimetillfinish.years} years ${thetimetillfinish.months} months ${thetimetillfinish.days} days ${thetimetillfinish.hours} hours ${thetimetillfinish.minutes} minutes ${thetimetillfinish.seconds} seconds</h3>
    </div>
                       `
                    },1)
                }
            } else {
                document.getElementById("admin-logged-in").remove()
                document.getElementById("admindashboard").remove()
                document.getElementById("adminprofiles").remove()
                document.getElementById("admingodmode").remove()
                document.getElementById("logged-in").style.display = "none"
                document.getElementById("logged-in1").style.display = "none"
                document.getElementById("not-logged-in").style.display = "block"
            }
        })
        .catch(error => console.log('error', error));
} else {
    document.getElementById("logged-in").style.display = "none"
    document.getElementById("logged-in1").style.display = "none"
    document.getElementById("admin-logged-in").remove()
    document.getElementById("not-logged-in").style.display = "block"
}
})
function newMassMail(title,desc,img) {
    var backfade = document.createElement("div")
    backfade.className = "mm-fade"
    var mm = document.createElement("div")
    mm.className = "mass-mail"
    mm.innerHTML = `
    <img src="${img}" height="250px" />
        <h3>${title}</h3>
        <div class="body">
            <div descs></div>
           
        </div>
        <button class="btn btn-primary jclosebtn" closebtn>Close</button>
`
    mm.querySelector("*[closebtn]").onclick = function () {
        if(document.querySelector(".mm-fade")) {
            backfade.remove()
        }
        mm.remove()
    }
    desc.split("\n").forEach(line => {
        var appending = ""
        line.split("[size]").forEach(part => {
            if(part.startsWith("(")) {
                if(part.split("(")[1] == "auto") {
                    appending = appending + `</span>` + part.split(")")[1]
                } else {
                    if(part.split("(")[1].split(")")[0].endsWith("b")) {
                        appending = appending + `<span class="customsize" size="${part.split("(")[1].split(")")[0].split("b")[0]}" bold>` + part.split(")")[1]
                    } else {
                        appending = appending + `<span class="customsize" size="${part.split("(")[1].split(")")[0]}">` + part.split(")")[1]
                    }
                }
            } else {
                appending = appending + part
            }
        })
        var desc2 = document.createElement("p")
        desc2.innerHTML = appending
        mm.querySelector("*[descs]").append(desc2)
    })

    if(!document.querySelector(".mm-fade")) {
        document.body.append(backfade)
    }
    document.body.append(mm)
}
socket.on('newMM', (content) => {
    newMassMail(content.title,content.desc,content.image)
})
var canusenotifs=false
if(localStorage.getItem("token")) {
    Notification.requestPermission().then(result => {
        if(result === "granted") {
            canusenotifs = true
        }
    })
}
setInterval(function () {
    var myHeaders = new Headers();
    myHeaders.append("token", localStorage.getItem("token"));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("/api/messanger/getunreadnotifs", requestOptions)
        .then(response => response.json())
        .then(result => {
            result.forEach(unreadnotif => {
                if(!document.hasFocus()) {
                    if(canusenotifs) {
                        var notif = new Notification(unreadnotif.displayname, {
                            body:unreadnotif.content
                        })
                        notif.addEventListener("click", () => {
                            open(location.origin + "/messenger?id=" + unreadnotif.cid)
                        })
                    }
                }
                createNotification(unreadnotif.displayname,unreadnotif.content,"/api/media/pfp/" + unreadnotif.sender,location.pathname !== "/messenger",true,"", [
                    {
                        type:"link",
                        link:location.origin + "/messenger?id=" + unreadnotif.cid,
                        text:"Open",
                        style:"primary"
                    }
                ])
            })
        })
        .catch(error => console.log('error', error));
},500)