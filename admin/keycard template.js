var validstuff = "QWERYIOPASDFGHJKLZXCVBNM1234567890zxcvbnmasdfghjklqwertyuiop".split("")

function createkey(length, list) {
    var returnval = ""
    if(list) {
        var thestuff = true
        while (thestuff) {
            for (let i = 0; i <= length - 1; i++) {
                returnval = returnval + validstuff[Math.floor((Math.random() * validstuff.length) - 1)]
            }
            if(!returnval in list) {
                returnval = ""
            } else {
                thestuff = false
            }
        }
    } else {
        for (let i = 0; i <= length - 1; i++) {
            returnval = returnval + validstuff[Math.floor((Math.random() * validstuff.length) - 1)]
        }
    }
    return returnval
}
/*
    const username = "[NAME]";var pin = prompt("What is your pin");fetch("/api/getKey/" + username + "/" + pin).then(res => res.text()).then(res => {if(res !== "UNKNOWN") {localStorage.setItem("key", res);location.pathname = "/main";};})
*/
function generateKeycard(username) {
    return `javascript:(() => {const username = "${username}";var pin = prompt("What is your pin");fetch("/api/getKey/" + username + "/" + pin).then(res => res.text()).then(res => {if(res !== "UNKNOWN") {localStorage.setItem("key", res);location.pathname = "/main";};})})();`
}