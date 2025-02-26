const userCardTemplate = document.querySelector("[data-user-template]")
const userCardContainer = document.querySelector("[data-user-cards-container]")
const searchInput = document.getElementById("search")

let users = []

searchInput.addEventListener("input", e => {
    const value = e.target.value
    users.forEach(user => {
        const isVisible =
            user.username.toLowerCase().includes(value.toLowerCase()) ||
            user.displayname.toLowerCase().includes(value.toLowerCase()) ||
            user.uid.startsWith(value)
        user.element.classList.toggle("hide", !isVisible)
    })
})

var myHeaders = new Headers();
myHeaders.append("token", localStorage.getItem("token"));


var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

fetch("/api/db/getallusers", requestOptions)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        users = data.map(user => {
            const card = userCardTemplate.content.cloneNode(true).children[0]
            const displayname = card.querySelector("[data-displayname]")
            const username = card.querySelector("[data-username]")
            const pfp = card.querySelector("[data-pfp]")
            const badges = card.querySelector("[data-badges]")
            const editbtn = card.querySelector("[data-editbtn]")
            displayname.textContent = user.displayname
            username.textContent = "@" + user.username
            pfp.src = "/api/media/pfp/" + user.uid
            editbtn.href = "/admin/profiles/" + user.uid
            user.badges.forEach(badge => {
                var badgeimg = document.createElement("img")
                badgeimg.src = "/api/media/badges/" + badge + ".png"
                badgeimg.style.height = "24px"
                badgeimg.style.marginRight = "4px"
                badges.append(badgeimg)
            })
            userCardContainer.append(card)
            return { displayname: user.displayname, username: user.username, uid:user.uid, element: card }
        })
    })