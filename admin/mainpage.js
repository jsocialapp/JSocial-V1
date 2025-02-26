document.querySelectorAll("*[action]").forEach(ele => {
    console.log(ele)
    ele.onclick = () => {
        console.log("hi")
        var myHeaders = new Headers();
        myHeaders.append("action", ele.getAttribute("action"));
        myHeaders.append("key", "DAeSHOkiCOEGylJVIfmYAHBviduuZOAtvkMf1XWkbundefinedrSh3KEiZK1W14Guwga1g6X");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("/api/status", requestOptions).then(res => res.text()).then(res => {
            console.log(res)
        })
    }
})
fetch("/api/sitemode").then(res => res.text()).then(res => {
    console.log(res)
})