setInterval(() => {
    var myHeaders = new Headers();
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("/api/activeusers", requestOptions)
        .then(response => response.text())
        .then(result => {
            document.getElementById("activeusers").innerText = "Active users: " + result
        })
        .catch(error => console.log('error', error));
},250)