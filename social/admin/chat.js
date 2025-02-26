let data = {

}
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

        fetch("/api/admin/chats/" + location.pathname.split("/")[3], requestOptions)
            .then(response => response.text())
            .then(result => {
                    console.log(result)
                    issaved = true
                    updateIsSaved()
            })
            .catch(error => console.log('error', error));
}
var myHeaders = new Headers();
myHeaders.append("token", "2TG8qru2NePWDOpJcwk1FTwtqBe5wgO8d1YveRSuribARD5LtzFI4KPlNk0u7Yfhv3uzDAIUl4rXh7trXMzRVS8L1m8UsT3EpiOEF6Dyh2SOaDC0DIMN3pGQiHowL8i.7d2d1e6cb2846eb1f05332beee25c9385e1d4a2c719148af240a6bd2ff83cf3f5e9bd5bb4103c33cf401fe552c9706976427afee774ddcd1113aee068394aec3eac4489c4e15881fac133a5d8a7f5a6e5c59d4a7cbfc0fad178b9941f60a7cc72ae7d4c77e8f8849013bb1c0b73c59573ef94c6712ef6a44bb1f96dcdc8d0b60");
fetch("/api/messanger/getchat/" + location.pathname.split("/")[3],{headers:myHeaders})
    .then(response => response.json())
    .then(theUser => {
        var name = document.querySelectorAll("h5[data-name]")
        var copyidbtn = document.getElementById("copyidbtn");
        name.forEach(displayname => displayname.innerText = theUser.name);
        copyidbtn.onclick = function () {
            navigator.clipboard.writeText(theUser.id)
        }
    })