// main.js
var currentUuid = null;
var lsUuidName = "currentUuid";
var devUrl = "http://localhost:5215/";  // make sure to include trailing /
var prodUrl = "https://newlibre.com/journal/";
var baseUrl = devUrl;
var alertInterval = null;

document.querySelector("body").addEventListener("load", initApp());


function initApp(){
    console.log("initializing app...");
    loadUuidFromLocalStorage();
    displaySaveMessage();
}

function displaySaveMessage(){
    var shouldDisplay = localStorage.getItem("shouldDispalySaveMsg");
    if (shouldDisplay){
        uuidRegisterAlert("You're data has been saved successfully.");
    }
    localStorage.removeItem("shouldDispalySaveMsg");
}

function loadUuidFromLocalStorage(){
    var uuid = localStorage.getItem(lsUuidName);
    if (uuid != null){
        currentUuid = uuid;
        document.querySelector("#uuid").value = currentUuid;
    }
}

function saveUuidToLocalStorage(){
    localStorage.setItem(lsUuidName,currentUuid);
}


function genUuid(){
    if (document.querySelector("#uuid").value != ""){
        currentUuid = document.querySelector("#uuid").value;
        saveUuidToLocalStorage();
        window.location.reload();
        return;
    }
    currentUuid = uuidv4();
    document.querySelector("#uuid").value = currentUuid;
}

function uuidChanged(){
    if (document.querySelector("#uuid").value == ""){
        currentUuid = null;
    }
}

function deleteUuid(){
    document.querySelector("#uuid").value = "";
    currentUuid = null;
    localStorage.removeItem(lsUuidName);
    window.location.reload();
}

function registerUser(){
    if (currentUuid == null || currentUuid == ""){
        alert("Please generate & set a valid UUID value and try again.");
        return;
    }

    saveUuidToLocalStorage();
    var postdata = {"uuid":currentUuid}
    console.log(`postdata: ${postdata}`);
    console.log(`postdata: ${JSON.stringify(postdata)}`)
    fetch(`${baseUrl}User/RegisterUser?uuid=${currentUuid}`,{
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .then(uuidRegisterAlert("The UUID has been registered on the server."));

}

function uuidv4() {
    // got this from https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
    return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(
        /[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    ));
}

function downloadSqliteDb(){
    console.log("1");
    if (currentUuid != null){
        fetch(`${baseUrl}User/DownloadSqliteDb?uuid=${currentUuid}`,{
                method: 'POST',
            })
            .then(resp => {console.log(resp); return resp.blob();})
            .then(blob => {
                downloadFile(blob,`journal-${GetFileTimeFormat(new Date())}.db`);
            });
    }
    else{
        console.log("3");
        // uuidRegisterAlert("You need to register your UUID to be able to download your sqlite data.\Please register your UUID & try again.");
    }

}

function GetFileTimeFormat(date) {
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day  = ("0" + (date.getDate())).slice(-2);
    var year = date.getFullYear();
    var hour =  ("0" + (date.getHours())).slice(-2);
    var min =  ("0" + (date.getMinutes())).slice(-2);
    var seg = ("0" + (date.getSeconds())).slice(-2);
    return `${year}-${month}-${day}_${hour}-${min}-${seg}`;
}

function downloadFile(blob, name = "journal.db") {
    const href = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href,
      style: "display:none",
      download: name,
    });
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(href);
    a.remove();
}

//Use this method - it does handle double digits correctly
Date.prototype.yyyymmdd = function() {
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
  
    return [this.getFullYear() + "-", mm.length===2 ? '' : '0', mm + "-", dd.length===2 ? '' : '0', dd].join(''); // padding
  };

function uuidRegisterAlert(messageText) {
	document.querySelector('.alert').style.display='block';
    document.querySelector(`#alertMessage`).textContent = messageText;
	alertInterval = setInterval(() => {
		document.querySelector('.alert').style.display='none';
        clearInterval(alertInterval);
	}, 5500);
}

function destroyAccount(){
    
    fetch(`${baseUrl}User/DestroyUserAccount?uuid=${currentUuid}`,{
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
       if (data.result == false){
            alert(`Could not destroy the account. \nError -> ${data.message}`);
            return;
       }
       uuidRegisterAlert("The UUUID, User Account & all associated data was permanently deleted.");
       localStorage.removeItem("currentUuid");
       currentUuid = null;
       document.querySelector("#uuid").value = "";
       window.location.reload();
    });
    document.querySelector("#modalCloseBtn").click();
}


