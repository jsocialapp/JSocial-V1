var myHeaders = new Headers();
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
myHeaders.append("query", urlParams.get('query'));
var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};
const userCardTemplate = document.querySelector("[data-user-template]")
const userCardContainer = document.querySelector("[data-user-cards-container]")
fetch("/api/search", requestOptions)
    .then(response => response.json())
    .then(result => {
        result.forEach(user =>{
            const card = userCardTemplate.content.cloneNode(true).children[0]
            const displayname = card.querySelector("[data-displayname]")
            const username = card.querySelector("[data-username]")
            const pfp = card.querySelector("[data-pfp]")
            const badges = card.querySelector("[data-badges]")
            const editbtn = card.querySelector("[data-visitbtn]")
            displayname.textContent = user.displayname
            username.textContent = "@" + user.username
            pfp.src = "/api/media/pfp/" + user.uid
            editbtn.href = "/user/" + user.url
            user.badges.forEach(badge => {
                var badgeimg = document.createElement("img")
                badgeimg.src = "/api/media/badges/" + badge + ".png"
                badgeimg.style.height = "24px"
                badgeimg.style.marginRight = "4px"
                badges.append(badgeimg)
            })
            userCardContainer.append(card)
        })
    })
    .catch(error => console.log('error', error));