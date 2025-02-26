if(localStorage.getItem("token")) {
    location.pathname = "/app"
}
function attemptlogin() {
    var details = {
        username:document.getElementById("username").value.toLowerCase(),
        password:document.getElementById("password").value,
    }

    var failed = false
    if(details.username.length < 1) {
        failed = true;
        document.getElementById("error").innerText = "Please enter your username"
        setTimeout(() => {
            document.getElementById("error").innerText = ""
        },5000)

    }
    if(details.password.length < 1) {
        failed = true;
        document.getElementById("error").innerText = "Please enter your password"
        setTimeout(() => {
            document.getElementById("error").innerText = ""
        },5000)
    }
    if(!failed) {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`/api/uid/${details.username}`, requestOptions)
            .then(response => response.text())
            .then(result1 => {
                var requestOptions = {
                    method: 'GET',
                    redirect: 'follow'
                };

                fetch(`/api/token/${result1}/${details.password}`, requestOptions)
                    .then(response => response.text())
                    .then(result => {
                        var requestOptions = {
                            method: 'GET',
                            redirect: 'follow'
                        };

                        fetch(`/api/user/${result1}`, requestOptions)
                            .then(response => response.text())
                            .then(user => {
                                if(result !== "Unable to find account") {
                                    localStorage.setItem("token", result)
                                    location.pathname = "/app"
                                } else {
                                    document.getElementById("error").innerText = "Incorrect username or password"
                                    setTimeout(() => {
                                        document.getElementById("error").innerText = ""
                                    },5000)
                                }

                            })
                            .catch(error => console.log('error', error));

                    })
                    .catch(error => console.log('error', error));
            })
            .catch(error => console.log('error', error));
    }
}