const userCardTemplate = document.querySelector("[data-user-template]")
const userCardContainer = document.querySelector("[data-user-cards-container]")
const searchInput = document.getElementById("search")

let users = []

searchInput.addEventListener("input", e => {
    const value = e.target.value
    users.forEach(user => {
        const isVisible =
            user.name.toLowerCase().includes(value.toLowerCase()) ||
            user.members.includes(value) ||
            user.id.startsWith(value)
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

fetch("/api/db/getallchats", requestOptions)
    .then(res => res.json())
    .then(data => {
        users = data.map(user => {
            const card = userCardTemplate.content.cloneNode(true).children[0]
            const name = card.querySelector("[data-name]")
            const editbtn = card.querySelector("[data-editbtn]")
            name.textContent = user.name
            editbtn.href = "/admin/chats/" + user.id
            userCardContainer.append(card)
            return { name: user.name,id:user.id, element: card, members: user.members}
        })
    })