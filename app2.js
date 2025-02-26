const express = require("express")
const fs = require("fs")
const path = require("path")
// const nodemailer = require('nodemailer');
const socketio = require('socket.io');
const { exec } = require('child_process');
const hidden = require("./hidden");

const app = express()
const io = socketio();
// const newstransporter = nodemailer.createTransport({
//     host: "smtp.titan.email",
//     port: 465 ,
//     secure: true,
//     auth: {
//         user: "news@social.justwhatever.net",
//         pass: hidden.password,
//     },
// });

var port = 6768
function getParentDirectory(directoryPath) {
    return path.dirname(directoryPath);
}
function getTopFileTree(directory) {
    const tree = {
        name: path.basename(directory),
        type: 'directory',
        children: [],
    };

    try {
        const entries = fs.readdirSync(directory);

        for (const entry of entries) {
            const entryPath = path.join(directory, entry);
            let stat;

            try {
                stat = fs.statSync(entryPath);
            } catch (err) {
                // Handle permission errors or other issues
                console.error(`Error accessing ${entryPath}: ${err.message}`);
                continue;
            }

            if (stat.isDirectory()) {
                tree.children.push({
                    name: entry,
                    type: 'directory',
                });
            } else {
                tree.children.push({
                    name: entry,
                    type: 'file',
                });
            }
        }
    } catch (err) {
        console.error(`Error reading directory ${directory}: ${err.message}`);
    }

    return tree;
}
function getFileTree(directory) {
    const tree = {
        name: path.basename(directory),
        type: 'directory',
        children: [],
    };

    try {
        const entries = fs.readdirSync(directory);

        for (const entry of entries) {
            const entryPath = path.join(directory, entry);
            let stat;

            try {
                stat = fs.statSync(entryPath);
            } catch (err) {
                // Handle permission errors or other issues
                console.error(`Error accessing ${entryPath}: ${err.message}`);
                continue;
            }

            if (stat.isDirectory()) {
                const subTree = getFileTree(entryPath);
                tree.children.push(subTree);
            } else {
                tree.children.push({
                    name: entry,
                    type: 'file',
                });
            }
        }
    } catch (err) {
        console.error(`Error reading directory ${directory}: ${err.message}`);
    }

    return tree;
}
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist'));
io.on("connection", (socket) => {
    console.log(socket.id)
})
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "admin", "index.html"))
})
app.get("/api/exist", (req,res) => {
    res.send(fs.existsSync(req.get("cwd")))
})
app.get("/api/getparent", (req,res) => {
    res.send(getParentDirectory(req.get("cwd")))
})
app.get("/api/getdir", (req,res) => {
    res.send(getTopFileTree(req.get("cwd")))
})
app.post("/api/remoteconsole", (req,res) => {
    var adminaccs = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "adminAccounts.json")))
    var auditlog = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "auditlog.json")))
    var auditdata = {
        "time": Date.now(),
        "uidused": "",
        "sucess":false,
        "sucessReason":"",
        "actions": [
            {
                "name":"remoteconsolecmd",
                "cwd":req.get("cwd"),
                "cmd":req.get("cmd")
            }
        ]
    }
    adminaccs.forEach(adminacc => {
        if(req.get("key") == adminacc.key) {
            auditdata.uid = adminacc.uid
            auditdata.sucess = true
            exec(req.get("cmd"), {cwd:req.get("cwd")}, (error, stdout, stderr) => {
                res.send({stdout, error, stderr})
            })
        }
    })
    if(!auditdata.sucess) {
        res.send("Nokey")
        auditdata.sucessReason = "NoKey"
    }
    if(auditdata.actions.length > 0) {
        auditlog.push(auditdata)
    }
    fs.writeFileSync(path.join(__dirname, "db", "auditlog.json"), JSON.stringify(auditlog,null,4))
})
app.post("/api/status", (req,res) => {
    var adminaccs = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "adminAccounts.json")))
    var auditlog = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "auditlog.json")))
    var auditdata = {
        "time": Date.now(),
        "uidused": "",
        "sucess":false,
        "sucessReason":"",
        "actions": []
    }
    var sentback = false
    adminaccs.forEach(adminacc => {
        if(req.get("key") == adminacc.key) {
            auditdata.uidused = adminacc.uid
            switch (req.get("action")) {
                case "restart":{
                    auditdata.actions.push("restart")
                    exec("forever restart app.js", {cwd:__dirname}, (error, stdout, stderr) => {
                        res.send({stderr,stdout,error})
                    })
                    sentback = true
                    break
                }
                case "stop":{
                    auditdata.actions.push("stop")
                    exec("forever stop app.js", {cwd:__dirname}, (error, stdout, stderr) => {
                        res.send({stderr,stdout,error})
                    })
                    sentback = true
                    break
                }
                case "start":{
                    auditdata.actions.push("start")
                    exec("forever start app.js", {cwd:__dirname}, (error, stdout, stderr) => {
                        res.send({stderr,stdout,error})
                    })
                    sentback = true
                    break
                }
                default: {
                    auditdata.sucessReason = "Unknown btn"
                    sentback = false
                }
            }
        }
    })
    if(!sentback) {
        if(auditdata.sucessReason != "Unknown btn") auditdata.sucessReason = "No perm"
        res.send("noperm")
    } else {
        auditdata.sucess = true
    }
    if(auditdata.actions.length > 0) {
        auditlog.push(auditdata)
    }
    fs.writeFileSync(path.join(__dirname, "db", "auditlog.json"), JSON.stringify(auditlog,null,4))
})
app.post("/api/sendmail", (req,res) => {
    var adminaccs = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "adminAccounts.json")))
    var auditlog = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "auditlog.json")))
    var maillist = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "maillist.json")))
    var auditdata = {
        "time": Date.now(),
        "uidused": "",
        "sucess":false,
        "sucessReason":"",
        "actions": []
    }
    var sentback = false
    adminaccs.forEach(adminacc => {
        if(req.get("key") == adminacc.key) {
            /*
                "people":[
                    "@all",
                    "@admin",
                    "justkidabu2011.2@gmail.com"
                ],
                "subject":"The mail system",
                "body":"We got a mail list\nIts cool"
             */
            auditdata.uidused = adminacc.uid
            auditdata.actions.push({
                "name":"mail",
                "people":req.get("people"),
                "subject":req.get("subject"),
                "body":req.get("body")
            })
            var peoplesent = 0
            maillist.forEach(person => {
                JSON.parse(req.get("people")).forEach(thing => {
                    var sendit = false
                    person.keys.forEach(key => {
                        if("@" + key === thing) sendit = true
                        if(person.address === thing) sendit = true
                    })
                    if(sendit) {
                        var senddata = {
                            from: '"JSocial" <news@social.justwhatever.net>',
                            to: person.address,
                            subject: req.get("subject")
                        }
                        if(req.get("template") !== "raw") {
                            var template = fs.readFileSync(path.join(__dirname, "emailtemplates", req.get("template") + ".html"), {encoding:"utf8"})
                            senddata.html = template.replaceAll("[BODY]", req.get("body")).replaceAll("[UNSUBID]", person["unsub-id"]).replaceAll("[DISPLAYNAME]", "UNKNOWN")
                        } else {
                            senddata.text = req.get("body")
                        }
                        newstransporter.sendMail(senddata, () => {
                            console.log(senddata)
                        })
                        peoplesent++
                    }
                })
            })
            res.send(peoplesent + "")
            sentback = true
        }
    })
    if(!sentback) {
        res.send("noperm")
    } else {
        auditdata.sucess = true
    }
    if(auditdata.actions.length > 0) {
        auditlog.push(auditdata)
    }
    fs.writeFileSync(path.join(__dirname, "db", "auditlog.json"), JSON.stringify(auditlog,null,4))
})
app.get("/api/getKey/:username/:pin", (req,res) => {
    var adminaccs = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "adminAccounts.json")))
    var returnval = "UNKNOWN"
    adminaccs.forEach(adminacc => {
        if(req.params.username.toLowerCase() == adminacc.username.toLowerCase() && req.params.pin == adminacc.pin) {
            returnval = adminacc.key
        }
    })
    res.send(returnval)
})
app.use((req,res,next) => {
    if(fs.existsSync(path.join(__dirname, "admin") + req.originalUrl.split("/").join(path.sep))) {
        res.sendFile(path.join(__dirname, "admin") + req.originalUrl.split("/").join(path.sep))
    } else if(fs.existsSync(path.join(__dirname, "admin") + req.originalUrl.split("/").join(path.sep) + ".html")) {
        res.sendFile(path.join(__dirname, "admin") + req.originalUrl.split("/").join(path.sep) + ".html")

    } else {
        next()
    }
})
app.use((req,res) => {
    res.send("Error 404").status(404)
})
app.listen(port, () => {
    console.log("http://localhost:" + port)
    console.log("http://jwn.social:" + port)
})