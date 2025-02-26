function save() {
    var details = {
        token:localStorage.getItem("token"),
        username:document.getElementById("username").value.toLowerCase(),
        displayname:document.getElementById("displayname").value,
        bio:document.getElementById("bio").value
    }
    console.log(details)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", localStorage.getItem("token"));

    var raw = JSON.stringify({
        "username":details.username,
        "displayname":details.displayname,
        "bio": details.bio
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("/api/editprofile", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}


fetch("/api/user/" + localStorage.getItem("token").split(".")[0]).then(res => res.json()).then(res => {
    document.getElementById("pfp").src = document.getElementById("pfp").src.replaceAll("[uid]",res.uid)
    if(res.privileges.includes("account.public.edit")) {
        document.getElementById("displayname").value = res.displayname
        document.getElementById("displayname").onchange = save
        document.getElementById("username").value = res.username
        document.getElementById("username").onchange = save
        document.getElementById("bio").value = res.bio
        document.getElementById("bio").onchange = save
    } else {
        document.getElementById("displayname").disabled = true
        document.getElementById("username").disabled = true
        document.getElementById("bio").disabled = true

    }


    console.log(res)
})