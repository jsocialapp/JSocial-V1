function attemptlogin() {
    var details = {
        username:document.getElementById("username").value.toLowerCase(),
        password:document.getElementById("password").value,
    }

    var failed = false
    if(details.username.length < 1) {
        failed = true;
        createNotification("Error logging into account", "Please enter your username", "", true, false, [])
    }
    if(details.password.length < 1) {
        failed = true;
        createNotification("Error logging into account", "Please enter your password", "", true, false, [])
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
                                    location.pathname = "/user/" + JSON.parse(user).url
                                } else {
                                    createNotification("Unable to login", "Incorrect username or password", "",true, false, "")
                                }

                            })
                            .catch(error => console.log('error', error));

                    })
                    .catch(error => console.log('error', error));
            })
            .catch(error => console.log('error', error));
    }
}