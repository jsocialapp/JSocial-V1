fetch("/api/user/" + localStorage.getItem("token").split(".")[0]).then(res => res.json()).then(res => {
    document.querySelector("form").action = document.querySelector("form").action.replaceAll("[uid]",localStorage.getItem("token"))
    console.log(res)
})