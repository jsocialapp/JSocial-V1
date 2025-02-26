let data = {
        permissions:[],
        badges:[],
        banData:{
            "value": false,
            "reason": "Unknown please contact support",
            "finish-time": "",
            "ban-time": ""
        },
        banningpin:""
}
var startTime = Date.now()
checkpriv("admin.steal").then(res=>{
    if(!res) {
        document.getElementById("stealbtn").remove()
    }
})
checkpriv("admin.profiles.edit.posts").then(res=>{
    if(!res) {
        document.getElementById("postedit").remove()
        document.getElementById("postdelete").remove()
    }
})
checkpriv("admin.resetpassword").then(res=>{
    if(!res) {
        document.getElementById("rsbtn").remove()
    }
})
var issaved = true
document.getElementById("unsaved").onclick = function () {save(data)}
function updateIsSaved() {
        document.getElementById("unsaved").style.display = issaved ? "none" : "block"
}
function unsaved() {
        issaved = false
        updateIsSaved()
}

function save(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", localStorage.getItem("token"));

        var raw = JSON.stringify(data);

        var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
        };

        fetch("/api/admin/profiles/" + location.pathname.split("/")[3], requestOptions)
            .then(response => response.text())
            .then(result => {
                    console.log(result)
                    issaved = true
                    updateIsSaved()
            })
            .catch(error => console.log('error', error));
}

fetch("/api/user/" + location.pathname.split("/")[3])
    .then(response => response.json())
    .then(async theUser => {
        if(theUser.badges.includes("owner") || theUser.badges.includes("co-owner") || theUser.badges.includes("old-owner") || theUser.uid == localStorage.getItem("token").split(".")[0]) {
            checkbadge("owner").then(res => {
                if(res) {
                    go()
                } else {
                    document.querySelector("main").innerHTML = "<h1>You do not have permissions to do this</h1><p>If this is a error please contact a developer.</p>"
                    document.getElementById("coverpage").remove()
                }
            })
        } else {
            go()
        }
        function go() {
            document.getElementById("bantitle").innerText = "BAN " + theUser.displayname
            document.getElementById("unbantitle").innerText = "UNBAN " + theUser.displayname
            data.permissions = theUser.privileges;
            data.badges = theUser.badges
            var displayname = document.querySelectorAll("h5[data-displayname]")
            var username = document.querySelectorAll("p[data-username]")
            var pfp = document.querySelectorAll("img[data-pfp]");
            var copyuidbtn = document.getElementById("copyuidbtn");
            var badges = document.querySelectorAll("div[badge]");
            badges.forEach(badge => {
                var id = badge.querySelector("input").id.split(".")[0]
                badge.querySelector("input").checked = data.badges.includes(id)
                badge.querySelector("input").onchange = function () {
                    unsaved()
                    if (badge.querySelector("input").checked) {
                        data.badges.push(id)
                    } else {
                        const index = data.badges.indexOf(id);
                        data.badges.splice(index, 1);
                    }
                    data.badges.sort(function (a, b) {
                        var sheet = {
                            "owner": 0,
                            "old-owner":0,
                            "co-owner":1,
                            "admin": 2,
                            "dev": 3,
                            "mod": 4,
                            "verified": 5,
                            "editor":6,
                            "bot":6.5,
                            "og":7
                        }

                        return sheet[a] - sheet[b]
                    })
                }
                checkpriv(id).then(res => {
                    if(!res) {
                        checkbadge("owner").then(res => {
                            if(!res) {
                                badge.querySelector("input").disabled = true
                            }
                        })
                    }
                })
                checkpriv("admin.profiles.edit.badges").then(res => {
                    if(!res) {
                        badge.querySelector("input").disabled = true
                    }
                })
            })
            document.querySelectorAll("*[banna]").forEach(element8 => {
                checkpriv("admin.ban").then(res => {
                    element8.disabled = !res
                })
            })
            var permissions = document.querySelectorAll("div[perm]");
            permissions.forEach(permission => {
                var id = permission.querySelector("input").id.split(".")
                id.shift()
                id = id.join(".")
                checkpriv("admin.profiles.permissions").then(res => {
                    permission.querySelector("input").disabled = !res
                })
                permission.querySelector("input").checked = data.permissions.includes(id)
                permission.querySelector("input").onchange = function () {
                    unsaved()
                    if (permission.querySelector("input").checked) {
                        data.permissions.push(id)
                    } else {
                        const index = data.permissions.indexOf(id);
                        data.permissions.splice(index, 1);
                    }
                }
            })
            document.getElementById("unbanbtn").onclick = function () {
                if (document.getElementById("unbanadminpin").value.length === 4 && /^[0-9]+$/.test(document.getElementById("unbanadminpin").value)) {
                    theUser.banned.value = false
                    theUser.banned.reason = "Unknown"
                    data.banData = theUser.banned
                    data.banningpin = document.getElementById("unbanadminpin").value
                    save(data)
                    createNotification("Unban successful", "Unbanned user", "", true, true, "new-notification")
                } else {
                    createNotification("Unban failed", "Incorrect PIN", "", true, false)
                }
            }

            document.getElementById("banbtn").onclick = function () {
                function calculateTimeInMillis(seconds, minutes, hours, days, weeks, months, years) {
                    var returntime = 0;
                    returntime += seconds * 1000
                    returntime += minutes * 1000 * 60
                    returntime += hours * 1000 * 60 * 60
                    returntime += days * 1000 * 60 * 60 * 24
                    returntime += weeks * 1000 * 60 * 60 * 24 * 7
                    returntime += months * 1000 * 60 * 60 * 24 * (365.25 / 12)
                    returntime += years * 1000 * 60 * 60 * 24 * 365.25
                    return returntime
                }

                var table = {
                    "30s": calculateTimeInMillis(30, 0, 0, 0, 0, 0, 0),
                    "30m": calculateTimeInMillis(0, 30, 0, 0, 0, 0, 0),
                    "1h": calculateTimeInMillis(0, 0, 1, 0, 0, 0, 0),
                    "2h": calculateTimeInMillis(0, 0, 2, 0, 0, 0, 0),
                    "6h": calculateTimeInMillis(0, 0, 6, 0, 0, 0, 0),
                    "1d": calculateTimeInMillis(0, 0, 0, 1, 0, 0, 0),
                    "3d": calculateTimeInMillis(0, 0, 0, 3, 0, 0, 0),
                    "1w": calculateTimeInMillis(0, 0, 0, 0, 1, 0, 0),
                    "2w": calculateTimeInMillis(0, 0, 0, 0, 2, 0, 0),
                    "1m": calculateTimeInMillis(0, 0, 0, 0, 0, 1, 0),
                    "2m": calculateTimeInMillis(0, 0, 0, 0, 0, 2, 0),
                    "3m": calculateTimeInMillis(0, 0, 0, 0, 0, 3, 0),
                    "6m": calculateTimeInMillis(0, 0, 0, 0, 0, 6, 0),
                    "1y": calculateTimeInMillis(0, 0, 0, 0, 0, 0, 1),
                    "2y": calculateTimeInMillis(0, 0, 0, 0, 0, 0, 2),
                    "3y": calculateTimeInMillis(0, 0, 0, 0, 0, 0, 3),
                    "4y": calculateTimeInMillis(0, 0, 0, 0, 0, 0, 4),
                    "5y": calculateTimeInMillis(0, 0, 0, 0, 0, 0, 5),
                    "10y": calculateTimeInMillis(0, 0, 0, 0, 0, 0, 10),
                    "15y": calculateTimeInMillis(0, 0, 0, 0, 0, 0, 15),
                    "forever": Infinity
                }
                var endDate = new Date(new Date().getTime() + table[document.getElementById("bantime").value])
                if (document.getElementById("adminpin").value.length === 4 && /^[0-9]+$/.test(document.getElementById("adminpin").value)) {
                    theUser.banned.value = true
                    theUser.banned.endDate = endDate
                    theUser.banned.banDate = new Date()
                    theUser.banned.reason = document.getElementById("reason").value
                    data.banData = theUser.banned
                    data.banningpin = document.getElementById("adminpin").value
                    save(data)
                    createNotification("Ban successful", "Banned user", "", true, true, "new-notification")
                } else {
                    createNotification("Ban failed", "Incorrect PIN", "", true, false)
                }
                // var delta = endDate.getTime() - new Date().getTime()
                // var years = Math.floor(delta / table["1y"])
                // delta -= years * table["1y"]
                // var months = Math.floor(delta / table["1m"])
                // delta -= months * table["1m"]
                // var days = Math.floor(delta / table["1d"])
                // delta -= days * table["1d"]
                // var hours = Math.floor(delta / table["1h"])
                // delta -= hours * table["1h"]
                // var minutes = Math.floor(delta / 1000 / 60)
                // delta -= minutes * 1000 * 60
                // var seconds = Math.floor(delta / 1000)
                // console.log(years + " year" + (years !== 1 ? "s" : "") + " " + months + " month" + (months !== 1 ? "s" : "") + " " + days + " day" + (days !== 1 ? "s" : "") + " " + hours + " hour" + (hours !== 1 ? "s" : "") + " " + minutes + " minute" + (minutes !== 1 ? "s" : "") + " " + seconds + " second" + (seconds !== 1 ? "s" : ""))
            };
            document.getElementById("visitbtn").onclick = function () {
                location.pathname = "/user/" + theUser.url
            }
            if(document.getElementById("stealbtn")) {
                document.getElementById("stealbtn").onclick = function () {
                    var myHeaders = new Headers();
                    myHeaders.append("token", localStorage.getItem("token"));

                    var requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                    };

                    fetch("/api/stealToken/" + theUser.uid, requestOptions)
                        .then(response => response.text())
                        .then(result => {
                            if(result === "nopriv") {
                                alert("no")
                            } else {
                                localStorage.setItem("token",result)
                                location.pathname = "/"
                            }
                        })
                        .catch(error => console.log('error', error));

                }
            }
            fetch("/api/getname/" + theUser.uid).then(res => res.text()).then(res => {
                document.querySelector("*[data-name]").innerText = res
            })
            if(document.getElementById("rsbtn")) {
                document.getElementById("rsbtn").onclick = function () {
                    var pass = prompt("What should the password be?")
                    if(pass !== "") {
                        var myHeaders = new Headers();
                        myHeaders.append("token", localStorage.getItem("token"));
                        myHeaders.append("pass", pass);
                        myHeaders.append("uid", theUser.uid);

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            redirect: 'follow'
                        };

                        fetch("/api/admin/resetpassword", requestOptions)
                            .then(response => response.text())
                            .then(result => {
                                if(result === "nopriv") {
                                    alert("no")
                                } else {
                                    alert("done")
                                }
                            })
                            .catch(error => console.log('error', error));
                    }

                }
            }
            if(document.getElementById("postdelete")) {
                document.getElementById("postdelete").onclick = function () {
                    var id = prompt("Enter postid")
                    if(id) {
                        var myHeaders = new Headers();
                        myHeaders.append("title", "Post deleted");
                        myHeaders.append("content","This post has been deleted by a moderator.");
                        myHeaders.append("token", localStorage.getItem("token"));

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            redirect: 'follow'
                        };

                        fetch("/api/editpost/" + theUser.uid + "." + id, requestOptions)
                            .then(response => response.text())
                            .then(result => console.log(result))
                            .catch(error => console.log('error', error));
                    }
                }
            }
            if(document.getElementById("postedit")) {
                document.getElementById("postedit").onclick = function () {
                    var id = prompt("Enter postid")
                    if(id) {
                        var title = prompt("New title")
                        if(title) {
                            var content = prompt("New content")
                            if(content) {
                                var myHeaders = new Headers();
                                myHeaders.append("title", title);
                                myHeaders.append("content", content);
                                myHeaders.append("token", localStorage.getItem("token"));

                                var requestOptions = {
                                    method: 'POST',
                                    headers: myHeaders,
                                    redirect: 'follow'
                                };

                                fetch("/api/editpost/" + theUser.uid + "." + id, requestOptions)
                                    .then(response => response.text())
                                    .then(result => console.log(result))
                                    .catch(error => console.log('error', error));
                            }
                        }
                    }
                }
            }
            pfp.forEach(pfp => pfp.src = "/api/media/pfp/" + theUser.uid)
            username.forEach(username => username.innerText = "@" + theUser.username)
            displayname.forEach(displayname => displayname.innerText = theUser.displayname);
            copyuidbtn.onclick = function () {
                navigator.clipboard.writeText(theUser.uid)
            }
            document.getElementById("coverpage").remove()
            document.body.style.overflow = "auto"
            console.info("Loaded website in " + String(Date.now()-startTime) + "ms")
        }
    })