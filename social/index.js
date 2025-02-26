var myHeaders = new Headers();

var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};
fetch("/api/getfeed", requestOptions)
    .then(response => response.json())
    .then(async result => {
        for (const post of result) {
            await generatePost(document.getElementById("feed"), post.poster + "." + post.id, false, true)
        }
    })
    .catch(error => console.log('error', error));