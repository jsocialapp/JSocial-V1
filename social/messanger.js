var selectedchatid = null
var peopleonline = []
var myHeaders = new Headers();
myHeaders.append("token", localStorage.getItem("token"));
var urlparams = new URLSearchParams(location.search)
var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};
var lasttimemessage = 0
var lasttimeityped = 0
var invitingusers = []
fetch("/api/user/" + localStorage.getItem("token").split(".")[0]).then(res => res.json()).then(myuser => {
    var userdisplaynames = [myuser.displayname]
    invitingusers.forEach(invitinguser => {
        userdisplaynames.push(invitinguser.name)
    })
    document.getElementById("members").innerHTML = userdisplaynames.join(", ")
})
fetch("/api/messanger/getfollowing", requestOptions)
    .then(response => response.json())
    .then(result => {
        result.forEach(followinguser=>{
            var usercard = document.createElement("div")
            usercard.className = "card mb-3"
            usercard.setAttribute("data-uid", followinguser.uid)
            usercard.innerHTML = `<div class="card-body">
                                <h5 class="card-title">${followinguser.displayname}</h5>
                                <button class="btn btn-success">ADD</button>
                            </div>`
            usercard.querySelector("button").onclick = function () {
                if(usercard.querySelector("button").innerText == "ADD") {
                    invitingusers.push({uid:usercard.getAttribute("data-uid"),name:usercard.querySelector(".card-title").innerText})
                    usercard.querySelector("button").innerText = "REMOVE"
                    usercard.querySelector("button").className = "btn btn-danger"
                } else {
                    invitingusers = invitingusers.filter(e => e.uid !== usercard.getAttribute("data-uid"))
                    usercard.querySelector("button").innerText = "ADD"
                    usercard.querySelector("button").className = "btn btn-success"
                }
                fetch("/api/user/" + localStorage.getItem("token").split(".")[0]).then(res => res.json()).then(myuser => {
                    var userdisplaynames = [myuser.displayname]
                    invitingusers.forEach(invitinguser => {
                        userdisplaynames.push(invitinguser.name)
                    })
                    document.getElementById("members").innerHTML = userdisplaynames.join(", ")
                })
            }
            document.getElementById("createchat").onclick = function () {
                console.log("hi")
                fetch("/api/user/" + localStorage.getItem("token").split(".")[0]).then(res => res.json()).then(myuser => {
                    var userdisplaynames = [myuser.displayname]
                    invitingusers.forEach(invitinguser => {
                        userdisplaynames.push(invitinguser.name)
                    })
                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("token", localStorage.getItem("token"));
                    var thename = document.getElementById("groupnameinput").value
                    if(thename == "") {
                        thename = userdisplaynames.join(", ")
                    }
                    var themembers = []
                    invitingusers.forEach(invitinguser1 => {
                        themembers.push(invitinguser1.uid)
                    })
                    var raw = JSON.stringify({
                        "members": themembers,
                        "name": thename
                    });

                    var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow'
                    };
                    fetch("/api/messanger/createchat", requestOptions)
                        .then(response => response.text())
                        .then(result => {
                            setTimeout(function () {
                                var modal = document.getElementById("newchatmodal")
                                document.body.className = ""
                                modal.style.display = "none"
                                modal.setAttribute("role","")
                                modal.setAttribute("area-modal","")
                                modal.setAttribute("area-hidden","true")
                                document.getElementsByClassName("modal-backdrop fade show")[0].remove()
                                updateChats()
                            },100)
                        })
                        .catch(error => console.log('error', error));
                })

            }
                document.getElementById("cards").prepend(usercard)
        })
    })
    .catch(error => console.log('error', error));
function updateChats() {
    fetch("/api/messanger/profilechats", requestOptions)
        .then(response => response.json())
        .then(participatingchatids => {
                document.getElementById("chats").innerHTML = ""
                if(participatingchatids.length > 0) {
                    if(urlparams.has("id")) {
                        selectedchatid = urlparams.get("id")
                    } else {
                        selectedchatid = participatingchatids[0].id
                    }
                    participatingchatids.forEach(chat => {
                        var chatele1 = document.createElement("input")
                        chatele1.type = "radio"
                        chatele1.className = "btn-check"
                        chatele1.id = chat.id
                        chatele1.name = "chatopened"
                        chatele1.autocomplete = false
                        chatele1.checked = participatingchatids.indexOf(chat) === 0
                        if (participatingchatids.indexOf(chat) === 0) {
                            if(urlparams.has("id")) {
                                selectedchatid = urlparams.get("id")
                            } else {
                                selectedchatid = chat.id
                            }
                        }
                        var chatele2 = document.createElement("label")
                        chatele2.className = "btn btn-secondary"
                        chatele2.style.borderRadius = "0px"
                        chatele2.style.width = "100%"
                        chatele2.innerText = chat.name
                        if(selectedchatid == chat.id) {
                            chatele1.checked = true
                        }
                        chatele2.setAttribute("for", chat.id)
                        document.getElementById("chats").append(chatele1)
                        document.getElementById("chats").append(chatele2)
                    })
                    var lastchatmessages = []
                    var lastchatbox = []
                    function updatechatbox(currentid) {
                        var myHeaders = new Headers();
                        myHeaders.append("token", localStorage.getItem("token"));

                        var requestOptions = {
                            method: 'GET',
                            headers: myHeaders,
                            redirect: 'follow'
                        };
                        fetch("/api/messanger/getchat/" + currentid, requestOptions)
                            .then(response => response.json())
                            .then(chat => {
                                document.getElementById("textbox").placeholder = "Messaging " + chat.name
                                if(lastchatmessages.length != chat.messages.length) {
                                    document.getElementById("chatboxes").innerHTML = ""
                                    chat.messages.forEach(message => {
                                        var chatdiv = document.createElement("div")
                                        chatdiv.style.display = "inline-block"
                                        chatdiv.style.position = "relative"
                                        chatdiv.style.width = "100%"
                                        if (message.sender == localStorage.getItem("token").split(".")[0]) {
                                            chatdiv.innerHTML = `<div style="display: inline-block; position: relative; width: 100%; right: 0; text-align: right"><p messageTime="${message.timesent}" style="display: inline-block; margin-right: 4px; background-color: #0b8ebe; padding: 1rem; border-radius: 15px; border-bottom-right-radius: 0px; overflow-wrap: break-word; word-wrap: break-word; white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -o-pre-wrap;word-wrap: break-word; color: black" makemetext></p><img src="/api/media/pfp/${message.sender}" height="24px" width="24px" style="border-radius: 50%;">`
                                        } else {
                                            chatdiv.innerHTML = `<img src="/api/media/pfp/${message.sender}" height="24px" width="24px" style="border-radius: 50%;"><p messageTime="${message.timesent}" style="display: inline-block; margin-left: 4px; background-color: #ababab; padding: 1rem; border-radius: 15px; border-bottom-left-radius: 0px; overflow-wrap: break-word; word-wrap: break-word; color: black" makemetext></p>`
                                        }
                                        chatdiv.querySelector("*[makemetext]").innerText = message.content
                                        document.getElementById("chatboxes").append(chatdiv)
                                    })
                                    resetOnlinePeople()
                                    lastchatmessages = chat.messages
                                    setTimeout(function () {
                                        document.getElementById("ting").scrollTo(0,document.getElementById("ting").scrollHeight)
                                    },100)
                                }
                            })
                            .catch(error => console.log('error', error));
                    }
                    checkpriv("messanger.send").then(res => {
                        if(!res) {
                            document.getElementById("textbox").disabled = true
                        }
                    })
                    function sendMessage(text) {
                        var myHeaders = new Headers();
                        myHeaders.append("content", text);
                        myHeaders.append("token", localStorage.getItem("token"));

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            redirect: 'follow'
                        };
                        if(text !== "" && Date.now() - lasttimemessage > 1000) {
                            fetch("/api/messanger/createmessage/" + selectedchatid, requestOptions)
                                .then(response => response.text())
                                .then(result => {
                                    if(result !== "meh" && result !== "too quick") {
                                        document.getElementById("textbox").value = ""
                                        lasttimemessage = Date.now()
                                    } else {
                                        createNotification("Error sending message", result, null, true, false, "")
                                    }

                                })
                                .catch(error => console.log('error', error));
                        }

                    }
                    document.getElementById('textbox').addEventListener("keyup", function (e) {
                        if (e.key == "Enter") {
                            if(Date.now() - lasttimemessage > 500) {
                                sendMessage(document.getElementById("textbox").value)
                                lasttimemessage = Date.now()
                            }
                        }
                    })
                    document.getElementById("textbox").addEventListener("keydown", function (e) {
                        if(e.key != "Enter") {
                            lasttimeityped = Date.now()
                        }

                    })
                    document.getElementById("sentbtn").onclick = function () {
                        if(Date.now() - lasttimemessage > 500) {
                            sendMessage(document.getElementById("textbox").value)
                            lasttimemessage = Date.now()
                        }
                    }
                    document.querySelectorAll("input[name='chatopened']").forEach(ele => {
                        ele.addEventListener('change', function () {
                            selectedchatid = ele.id
                            updatechatbox(ele.id)
                        })
                    })
                    if(urlparams.has("id")) {
                        selectedchatid = urlparams.get("id")
                    }
                    setInterval(function () {
                        updatechatbox(selectedchatid)
                    }, 250)
                } else {
                    document.getElementById('textbox').remove()
                    document.getElementById('sentbtn').remove()
                }
                document.getElementById("leftside").style.height = window.innerHeight + "px"
                setTimeout(function () {
                    document.getElementById("ting").scrollTo(0,document.getElementById("ting").scrollHeight)
                },100)
        })
        .catch(error => console.log('error', error));
}
updateChats()
socket.on("connect", () => {
    if(localStorage.getItem("token") != null) {
        setInterval(function () {
            if(selectedchatid !== null) {
                if(document.hasFocus()) {
                    socket.emit("messenger-ping", localStorage.getItem("token"),selectedchatid,lasttimeityped)
                }
            }
        },100)
    }
})
function newPersonOnline(data) {
    var cango = true
    peopleonline.forEach(data1 => {
        if(data.uid == data1.uid) {
            cango = false
        }
    })
    if(cango) {
        peopleonline.push(data)
        var personele = document.createElement("img")
        personele.height = "24"
        personele.width = "24"
        personele.setAttribute("uid", data.uid)
        personele.setAttribute("typing", "false")
        personele.src = "/api/media/pfp/" + data.uid
        document.querySelector(".onlineusers").append(personele)
    }


}
function removePersonOnline(uid) {
    var parentDiv = document.querySelector(".onlineusers")
    for (let i = 0; i < parentDiv.children.length; i++) {
        const child = parentDiv.children[i];
        if(child.getAttribute("uid") == uid) {
            child.remove()
        }
    }
}
function resetOnlinePeople() {
    document.querySelector(".onlineusers").innerHTML = ""
    peopleonline.forEach(online => {
        if(online.chatid == selectedchatid) {
            newPersonOnline(online)
        }
    })
}
socket.on("messenger-ping",(uid,chat,lasttimetyped) => {
    var updated = false
    var data = {
        uid,
        chatid:chat,
        aretyping:Date.now() - lasttimetyped < 2000,
        lastupdate:Date.now()
    }
    peopleonline.forEach(online => {
        if(online.uid == data.uid) {
            online.chatid = chat
            online.aretyping = Date.now() - lasttimetyped < 2000
            online.lastupdate = Date.now()
            updated = true
        }
    })
    if(!updated) {
        peopleonline.push(data)
        if(selectedchatid == data.chatid) {
            newPersonOnline(data)
        }
    }
})
setInterval(() => {
    peopleonline.forEach(online => {
        if(Date.now() - online.lastupdate > 2000) {
            peopleonline.splice(peopleonline[online],1)
            if(selectedchatid == online.chatid) {
                removePersonOnline(online.uid)
            }
        }
        var parentDiv = document.querySelector(".onlineusers")
        for (let i = 0; i < parentDiv.children.length; i++) {
            const child = parentDiv.children[i];
            if(child.getAttribute("uid") == online.uid) {
                child.setAttribute("typing",online.aretyping ? "true":"false")
            }
        }
        if(selectedchatid == online.chatid) {
            var parentDiv = document.querySelector(".onlineusers")
            for (let i = 0; i < parentDiv.children.length; i++) {
                const child = parentDiv.children[i];
                if(child.getAttribute("uid") == online.uid) {
                    if(child.getAttribute("typing") == "true") {
                        child.style.animation = "typing 2s ease-in-out infinite"
                    } else {
                        child.style.animation = "none"
                    }
                }
            }
        }
    })
},50)