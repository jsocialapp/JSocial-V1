// document.getElementById("coverpage").remove()
var startTime = Date.now()
var fstartTime = Date.now()
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};
        fetch("/api/userfromurl/" + location.pathname.split("/")[2], requestOptions)
            .then(response => response.json())
            .then(async theUserTemplate => {
                var theUserUID = theUserTemplate.uid
                console.info("Requested data in " + String(Date.now()-startTime) + "ms")

                startTime = Date.now()

                var theUser = {
                    "uid": theUserTemplate.uid,
                    "username": theUserTemplate.username,
                    "displayname": theUserTemplate.displayname,
                    "url": theUserTemplate.url,
                    "country": theUserTemplate.country,
                    "followers": theUserTemplate.followers,
                    "following-count": theUserTemplate["following-count"],
                    "bio": theUserTemplate.bio,
                    "privileges": theUserTemplate.privileges,
                    "privacy-settings": {
                        "comment": "everyone || friends || followers || only-me",
                        "message": theUserTemplate["privacy-settings"].message,
                        "following": theUserTemplate["privacy-settings"].following
                    },
                    "badges": theUserTemplate.badges,
                    "email-verified": theUserTemplate["email-verified"],
                    "posts": theUserTemplate.posts,
                    "banned": {
                        "value": theUserTemplate.banned.value,
                        "reason": theUserTemplate.banned.reason,
                        "startDate": theUserTemplate.banned.startDate,
                        "endDate": theUserTemplate.banned.endDate
                    }
                }
                if (!theUser.banned.value) {
                    document.querySelector("div[main]").style.display = "flex"
                    if (theUserTemplate.website) {
                        theUser.website = theUserTemplate.website
                    }
                    document.getElementById("displayname").innerText = document.getElementById("displayname").innerText.replace("[displayName]", theUser.displayname)
                    if (theUser.country !== "BOT") {
                        var countryFlag = document.createElement("img")
                        countryFlag.src = `/api/media/flags/${theUser.country.toUpperCase()}.svg`
                        countryFlag.style.height = "18px"
                        countryFlag.style.marginBottom = "8px"
                        countryFlag.style.marginLeft = "2px"
                        document.getElementById("displayname").appendChild(countryFlag)
                    }
                    document.getElementById("handle").innerText = document.getElementById("handle").innerText.replace("[handle]", theUser.username)
                    document.getElementById("bio").innerText = document.getElementById("bio").innerText.replace("[bio]", theUser.bio)
                    if (theUserTemplate.website) {
                        document.getElementById("website").innerText = theUser.website["link-display"]
                        document.getElementById("website").href = theUser.website.link
                    } else {
                        document.getElementById("website").remove()
                    }

                    document.getElementById("followers").innerText = theUser.followers.length + " Followers"
                    if (localStorage.getItem("token")) {
                        if (theUser.followers.includes(localStorage.getItem("token").split(".")[0])) {
                            document.getElementById("follow-btn").className = "btn btn-danger mb-2"
                            document.getElementById("follow-btn").innerText = "Following"
                        }
                    }
                    document.getElementById("follow-btn").onclick = function () {
                        var myHeaders = new Headers();
                        myHeaders.append("token", localStorage.getItem("token"));

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            redirect: 'follow'
                        };
                        fetch("/api/followuser/" + theUser.uid, requestOptions)
                            .then(response => response.text())
                            .then(result => {
                                location.reload()
                            })
                            .catch(error => console.log('error', error));
                    }
                    document.getElementById("following").innerText = theUser["following-count"] + " Following"
                    document.getElementById("pfp").src = document.getElementById("pfp").src.replace("[uid]", theUser.uid)
                    theUser.badges.forEach(badge => {
                        var badgeimg = document.createElement("img")
                        badgeimg.src = `/api/media/badges/${badge}.png`
                        badgeimg.style.height = "24px"
                        badgeimg.style.marginRight = "4px"
                        document.getElementById("badges").append(badgeimg)
                    })
                    if(!theUser.badges.includes("bot")) {
                        setInterval(() => {
                            fetch("/api/user/" + theUser.uid).then(res => res.json()).then(userresult => {
                                var deltams = Date.now() - userresult.lastonline
                                var lastonline = "Has not been online in a while"
                                if(deltams < 30000) {
                                    lastonline = "Online now"
                                } else if(deltams < 60000) {
                                    lastonline = "Last online 1 second ago"
                                } else if(deltams < (60 * 60000)) {
                                    lastonline = `Last online ${Math.floor(deltams / 60000)} minute${deltams / (60000) > 1 ? "s" : ""} ago`
                                } else if(deltams < (24 * 60 * 60000)) {
                                    lastonline = `Last online ${Math.floor(deltams / (60 * 60000))} hour${deltams / (60 * 60000) > 1 ? "s" : ""} ago`
                                } else if(deltams < (365 * 24 * 60 * 60000)) {
                                    lastonline = `Last online ${Math.floor(deltams / (24 * 60 * 60000))} day${deltams / (24 * 60 * 60000) > 1 ? "s" : ""} ago`
                                } else if(deltams < (9000000000000 * 365 * 24 * 60 * 60000)) {
                                    lastonline = `Last online ${Math.floor(deltams / (365 * 24 * 60 * 60000))} year${deltams / (365 * 24 * 60 * 60000) > 1 ? "s" : ""} ago`
                                }
                                document.getElementById("lastonline").innerText = lastonline
                            })
                        },500)
                    }
                    if(theUserTemplate.csa) {
                        var badgeimg = document.createElement("img")
                        badgeimg.addEventListener('click', (e) => {
                            window.open("http://justwhatever.net:100/player/" + theUserTemplate.csa.pid)
                        })
                        badgeimg.src = `/api/media/badges/csa.png`
                        badgeimg.style.height = "24px"
                        badgeimg.style.borderRadius = "500px"
                        badgeimg.style.marginRight = "4px"
                        document.getElementById("badges").append(badgeimg)
                    }
                    if (theUserTemplate.custom) {
                        if (theUserTemplate.custom.badge) {
                            var badgeimg = document.createElement("img")
                            badgeimg.src = theUserTemplate.custom.badge.src
                            badgeimg.style.width = "100%"
                            badgeimg.className = "mb-2"
                            document.getElementById("userBody").prepend(badgeimg)
                        }
                    }
                    if (localStorage.getItem("token") !== null) {
                        var requestOptions = {
                            method: 'GET',
                            redirect: 'follow'
                        };
                        fetch("/api/user/" + localStorage.getItem("token").split(".")[0], requestOptions)
                            .then(response => response.text())
                            .then(selfUserSTR => {
                                var selfUser = JSON.parse(selfUserSTR)
                                if (selfUser.uid === theUser.uid) {
                                    document.getElementById("not-me-buttons").style.display = "none"
                                    document.getElementById("me-buttons").style.display = "block"
                                } else {
                                    document.getElementById("not-me-buttons").style.display = "block"
                                    document.getElementById("me-buttons").style.display = "none"
                                }
                            })
                            .catch(error => console.error('error', error));
                    } else {
                        document.getElementById("not-me-buttons").style.display = "block"
                        document.getElementById("me-buttons").style.display = "none"
                    }

                    console.info("Loaded elements in " + String(Date.now()-startTime) + "ms")
                    document.getElementById("coverpage").remove()
                    document.body.style.overflow = "auto"
                    for (const post of theUser.posts) {
                        await generatePost(document.getElementById("posts"), theUser.uid + "." + post.id, theUser,false)
                    }
                    if (localStorage.getItem("token")) {
                        if (localStorage.getItem("token").split(".")[0] === theUser.uid && theUser.privileges.includes("post.create")) {
                            var postboxele = document.createElement("div")
                            postboxele.className = "card mb-2"
                            postboxele.style.maxWidth = "32rem"
                            postboxele.style.minWidth = "24rem"
                            postboxele.style.marginLeft = "2rem"
                            postboxele.innerHTML = `<div class="card-body">
            <h6 class="card-title" postname><img src="/api/media/pfp/" pfp height="24px" style="border-radius: 15px; margin-right: .25rem;" >[DISPLAYNAME]</h6>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="title" placeholder="Your title">
                <label for="title">Title</label>
            </div>
            <div class="form-floating">
                <textarea class="form-control" placeholder="The content of your post" id="content" style="height: 12rem"></textarea>
                <label for="content">Body</label>
            </div>
            <button postbtn class="btn btn-primary mt-2" style="width: 100%">Post</button>`
                            postboxele.querySelector("h6[postname]").innerHTML = postboxele.querySelector("h6[postname]").innerHTML.replaceAll("[DISPLAYNAME]", theUser.displayname)
                            postboxele.querySelector("img[pfp]").src = `/api/media/pfp/${theUser.uid}`
                            postboxele.querySelector("button[postbtn]").onclick = function () {
                                var myHeaders = new Headers();
                                myHeaders.append("Content-Type", "application/json");
                                myHeaders.append("token", localStorage.getItem("token"));

                                var raw = JSON.stringify({
                                    "title": postboxele.querySelector("#title").value,
                                    "content": postboxele.querySelector("#content").value
                                });

                                var requestOptions = {
                                    method: 'POST',
                                    headers: myHeaders,
                                    body: raw,
                                    redirect: 'follow'
                                };

                                fetch(`/user/${theUser.url}/post`, requestOptions)
                                    .then(response => response.text())
                                    .then(result => {
                                        if (result === "Done") {
                                            location.reload()
                                        }
                                    })
                                    .catch(error => console.error('error', error));
                            }
                            document.getElementById("posts").prepend(postboxele)
                        }
                    }
                } else {
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


                    function updateTime() {
                        var thetimetillfinish = calculateTimeInObject(new Date(theUser.banned.endDate).getTime() - Date.now())
                        if (Date.now() > new Date(theUser.banned.endDate).getTime()) {
                            location.reload()
                        }
                        // console.log(years + " year" + (years !== 1 ? "s" : "") + " " + months + " month" + (months !== 1 ? "s" : "") + " " + days + " day" + (days !== 1 ? "s" : "") + " " + hours + " hour" + (hours !== 1 ? "s" : "") + " " + minutes + " minute" + (minutes !== 1 ? "s" : "") + " " + seconds + " second" + (seconds !== 1 ? "s" : ""))
                        document.querySelector("div[main]").innerHTML = `<h1>User banned</h1>
    <h2>${theUser.banned.reason}</h2>
    <h5>${thetimetillfinish.years} years ${thetimetillfinish.months} months ${thetimetillfinish.days} days ${thetimetillfinish.hours} hours ${thetimetillfinish.minutes} minutes ${thetimetillfinish.seconds} seconds</h5>`
                    }
                    document.getElementById("coverpage").remove()
                    setInterval(updateTime, 500)
                }
                console.info("Loaded website in " + String(Date.now()-fstartTime) + "ms")
            })
            .catch(error => console.error('error', error));
