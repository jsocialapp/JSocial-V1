/*
<div class="card" style="width: 18rem;" japi-id="blue">
      <div class="card-body">
        <h5 class="card-title">Blue</h5>
        <h6 class="card-subtitle mb-2 text-body-secondary">Themes</h6>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="japi.blue.enabled">
          <label class="form-check-label" for="japi.blue.enabled">Enabled</label>
        </div>
        <button class="btn btn-primary">SETTINGS</button>
        <button class="btn btn-danger">UNINSTALL</button>
      </div>
    </div>
 */
if(localStorage.getItem("prefs")) {
    var prefs = JSON.parse(localStorage.getItem("prefs"))
    prefs.addons.forEach(addonjson => {
        var addon = new Addon(addonjson)
        var addonele = document.createElement("div")
        addonele.className = "card"
        addonele.style.width = "18rem"
        addonele.innerHTML = `
        <div class="card-body">
        <h5 class="card-title">${addon.info.name}</h5>
        <h6 class="card-subtitle mb-2 text-body-secondary">${addon.info.catagory}</h6>
        ${addon.info.settings ? "<button class=\"btn btn-primary\">SETTINGS</button>" : ""}
        <button class="btn btn-danger" uninstallbtn>UNINSTALL</button>
      </div>
        `
        addonele.querySelector("button[uninstallbtn]").onclick = function () {
            prefs.addons.splice(prefs.addons[addonjson] - 1, 1)
            localStorage.setItem("prefs",JSON.stringify(prefs))
            location.reload()
        }
        document.getElementById("installed").append(addonele)
    })
    localStorage.setItem("prefs",JSON.stringify(prefs))
}