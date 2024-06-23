let genQRCodeButton;
let qrImage;
let qrFormIsVisible = false;

document.body.addEventListener("mouseup", body_mouseup);
qrImage = document.querySelector("#qrCode");
genQRCodeButton = document.querySelector("#genQRButton");
genQRCodeButton.addEventListener("click", genQRCodeButton_Click);

function genQRCodeButton_Click(){

    let uuidInput = document.querySelector("#uuid");
    if (uuidInput.value == ""){
        uuidRegisterAlert("There is no UUID value to generate a QRCode for.", true);
        return;
    }
    console.log(uuidInput.value);

    let qrForm = document.querySelector("#qrForm");
    
    qrForm.style.display = "block";
    console.log(qrForm);
    
    
    fetch("https://newlibre.com/QRCodeGen/QREncoder/GetBase64QR?inText=" + uuidInput.value)
        .then(response => response.text())
        .then(data => qrImage.src="data:image/png;base64," + data)
        .then(qrFormIsVisible = true);
}

function body_mouseup(){
    if (qrFormIsVisible){
        let qrForm = document.querySelector("#qrForm");
        qrForm.style.display = "none";
        qrFormIsVisible = false;
    }
}