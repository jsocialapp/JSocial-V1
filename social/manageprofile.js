document.getElementById("darkmode").onchange = function () {
    var prefs = JSON.parse(localStorage.getItem("prefs"))
    prefs.darkmode = document.getElementById("darkmode").checked
    localStorage.setItem("prefs", JSON.stringify(prefs))
}
if(localStorage.getItem("prefs")) {
    var prefs = JSON.parse(localStorage.getItem("prefs"))
    document.getElementById("darkmode").checked = prefs.darkmode
}
document.getElementById('audioFile').addEventListener('change', function () {
    const input = document.getElementById('audioFile');
    const audio = document.getElementById('notificationAudio');

    const file = input.files[0];

    if (file) {
        const objectURL = URL.createObjectURL(file);
        audio.src = objectURL;

        try {
            localStorage.setItem('notificationAudio', objectURL);
        } catch (error) {
            console.error('Error saving audio data:', error);
        }
    }
});
document.getElementById("testsound").onclick = function () {
    createNotification("","","",false,true,"")
}
document.getElementById("notifsound").value = JSON.parse(localStorage.getItem("prefs")).notif
if(document.getElementById("notifsound").value == "custom") {
    document.getElementById("uploadContainer").style.display = 'block'
} else {
    document.getElementById("uploadContainer").style.display = 'none'
}
document.getElementById("notifsound").onchange = function () {
    var prefs = JSON.parse(localStorage.getItem("prefs"))
    if(document.getElementById("notifsound").value !== "custom") {
        prefs.notif = document.getElementById("notifsound").value
    } else {
        prefs.notif = document.getElementById("notifsound").value
    }
    localStorage.setItem("prefs", JSON.stringify(prefs))
    if(document.getElementById("notifsound").value == "custom") {
        document.getElementById("uploadContainer").style.display = 'block'
    } else {
        document.getElementById("uploadContainer").style.display = 'none'
    }
}
document.getElementById("submitbtn").onclick = function () {
    var myHeaders = new Headers();
    myHeaders.append("oldpass", document.getElementById("currentpassword").value);
    myHeaders.append("newpass", document.getElementById("newpassword").value);
    myHeaders.append("token", localStorage.getItem("token"));

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("/api/resetpassword", requestOptions)
        .then(response => response.text())
        .then(result => {if(result == "done") {location.reload()}})
        .catch(error => console.log('error', error));
}