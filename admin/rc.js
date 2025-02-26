var cwd = "/"
setInterval(function () {
    document.getElementById("txtbox").style.width = `calc(100% - ${document.querySelector(".input span").getBoundingClientRect().right}px)`
},50)
function scrollEvent() {
    document.getElementById("theresponce").scrollTo(0,document.getElementById("theresponce").scrollHeight)
}
document.getElementById("theresponce").innerText = "Welcome to JSocial SuperAdmin Remote Console.\n"
document.getElementById("txtbox").addEventListener("keyup", (e) => {
    if(e.key === "Enter") {
        var thevalue = document.getElementById("txtbox").value
        document.getElementById("txtbox").value = ""
        if(thevalue == "cd ..") {
            var myHeaders = new Headers();
            myHeaders.append("cwd", cwd);
            myHeaders.append("key", localStorage.getItem("key"));

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("/api/getparent", requestOptions)
                .then(response => response.text())
                .then(result => {cwd=result;scrollEvent()})
                .catch(error => console.log('error', error));
            return
        }
        if(thevalue.split(" ")[0] == "cd") {
            var myHeaders = new Headers();
            myHeaders.append("cwd", cwd);
            myHeaders.append("key", localStorage.getItem("key"));

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("/api/getdir", requestOptions)
                .then(response => response.json())
                .then(result => {
                    var validnames = []
                    result.children.forEach(child => {
                        if(child.type == "directory") {
                            validnames.push(child.name)
                        }
                    })
                    var thestuff = thevalue.split(" ")
                    thestuff.splice(0,1)
                    if(validnames.includes(thestuff.join(" "))) {
                        cwd = cwd + thestuff.join(" ") + "/";scrollEvent()
                    } else {
                        var myHeaders = new Headers();
                        myHeaders.append("cwd", thestuff.join(" "));
                        myHeaders.append("key", localStorage.getItem("key"));

                        var requestOptions = {
                            method: 'GET',
                            headers: myHeaders,
                            redirect: 'follow'
                        };

                        fetch("/api/exist", requestOptions)
                            .then(response => response.text())
                            .then(result => {
                                if(result == "true") {
                                    cwd = thestuff.join(" ");scrollEvent()
                                }
                                if(result == "false") {
                                    document.getElementById("theresponce").innerText = document.getElementById("theresponce").innerText + "\n" + "This directory does not exist"``;scrollEvent()
                                }
                            })
                            .catch(error => console.log('error', error));
                    }
                })
                .catch(error => console.log('error', error));
        }
            var myHeaders = new Headers();
            myHeaders.append("cmd", thevalue);
            myHeaders.append("cwd", cwd);
            myHeaders.append("key", localStorage.getItem("key"));

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("/api/remoteconsole", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if(result.stdout) {
                        document.getElementById("theresponce").innerText = document.getElementById("theresponce").innerText + "\n" + result.stdout.split("[32m").join("").split("[37m").join("").split("[31m").join("").split("[35m").join("").split("[33m").join("").split("[39m").join("").split("[90m").join("")
                        console.log(result.stdout);scrollEvent()
                    } else if(result.stderr) {
                        document.getElementById("theresponce").innerText = document.getElementById("theresponce").innerText + "\n" + result.stderr
                        console.error(result.stderr);scrollEvent()
                    }
                })
                .catch(error => console.log('error', error));
    }
})
setInterval(() => {
    document.getElementById("cwd").innerText = cwd + " >"
    document.getElementById("txtbox").style.width = `calc(100% - ${document.querySelector(".input span").getBoundingClientRect().right}px)`
},100)