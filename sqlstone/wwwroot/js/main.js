// main.js
var currentUuid = null;

function genUuid(){
    if (document.querySelector("#uuid").value != ""){
        currentUuid = document.querySelector("#uuid").value;
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

function registerUser(){
    if (currentUuid == null || currentUuid == ""){
        alert("Please generate & set a valid UUID value and try again.");
        return;
    }
    fetch('http://localhost:5215/User/RegisterUser')
        .then(response => response.json())
        .then(data => console.log(data));

}

function uuidv4() {
    // got this from https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
    return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(
        /[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    ));
}


