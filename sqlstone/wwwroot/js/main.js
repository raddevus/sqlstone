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


