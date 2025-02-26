/*
    Project JSocial 2022-2023

    Owned by Gavin Abu-Zahra
    Developed by Gavin Abu-Zahra
    Ideas by Alistair [REDACTED] and Rory [REDACTED]
    Thank you Riley [REDACTED] for carrying me in fortnite
    No thanks to Charlie [REDACTED] for throwing in fortnite
 */

const express  = require("express")
const fs = require("fs")
const path = require("path")
const http = require('http')
const https = require('https')
var cors = require('cors')
const crypto = require('crypto');
const multer = require('multer');
const prompt = require('prompt-sync')()
const nodemailer = require('nodemailer');
const socketio = require('socket.io');
const hidden = require('./hidden');
var activeusers = 0
var privateuserdb1 = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
fs.writeFileSync(path.join(__dirname, "db", "privateuserdb.json"), JSON.stringify(privateuserdb1,null,4))
let backupssinceboot = []
setInterval(() => {
    var now = new Date()
    if(backupssinceboot.length > 0) {
        if(Date.now() - backupssinceboot[backupssinceboot.length-1].time.getTime() > (60 * 60 * 1000)) {
            if(!fs.existsSync(path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`))) {
                fs.mkdirSync(path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`))
            }
            fs.copyFileSync(path.join(__dirname, "db", "adminAccounts.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "adminAccounts.json"))
            fs.copyFileSync(path.join(__dirname, "db", "adminsettings.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "adminsettings.json"))
            fs.copyFileSync(path.join(__dirname, "db", "auditlog.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "auditlog.json"))
            fs.copyFileSync(path.join(__dirname, "db", "chats.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "chats.json"))
            fs.copyFileSync(path.join(__dirname, "db", "encryptionKeys.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "encryptionKeys.json"))
            fs.copyFileSync(path.join(__dirname, "db", "idindex.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "idindex.json"))
            fs.copyFileSync(path.join(__dirname, "db", "japi-store.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "japi-store.json"))
            fs.copyFileSync(path.join(__dirname, "db", "maillist.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "maillist.json"))
            fs.copyFileSync(path.join(__dirname, "db", "mass-mail.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "mass-mail.json"))
            fs.copyFileSync(path.join(__dirname, "db", "pins.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "pins.json"))
            fs.copyFileSync(path.join(__dirname, "db", "privateuserdb.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "privateuserdb.json"))
            fs.copyFileSync(path.join(__dirname, "db", "publicuserdb.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "publicuserdb.json"))
            backupssinceboot.push({
                "time":now,
                "location":path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`)
            })
        }
    } else {
        if(!fs.existsSync(path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`))) {
            fs.mkdirSync(path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`))
        }
        fs.copyFileSync(path.join(__dirname, "db", "adminAccounts.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "adminAccounts.json"))
        fs.copyFileSync(path.join(__dirname, "db", "adminsettings.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "adminsettings.json"))
        fs.copyFileSync(path.join(__dirname, "db", "auditlog.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "auditlog.json"))
        fs.copyFileSync(path.join(__dirname, "db", "chats.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "chats.json"))
        fs.copyFileSync(path.join(__dirname, "db", "encryptionKeys.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "encryptionKeys.json"))
        fs.copyFileSync(path.join(__dirname, "db", "idindex.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "idindex.json"))
        fs.copyFileSync(path.join(__dirname, "db", "japi-store.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "japi-store.json"))
        fs.copyFileSync(path.join(__dirname, "db", "maillist.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "maillist.json"))
        fs.copyFileSync(path.join(__dirname, "db", "mass-mail.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "mass-mail.json"))
        fs.copyFileSync(path.join(__dirname, "db", "pins.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "pins.json"))
        fs.copyFileSync(path.join(__dirname, "db", "privateuserdb.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "privateuserdb.json"))
        fs.copyFileSync(path.join(__dirname, "db", "publicuserdb.json"), path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`, "publicuserdb.json"))
        backupssinceboot.push({
            "time":now,
            "location":path.join(__dirname, "backups", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}.${now.getMinutes()}`)
        })
    }
},1000)
const app = express()
const io = socketio();
function getArrayDifferance(arr1,arr2) {
    var dif = []
    arr1.forEach(ele => {
        if(!arr2.includes(ele)) {
            dif.push(ele)
        }
    })
    arr2.forEach(ele => {
        if(!arr1.includes(ele)) {
            dif.push(ele)
        }
    })
    return dif
}
function getObjectDifference(obj1, obj2) {
    const difference = {};

    for (const key in obj2) {
        if (obj1[key] !== obj2[key]) {
            difference[key] = obj2[key];
        }
    }

    return difference;
}

// const newstransporter = nodemailer.createTransport({
//     host: "smtp.titan.email",
//     port: 465 ,
//     secure: true, // upgrade later with STARTTLS
//     auth: {
//         user: "news@social.justwhatever.net",
//         pass: hidden.password,
//     },
// });

const pfpstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './api/media/pfp')
    },
    filename: function (req, file, cb) {
        cb(null, req.params.token.split(".")[0])
    }
});
const pfpupload = multer({ storage:pfpstorage })
const bannersstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './api/media/mailbanners')
    },
    filename: function (req, file, cb) {
        cb(null, req.params.imgid)
    }
});
const bannersupload = multer({ storage:bannersstorage })
const atachmentstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './api/media/mailbanners')
    },
    filename: function (req, file, cb) {
        cb(null, req.params.token.split(".")[0] + "." + req.params.cid + "-" + req.params.atacid)
    }
});
const atachmentupload = multer({ storage:atachmentstorage })
function detectMob(useragent) {
    if(useragent) {
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];
        return toMatch.some((toMatchItem) => {
            return useragent.match(toMatchItem);
        });
    }

}
console.log("Made by Gavin");
app.use(express.json())
app.use(cors())
app.options('*', cors());
app.use((req,res,next) => {
    if(detectMob(req.headers["user-agent"])) {
        res.status(404).send(createErrorPage("Device error", "This site is not yet supported on this device",true))
    } else {
        next()
    }
})
function atob(key) {
    return Buffer.from(key, 'base64').toString('utf-8');
}
function subdomainlock(subdomain, req) {
    if(subdomain === "jwn"){
        return (req.hostname.split(".")[0] === subdomain || req.hostname.split(".")[0] === "localhost" || req.hostname.split(".")[0] === "social" || req.hostname.split(".")[0] === "www")


    }
    return req.hostname.split(".")[0] === subdomain
}
const validIDchars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'U', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M']

var idIndex = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "idindex.json"), {encoding:"utf-8"}))
function saveIdIndex() {
    fs.writeFileSync(path.join(__dirname, "db", "idindex.json"), JSON.stringify(idIndex), {encoding:"utf-8"})
}
function generateID() {
    var isKeyValid = false
    var validkey = ""
    while (!isKeyValid) {
        var key = []
        for(var i = 0; i < 128; i++) {
            key.push(validIDchars[Math.round(Math.random() * validIDchars.length)])
        }
        key = key.join("")
        if(!idIndex.includes(key)) {
            validkey = key
            isKeyValid = true
        }
    }
    idIndex.push(validkey)
    saveIdIndex()
    return validkey
}
//ENCRYPTION
const encryptionkeys = JSON.parse(atob(fs.readFileSync(path.join(__dirname, "db", "encryptionKeys.json"), {encoding:"utf-8"})))
function generateRandomKey() {
    return crypto.randomBytes(32).toString('hex');
}
function generateRandomToken(id) {
    return id + "." + crypto.randomBytes(128).toString('hex');
}
function generateRandomIV() {
    return crypto.randomBytes(16).toString("hex")
}
function encryptString(text, key, iv) {
    iv = Buffer.from(iv, 'hex'); // Convert the key from hex to a buffer
    key = Buffer.from(key, 'hex'); // Convert the key from hex to a buffer

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + encrypted;
}

function decryptString(encryptedText, key, iv) {
    const encryptedData = encryptedText.slice(32);

    key = Buffer.from(key, 'hex'); // Convert the key from hex to a buffer
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
function createErrorPage(title,desc,nav) {
    if(nav) {
        var erropage = fs.readFileSync(path.join(__dirname, "errors","siteerror.html"),{encoding:"utf-8"})
        erropage = erropage.replaceAll("[title]",title)
        erropage = erropage.replaceAll("[text]",desc)
        return erropage
    } else {
        var erropage = fs.readFileSync(path.join(__dirname, "errors","siteerrornonav.html"),{encoding:"utf-8"})
        erropage = erropage.replaceAll("[title]",title)
        erropage = erropage.replaceAll("[text]",desc)
        return erropage
    }

}

app.use((req,res,next) => {
    if(req.protocol === "http" && req.hostname !== "localhost") {
        res.redirect("https://" + req.hostname+ req.originalUrl)
    }
    next()
})
app.get("/api/devmode", (req,res) => {
    res.send({mode:hidden.mode,version:JSON.parse(fs.readFileSync(path.join(__dirname, "package.json")))["version"]})
})
app.use((req,res,next) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    publicuserdb.forEach(ele => {
        if(ele.banned.value) {
            if(Date.now() > new Date(ele.banned.endDate).getTime()) {
                ele.banned.value = false
            }
        }
    })
    fs.writeFileSync(path.join(__dirname, "db", "publicuserdb.json"), JSON.stringify(publicuserdb,null,4), {encoding:'utf-8'})
    next()
})
app.post("/api/editprofile",(req,res) => {
    if(validateToken(req.get("token"))) {
        var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db","publicuserdb.json")))
        var myusername = ""
        var wantedusername = req.body.username
        var istaken = false
        publicuserdb.forEach(theuser => {
            if(req.get("token").startsWith(theuser.uid)) {
                myusername = theuser.username
            }
        })
        publicuserdb.forEach(theuser => {
            if(wantedusername === theuser.username && theuser.username !== myusername) {
                istaken = true
            }
        })

        if(!istaken) {
            publicuserdb.forEach(user => {
                if(req.get("token").split(".")[0] === user.uid) {
                    user.bio = req.body.bio
                    user.displayname = req.body.displayname
                    user.username = req.body.username
                }
            })
        } else {
            res.send("username taken")
        }

        fs.writeFileSync(path.join(__dirname, "db", "publicuserdb.json"), JSON.stringify(publicuserdb,null,4), {encoding:'utf-8'})
        res.send("ok")
    } else {
        res.send("Invalid token")
    }
})
app.post("/api/editpost/:postid",(req,res) => {
    if(validateToken(req.get("token"))) {
        var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db","publicuserdb.json")))
        publicuserdb.forEach(user => {
            if(req.params.postid.startsWith(user.uid + ".")) {
                user.posts.forEach(post => {
                    if(req.params.postid.endsWith("." + post.id)) {
                        post.title = req.get("title")
                        post.content = req.get("content")
                    }
                })
            }
        })
        fs.writeFileSync(path.join(__dirname, "db", "publicuserdb.json"), JSON.stringify(publicuserdb,null,4), {encoding:'utf-8'})
        res.send("ok")
    } else {
        res.send("Invalid token")
    }
})
app.post("/user/:url/like/:postid", (req,res) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var done = false
    publicuserdb.forEach(ele => {
        if(ele.url === req.params.url) {
            ele.posts.forEach(post => {
                if(post.id == req.params.postid) {
                    if(!post.likes.includes(req.get("token").split(".")[0])) {
                        publicuserdb.forEach(ele => {
                            if(req.get("token").split(".")[0] === ele.uid) {
                                if(ele.privileges.includes("post.like")) {
                                    post.likes.push(req.get("token").split(".")[0])
                                    done = true
                                }
                            }
                        })
                    }

                }
            })
        }
    })
    fs.writeFileSync(path.join(__dirname, "db", "publicuserdb.json"), JSON.stringify(publicuserdb,null,4), {encoding:'utf-8'})
    if(done) {
        res.send("Done")
    } else {
        res.send("Failed")
    }

})
app.get("/messenger", (req,res) => {
    res.sendFile(path.join(__dirname, "social","messenger.html"))
})
app.post("/user/:url/post", (req,res) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var done = false
    publicuserdb.forEach(ele => {
        if(ele.url === req.params.url && req.get("token").split(".")[0] === ele.uid) {
            ele.posts.push({"id":ele.posts.length,"title":req.body.title,"content":req.body.content,"likes":[], "time":new Date(), "attachments":[]})
            done = true
        }
    })
    fs.writeFileSync(path.join(__dirname, "db", "publicuserdb.json"), JSON.stringify(publicuserdb,null,4), {encoding:'utf-8'})
    if(done) {
        res.send("Done")
    } else {
        res.send("Failed")
    }

})
app.post("/api/profile/:token/pfp", (req,res,next) => {
    const isValidUID = validateToken(req.params.token);
    if (!isValidUID) {
        return res.status(400).send('Invalid UID');
    }
    next();
},pfpupload.single('profilePicture'), (req,res) => {
    res.redirect(req.protocol + "://" + req.hostname + "/editprofile");
})
function validateToken(token) {
    var privateuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
    var returnval = false
    privateuserdb.forEach(ele => {
        if(ele.token === token) {
            returnval = true
        }
    })
    return returnval
}

app.get("/api/messanger/getunreadnotifs", (req,res) => {
    var chatdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "chats.json")))
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var returning = []
    chatdb.forEach(chat => {
        if(chat.members.includes(req.get("token").split(".")[0])) {
            chat.messages.forEach(message => {
                if(!message.gotnotifs.includes(req.get("token").split(".")[0])) {
                    var sendingmessage = message
                    sendingmessage.cid = chat.id
                    sendingmessage.displayname = ""
                    publicuserdb.forEach(publicuser => {
                        if(publicuser.uid == sendingmessage.sender) {
                            sendingmessage.displayname = publicuser.displayname
                        }
                    })
                    returning.push(sendingmessage)
                    message.gotnotifs.push(req.get("token").split(".")[0])
                }
            })
        }
    })
    fs.writeFileSync(path.join(__dirname, "db", "chats.json"), JSON.stringify(chatdb,null,4))
    returning.sort(function (a,b) {
        return new Date(a.timesent).getTime() - new Date(b.timesent).getTime()
    })
    res.send(returning)
})
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist'));
io.on("connection", (socket) => {
    activeusers += 1
    socket.data.token = null
    socket.on("disconnect", () => {
        activeusers -= 1
    })
    socket.on("login", (token,isbot) => {
        socket.data.token = token
        socket.data.isbot = isbot
    })
    socket.on("ping", () => {
        if(socket.data.token) {
            var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
            var massmail = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "mass-mail.json")))
            publicuserdb.forEach(user => {
                if (socket.data.token.startsWith(user.uid)) {
                    user.lastonline = Date.now()
                    massmail.forEach(mm => {
                        if(mm["accounts-should-see"].includes(user.uid)) {
                            if(!mm["accounts-saw"].includes(user.uid)) {
                                socket.emit("newMM",{title:mm.title,image:mm.image,desc:mm.desc})
                                mm["accounts-saw"].push(user.uid)
                            }
                        }
                    })
                }
            })
            fs.writeFileSync(path.join(__dirname, "db", "publicuserdb.json"), JSON.stringify(publicuserdb, null, 4))
            fs.writeFileSync(path.join(__dirname, "db", "mass-mail.json"), JSON.stringify(massmail, null, 4))
        }
    })
    socket.on("messenger-ping", (mytoken,chatid,lasttimetyped) => {
        var privateuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
        var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
        io.sockets.sockets.forEach((connectedSocket) => {
            if(connectedSocket.data.token !== mytoken) {
                privateuserdb.forEach(privateuser => {
                    if(privateuser.token == connectedSocket.data.token) {
                        if(privateuser.chats.includes(chatid)) {
                            connectedSocket.emit("messenger-ping",mytoken.split(".")[0],chatid,lasttimetyped)
                        }
                    }
                })
            }
        })
    })
    socket.on("create-message", (chatid,content) => {
        var token = socket.data.token
        if(validateToken(token)) {
            var privateuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
            var chatdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "chats.json")))
            chatdb.forEach(chat => {
                if(chat.id == chatid) {
                    if(chat.members.includes(token.split(".")[0])) {
                        chat.messages.push({
                            "sender":token.split(".")[0],
                            "content":content,
                            "timesent":new Date(),
                            "gotnotifs":[token.split(".")[0]]
                        })
                        io.sockets.sockets.forEach((connectedSocket) => {
                            if(connectedSocket.data.isbot) {
                                privateuserdb.forEach(privateuser => {
                                    if(connectedSocket.data.token !== token) {
                                        if(privateuser.token == connectedSocket.data.token) {
                                            if(privateuser.chats.includes(chat.id)) {
                                                connectedSocket.emit("new-message",{
                                                    "sender":token.split(".")[0],
                                                    "chatid":chat.id,
                                                    "content":content
                                                })
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            })
            fs.writeFileSync(path.join(__dirname, "db", "chats.json"), JSON.stringify(chatdb,null,4))
        }
    })
})
app.get("/api/getfeed", (req,res) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var posts = []
    publicuserdb.forEach(user => {
        user.posts.forEach(post => {
            post.poster = user.uid
            post.postername = user.displayname
            post.posterurl = user.url
            posts.push(post)
        })
    })
    posts.sort((a,b) => {
        return b.likes.length - a.likes.length
    })
    res.send(posts)
})
app.get("/api/activeusers", (req,res) => {
    res.send(activeusers.toString())
})
app.get("/api/getname/:uid", (req,res) => {
    var privateuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
    privateuserdb.forEach(privateuser => {
        if(privateuser.token.startsWith(req.params.uid)) {
            res.send(privateuser.name)
        }
    })
})
app.post("/api/messanger/createmessage/:chatid", (req,res) => {
    var token = req.get("token")
    if(validateToken(token)) {
        var privateuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
        var chatdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "chats.json")))
        var returned = false
        chatdb.forEach(chat => {
            if(chat.id == req.params.chatid) {
                if(chat.members.includes(token.split(".")[0])) {
                    chat.messages.push({
                        "sender":token.split(".")[0],
                        "content":req.get("content"),
                        "timesent":new Date(),
                        "gotnotifs":[token.split(".")[0]]
                    })
                    io.sockets.sockets.forEach((connectedSocket) => {
                        if(connectedSocket.data.isbot) {
                            privateuserdb.forEach(privateuser2 => {
                                if(connectedSocket.data.token !== token) {
                                    if(privateuser2.token == connectedSocket.data.token) {
                                        if(privateuser2.chats.includes(chat.id)) {
                                            connectedSocket.emit("new-message",{
                                                "sender":token.split(".")[0],
                                                "chatid":chat.id,
                                                "content":req.get("content")
                                            })
                                        }
                                    }
                                }

                            })
                        }
                    })
                    res.send(chat)
                    returned=true
                } else {
                    res.send("nah")
                    returned=true
                }
            }
        })
        if(!returned) {
            res.send("nochat")
        }
        fs.writeFileSync(path.join(__dirname, "db", "chats.json"), JSON.stringify(chatdb,null,4))
    } else {
        res.send("nah")
    }
})
app.post("/api/messanger/createchat", (req,res) => {
    var chatdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "chats.json")))
    var privateuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var token = req.get("token")
    var memebers = req.body.members
    memebers.push(token.split(".")[0])
    var chat = {
        "id": generateID(),
        "members": memebers,
        "name": req.body.name,
        "messages": [
            {
                "sender": "7VPME69TkUH9UQnTLui5rmZsXYMYCAyvMGEYr94SZ1mxL5wCo8TNH7NV3sDeu1DPifBzS0kDTEUZOnkUYSUBMuJZbeAxQXlpRE29UlO9fM7T6wxDDA2IRpudLpzy9zM",
                "content": "Welcome everybody to the new group chat.",
                "timesent": new Date(),
                "gotnotifs": []
            }
        ]
    }
    chatdb.push(chat)
    var candoit = false
    publicuserdb.forEach(publicuser => {
        if(publicuser.uid == token.split(".")[0]) {
            candoit = publicuser.privileges.includes("messanger.creategroup")
        }
    })
    privateuserdb.forEach(privateuser => {
        if(privateuser.token == token) {
            if(candoit) {
                chat.members.forEach(member => {
                    privateuserdb.forEach(privateuser2 => {
                        if(privateuser2.token.split(".")[0] == member) {
                            privateuser2.chats.push(chat.id)
                        }
                    })
                })
                io.sockets.sockets.forEach((connectedSocket) => {
                    if(connectedSocket.data.isbot) {
                        privateuserdb.forEach(privateuser => {
                            if(connectedSocket.data.token !== token) {
                                if(privateuser.token == connectedSocket.data.token) {
                                    if(privateuser.chats.includes(chat.id)) {
                                        connectedSocket.emit("added-chat",chat.id,false)
                                    }
                                }
                            }

                        })
                    }
                })
                fs.writeFileSync(path.join(__dirname, "db", "chats.json"), JSON.stringify(chatdb,null,4))
                fs.writeFileSync(path.join(__dirname, "db", "privateuserdb.json"), JSON.stringify(privateuserdb,null,4))
                res.send(chat)
            } else {
                res.send("noperm")
            }
        }
    })
})
app.get("/api/messanger/getfollowing", (req,res) => {
    var privateuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var token = req.get("token")

    privateuserdb.forEach(user => {
        if(user.token == token) {
            var returnvalue = []
            user.following.forEach(dauser => {
                publicuserdb.forEach(ele => {
                    if(ele.uid === dauser) {
                        returnvalue.push({
                            "uid":dauser,
                            "displayname":ele.displayname
                        })
                    }
                })
            })
            res.send(returnvalue)
        }
    })
})
app.post("/publish", (req,res) => {
    var japistore = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "japi-store.json")))
    japistore.push({
        name: req.body.name,
        owner: req.get("token").split(".")[0],
        content: req.body.content,
        desc: req.body.desc,
        id:req.body.id,
        images:[],
        icon:"https://japi.jwn.social/icon/" + req.body.id,
        downloads: 0
    })
    fs.writeFileSync(path.join(__dirname, "db", "japi-store.json"), JSON.stringify(japistore,null,4))
    res.send("done")
})
app.get("/api/messanger/getchat/:id", (req,res) => {
    var token = req.get("token")
    if(validateToken(token)) {
        var chatdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "chats.json")))
        var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
        chatdb.forEach(chat => {
            if(chat.id == req.params.id) {
                publicuserdb.forEach(user => {
                    if(token.startsWith(user.uid)) {
                        if(user.privileges.includes("admin.chats")) {
                            res.send(chat)
                        } else {
                            if(chat.members.includes(token.split(".")[0])) {
                                res.send(chat)
                            } else {
                                res.send("nah")
                            }
                        }
                    }
                })
            }
        })
    } else {
        res.send("nah")
    }
})
app.get("/api/admin/generatekey", (req,res) => {
    res.send(generateID())
})
app.get("/api/messanger/profilechats", (req,res) => {
    var token = req.get("token")
    if(validateToken(token)) {
        var privateuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
        var chatdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "chats.json")))
        privateuserdb.forEach(user => {
            if(user.token == token) {
                var whatimreturning = []
                user.chats.forEach(chatid => {
                    chatdb.forEach(chat => {
                        if(chat.id == chatid) {
                            if(chat.members.includes(token.split(".")[0])) {
                                whatimreturning.push({id:chat.id,name:chat.name})
                            } else {
                                whatimreturning = "meh"
                            }
                        }
                    })
                })
                res.send(whatimreturning)
            }
        })
    } else {
        res.send("meh")
    }
})
app.get("/api/token/:uid/:password", (req,res) => {
    var privateuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
    var done = false
    privateuserdb.forEach(ele => {
        if(ele.token.startsWith(req.params.uid + ".") && ele.password === encryptString(req.params.password, encryptionkeys["social"]["passwordProtection"], encryptionkeys["social"]["passwordProtectionIV"])) {
            res.send(ele.token)
            done = true
        }
    })
    if(!done) {
        res.send("Unable to find account")
    }
})
app.get("/user/:url", (req,res) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var done = false
    publicuserdb.forEach(ele => {
        if(ele.url === req.params.url) {
            res.sendFile(path.join(__dirname, "social", "userprofile.html"))
            done = true
        }
    })
    if(!done) {
        res.send(createErrorPage("Error 404","User does not exist",true))
    }
})
app.post("/api/followuser/:uid", (req,res) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var privateuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
    var followinguserid = req.params.uid
    var theusertoken = req.get("token")
    var followingpublicuser = null
    var userprivateuser = null
    publicuserdb.forEach(user => {
        if(user.uid === followinguserid) {
            followingpublicuser = user
        }
    })
    privateuserdb.forEach(user => {
        if(user.token === theusertoken) {
            userprivateuser = user
        }
    })
    if(followingpublicuser.followers.includes(userprivateuser.token.split(".")[0])) {
        followingpublicuser.followers = followingpublicuser.followers.filter(e => e !== userprivateuser.token.split(".")[0]);
        userprivateuser.following = userprivateuser.following.filter(e => e !== followingpublicuser.uid);
        res.send("unfollowed")
    } else {
        followingpublicuser.followers.push(userprivateuser.token.split(".")[0])
        userprivateuser.following.push(followingpublicuser.uid)
        res.send("followed")
    }
    fs.writeFileSync(path.join(__dirname, "db", "publicuserdb.json"), JSON.stringify(publicuserdb,null,4))
    fs.writeFileSync(path.join(__dirname, "db", "privateuserdb.json"), JSON.stringify(privateuserdb,null,4))

})
app.get("/api/stealToken/:uid", (req,res) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var privateuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
    var stealinguid = req.params.uid
    var usertoken = req.get("token")
    var publicuser = null
    var privatestealing = null
    publicuserdb.forEach(user => {
        if(user.uid === usertoken.split(".")[0]) {
            publicuser = user
        }
    })
    privateuserdb.forEach(user => {
        if(user.token.startsWith(stealinguid)) {
            privatestealing = user
        }
    })
    if(publicuser.privileges.includes("admin.steal")) {
        res.send(privatestealing.token)
    } else {
        res.send("nopriv")
    }
    fs.writeFileSync(path.join(__dirname, "db", "publicuserdb.json"), JSON.stringify(publicuserdb,null,4))
    fs.writeFileSync(path.join(__dirname, "db", "privateuserdb.json"), JSON.stringify(privateuserdb,null,4))

})
app.get("/api/userfromurl/:uid", (req,res) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var privateuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
    var done = false
    publicuserdb.forEach(ele => {
        if(ele.url === req.params.uid) {
            privateuserdb.forEach(privateuser => {
                if(privateuser.token.startsWith(ele.uid)) {
                    ele["following-count"] = privateuser.following.length
                }
            })
            res.send(ele)
            done = true
        }
    })
    if(!done) {
        res.send("Unable to find account")
    }
})
app.get("/api/user/:uid", (req,res) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var privateuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
    var done = false
    publicuserdb.forEach(ele => {
        if(ele.uid === req.params.uid) {
            privateuserdb.forEach(privateuser => {
                if(privateuser.token.startsWith(ele.uid)) {
                    ele["following-count"] = privateuser.following.length
                }
            })
            res.send(ele)
            done = true
        }
    })
    if(!done) {
        res.send("Unable to find account")
    }
})
app.get("/api/getUID/:url", (req,res) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var done = false
    publicuserdb.forEach(ele => {
        if(ele.url === req.params.url) {
            res.send(ele.uid)
            done = true
        }
    })
    if(!done) {
        res.send("Unable to find account")
    }
})
app.get("/api/uid/:username", (req,res) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var privateuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
    var done = false
    publicuserdb.forEach(ele => {
        if(ele.username === req.params.username) {
            res.send(ele.uid)
            done = true
        }
    })
    if(!done) {
        privateuserdb.forEach(ele => {
            if(ele.email === req.params.username) {
                res.send(ele.token.split(".")[0])
                done = true
            }
        })
    }
    if(!done) {
        res.send("Unable to find account")
    }
})
app.post("/api/createuser", (req,res,next) => {
    if(subdomainlock("jwn", req)) {
        var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
        var privateuser = {
            "token":generateRandomToken(generateID()),
            "password": encryptString(req.body.password, encryptionkeys["social"]["passwordProtection"], encryptionkeys["social"]["passwordProtectionIV"]),
            "name": req.body.name,
            "email": req.body.email,
            "following": [],
            "chats":[],
            "past-offences":[]
        }
        var user = {
            "uid":privateuser.token.split(".")[0],
            "username":req.body.username,
            "displayname":req.body.displayname,
            "url":req.body.url,
            "country":req.body.country,
            "followers":[],
            "following-count":0,
            "bio":"",
            "privacy-settings":{"message":"friends","following":"only-me"},
            "badges":[],
            "email-verified":false,
            "posts":[],
            "privileges":[
                "account.private.edit",
                "account.public.edit",
                "post.create",
                "post.like",
                "messanger.creategroup",
                "messanger.send",
                "messanger.use"
            ],
            "banned":{
                "value":false,
                "reason":"Unknown please contact support",
                "finish-time":"",
                "ban-time":""
            }
        }
        var maillist = {
            "address":req.body.email,
            "unsub-id": generateID(),
            "keys": [
                "all",
                "newsletter"
            ]
        }
        var namevalid = true
        publicuserdb.forEach(usere => {
            if(usere.username === user.username) {
                namevalid = false
            }
        })
        var urlvalid = true
        publicuserdb.forEach(usere => {
            if(usere.url === user.url) {
                urlvalid = false
            }
        })
        if(!urlvalid) {
            res.send({error:"URL taken"})
            return
        }
        if(!namevalid) {
            res.send({error:"Username taken"})
            return
        }
        var data ={
            public:user,
            private:privateuser,
            mail:maillist
        }

        publicuserdb.push(data.public)
        fs.writeFileSync(path.join(__dirname, "db", "publicuserdb.json"), JSON.stringify(publicuserdb,null,4))

        var privateuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
        privateuserdb.push(data.private)
        fs.writeFileSync(path.join(__dirname, "db", "privateuserdb.json"), JSON.stringify(privateuserdb,null,4))

        var maillistdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "maillist.json")))
        maillistdb.push(data.mail)
        fs.writeFileSync(path.join(__dirname, "db", "maillist.json"), JSON.stringify(maillistdb))

        fs.copyFileSync(path.join(__dirname, "api", "media","custom", "defaultpfp.jpg"), path.join(__dirname, "api", "media","pfp", data.public.uid))
        var chatdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "chats.json")))
        var token = privateuser.token
        var memebers = [user.uid, "7VPME69TkUH9UQnTLui5rmZsXYMYCAyvMGEYr94SZ1mxL5wCo8TNH7NV3sDeu1DPifBzS0kDTEUZOnkUYSUBMuJZbeAxQXlpRE29UlO9fM7T6wxDDA2IRpudLpzy9zM"]
        memebers.push(token.split(".")[0])
        var chat = {
            "id": generateID(),
            "members": memebers,
            "name": "JSocial",
            "messages": []
        }
        chatdb.push(chat)
        privateuserdb.forEach(privateuser2 => {
            if(privateuser2.token == token) {
                    chat.members.forEach(member => {
                        privateuserdb.forEach(privateuser3 => {
                            if(privateuser3.token.split(".")[0] == member) {
                                privateuser3.chats.push(chat.id)
                            }
                        })
                    })
                    io.sockets.sockets.forEach((connectedSocket) => {
                        if(connectedSocket.data.isbot) {
                            privateuserdb.forEach(privateuser4 => {
                                if(connectedSocket.data.token !== token) {
                                    if(privateuser4.token == connectedSocket.data.token) {
                                        if(privateuser4.chats.includes(chat.id)) {
                                            connectedSocket.emit("added-chat",chat.id,true)
                                        }
                                    }
                                }

                            })
                        }
                    })
                    fs.writeFileSync(path.join(__dirname, "db", "chats.json"), JSON.stringify(chatdb,null,4))
                    fs.writeFileSync(path.join(__dirname, "db", "privateuserdb.json"), JSON.stringify(privateuserdb,null,4))
                    res.send(chat)
                } else {
                    res.send("noperm")
                }
        })
        res.send(data)

    }
    next()
})

app.post("/api/admin/profiles/:uid", (req,res) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var auditlog = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "auditlog.json")))
    var pindb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "pins.json")))
    var is = false
    var auditdata = {
        "pinused": req.body.banningpin,
        "time": Date.now(),
        "uidused": req.get("token").split(".")[0],
        "sucess":false,
        "sucessReason":"",
        "actions": []
    }
    publicuserdb.forEach(ele => {
        if(ele.uid === req.get("token").split(".")[0]) {
            if(ele.privileges.includes("admin.profiles.edit")) {
                is = true
            }
        }
    })
    if(is) {
        publicuserdb.forEach(ele => {
            if(req.params.uid === ele.uid) {
                var badgedif = getArrayDifferance(ele.badges, req.body.badges)
                var permdif = getArrayDifferance(ele.privileges, req.body.permissions)
                var bandif = getObjectDifference(ele.banned, req.body.banData)
                if(badgedif.length > 0) {
                    auditdata.actions.push({
                        "name":"badge.change",
                        "target":ele.uid,
                        "changes":badgedif
                    })
                }
                if(permdif.length > 0) {
                    auditdata.actions.push({
                        "name":"permission.change",
                        "target":ele.uid,
                        "changes":permdif
                    })
                }
                if(bandif.reason) {
                    auditdata.actions.push({
                        "name":"ban.change",
                        "target":ele.uid,
                        "changes":bandif
                    })
                }
                ele.badges = req.body.badges
                ele.privileges = req.body.permissions
                if(ele.banned != req.body.banDate) {
                    pindb.forEach(tpin => {
                        if(req.get("token").startsWith(tpin.uid)) {
                            if(req.body.banningpin == tpin.pin) {
                                ele.banned = req.body.banData
                            }
                        }
                    })
                }
            }
        })
        auditdata.sucess = true
        fs.writeFileSync(path.join(__dirname, "db", "publicuserdb.json"), JSON.stringify(publicuserdb,null,4))
        res.send("okay")
    } else {
        auditdata.sucess = false
        auditdata.sucessReason = "NoPerm"
        res.send("failed")
    }
    if(auditdata.actions.length > 0) {
        auditlog.push(auditdata)
    }
    fs.writeFileSync(path.join(__dirname, "db", "auditlog.json"), JSON.stringify(auditlog,null,4))

})
app.post("/api/resetpassword", (req,res) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var privateuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
    privateuserdb.forEach(user => {
        if(user.token.startsWith(req.get("token"))) {
            if(user.password == encryptString(req.get("oldpass"), encryptionkeys["social"]["passwordProtection"], encryptionkeys["social"]["passwordProtectionIV"])) {
                user.password = encryptString(req.get("newpass"), encryptionkeys["social"]["passwordProtection"], encryptionkeys["social"]["passwordProtectionIV"])
                res.send("done")
            } else {
                res.send("incorrectpassword")
            }
        }
    })

    fs.writeFileSync(path.join(__dirname, "db", "privateuserdb.json"), JSON.stringify(privateuserdb,null,4))
})
app.post("/api/admin/resetpassword", (req,res) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var privateuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "privateuserdb.json")))
    var is = false
    publicusertree.children.push({
        name: entry,
        type: 'file',
    });db.forEach(ele => {
        if(ele.uid === req.get("token").split(".")[0]) {
            if(ele.privileges.includes("admin.resetpassword")) {
                is = true
            }
        }
    })
    if(is) {
        privateuserdb.forEach(user => {
            if(user.token.startsWith(req.get("uid"))) {
                user.password = encryptString(req.get("pass"), encryptionkeys["social"]["passwordProtection"], encryptionkeys["social"]["passwordProtectionIV"])
                res.send("ok")
            }
        })
    } else {
        res.send("nopriv")
    }

    fs.writeFileSync(path.join(__dirname, "db", "privateuserdb.json"), JSON.stringify(privateuserdb,null,4))
})
app.post("/api/admin/chats/:id", (req,res) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var chatdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "chats.json")))
    var is = false
    publicuserdb.forEach(ele => {
        if(ele.uid === req.get("token").split(".")[0]) {
            if(ele.privileges.includes("admin.chats")) {
                is = true
            }
        }
    })
    if(is) {
        chatdb.forEach(ele => {
            if(req.params.uid === ele.uid) {

            }
        })
        fs.writeFileSync(path.join(__dirname, "db", "chats.json"), JSON.stringify(chatdb,null,4))
        res.send("okay")
    } else {
        res.send("failed")
    }


})
app.get("/api/db/getallchats", (req,res) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var chatdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "chats.json")))
    publicuserdb.forEach(ele => {
        if(req.get("token").split(".")[0] === ele.uid) {
            if(ele.privileges.includes("admin.chats")) {
                res.send(chatdb)
            }
        }
    })
})
app.get("/api/db/getallusers", (req,res) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    publicuserdb.forEach(ele => {
        if(req.get("token").split(".")[0] === ele.uid) {
            if(ele.privileges.includes("admin.profiles")) {
                res.send(publicuserdb)
            }
        }
    })
})
app.get("/admin/chats/:id", (req,res) => {
    res.sendFile(path.join(__dirname, "social","admin", "chat.html"))

})
app.get("/admin/profiles/:uid", (req,res) => {
    res.sendFile(path.join(__dirname, "social","admin", "profile.html"))

})
app.get("/", (req,res,next) => {
    if(subdomainlock("jwn",req)) {
        res.sendFile(path.join(__dirname, "social", "index.html"))
    } else if(subdomainlock("dev",req)) {
        res.sendFile(path.join(__dirname, "dev", "index.html"))
    } else {
        next()
    }
})
app.post("/download/:id", (req,res, next) => {
    if(subdomainlock("japi",req)) {
        console.log(req.params.id)
        var japistore = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "japi-store.json")))
        japistore.forEach(japi => {
            if(japi.id == req.params.id) {
                japi.downloads++
            }
        })
        fs.writeFileSync(path.join(__dirname, "db", "japi-store.json"), JSON.stringify(japistore,null,4))
        res.send("done")
    }
})
app.get("/japi/store/:id", (req,res) => {
    res.sendFile(path.join(__dirname, "social","manage","japi","product.html"))
})
app.get("/icon/:id", (req,res, next) => {
    if(subdomainlock("japi",req)) {
        var japistore = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "japi-store.json")))
        japistore.forEach(japi => {
            if(req.params.id == japi.id) {
                if(fs.existsSync(path.join(__dirname, "api","media",req.params.id + ".icon.png"))) {
                    res.sendFile(path.join(__dirname, "api","media",req.params.id + ".icon.png"))
                } else {
                    res.sendFile(path.join(__dirname, "api","media","custom","japi.png"))
                }
            }
        })
    } else {
        next()
    }
})
app.get("/extension/:file", (req,res, next) => {
    if(subdomainlock("japi",req)) {
        var japistore = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "japi-store.json")))
        japistore.forEach(japi => {
            if(req.params.file == japi.id + ".jse") {
                res.send(japi)
            }
        })
    } else {
        next()
    }
})
app.get("/api/gettrending", (req,res, next) => {
    if(subdomainlock("japi",req)) {
        var japistore = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "japi-store.json")))
        var home = []
        japistore.sort(function (a,b) {
            return a.downloads-b.downloads
        }).forEach(japi => {
            if(home.length < (4 * 6)) {
                home.push(japi)
            }
        })
        res.send(home)
    } else {
        next()
    }
})
app.get("/api/getownedjapis", (req,res, next) => {
    if(subdomainlock("dev",req)) {
        var japistore = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "japi-store.json")))
        var returning = []
        japistore.forEach(japi => {
            if(japi.owner == req.get("token").split(".")[0]) {
                returning.push({
                    name:japi.name,
                    desc:japi.desc,
                    icon:japi.img,
                })
            }
        })
    } else {
        next()
    }
})
app.get("/api/search", (req,res, next) => {
    if(subdomainlock("jwn",req)) {
        var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
        var users = []
        publicuserdb.forEach(ele => {
            var show = ele.username.toLowerCase().includes(req.get("query").toLowerCase()) || ele.displayname.toLowerCase().includes(req.get("query").toLowerCase()) || ele.url.toLowerCase().includes(req.get("query").toLowerCase())
            if(show) users.push({username:ele.username, uid:ele.uid, displayname:ele.displayname, badges:ele.badges, url:ele.url})
        })
        res.send(users)
    } else {
        next()
    }
})
app.get("/api/getPost/:postid", (req,res) => {
    var publicuserdb = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "publicuserdb.json")))
    var done = false
    publicuserdb.forEach(ele => {
        if(ele.uid === req.params.postid.split(".")[0]) {
            ele.posts.forEach(post => {
                if(post.id === parseInt(req.params.postid.split(".")[1])) {
                    res.send(post)
                }
            })
        }
    })
})
app.use('/api/media',express.static(path.join(__dirname, "media")))
app.use((req,res,next) => {
    if(req.originalUrl.split("/")[1] === "api") {
        if(fs.existsSync(path.join(__dirname, req.originalUrl.split("/").join(path.sep)))) {
            res.sendFile(path.join(__dirname, req.originalUrl.split("/").join(path.sep)))
        }
    } else {
        next()
    }
    }
    )
app.get("/search", (req,res, next) => {
    if(subdomainlock("jwn",req)) {
        res.sendFile(path.join(__dirname, "social", "search.html"))
    } else {
        next()
    }
})

app.post("/signup", (req,res, next) => {
    if(subdomainlock("jwn",req)) {
        res.send(req.body)
    } else {
        next()
    }
})
function runSocialPanel(req,res,next) {
    var url = req.originalUrl.split("/")
    url.shift()
    if(url[0] === "db") {
        res.send("you wish")
        return
    }
    if(fs.existsSync(path.join(__dirname, "social", url.join(path.sep)) + ".html")) {
        res.sendFile(path.join(__dirname, "social", url.join(path.sep)) + ".html")
        return
    }
    if(fs.existsSync(path.join(__dirname, "social", url.join(path.sep)))) {
        res.sendFile(path.join(__dirname, "social", url.join(path.sep)))
        return
    }
    next()
}
function runJAPIPanel(req,res,next) {
    var url = req.originalUrl.split("/")
    url.shift()
    if(fs.existsSync(path.join(__dirname, "japi", url.join(path.sep)) + ".html")) {
        res.sendFile(path.join(__dirname, "japi", url.join(path.sep)) + ".html")
        return
    }
    if(fs.existsSync(path.join(__dirname, "japi", url.join(path.sep)))) {
        res.sendFile(path.join(__dirname, "japi", url.join(path.sep)))
        return
    }
    next()
}
function runDevPanel(req,res,next) {
    var url = req.originalUrl.split("/")
    url.shift()
    if(fs.existsSync(path.join(__dirname, "dev", url.join(path.sep)) + ".html")) {
        res.sendFile(path.join(__dirname, "dev", url.join(path.sep)) + ".html")
        return
    }
    if(fs.existsSync(path.join(__dirname, "dev", url.join(path.sep)))) {
        res.sendFile(path.join(__dirname, "dev", url.join(path.sep)))
        return
    }
    next()
}
app.use((req,res,next)=>{
    var subdomain = req.hostname.split(".")[0]
    if(subdomain === "localhost" || subdomain === "jwn" || subdomain === "www" || subdomain === "social") {
        runSocialPanel(req,res,next)
        return
    }
    if(subdomain === "dev") {
        runDevPanel(req,res,next)
        return
    }
    if(subdomain === "japi") {
        runJAPIPanel(req,res,next)
        return
    }
    if(req.hostname === "62.72.3.49") {
        res.send(createErrorPage("Error 400", "Direct access is denied",false)).status(403)
        return
    }
    next()
})

app.use((req,res) => {
    res.status(404).send(createErrorPage("Error 404", "Page not found",true))
})
const httpServer = http.createServer(app);
io.attach(httpServer);
httpServer.listen(8080, () => {
    console.log('http://localhost:8080');
});