const saveEntry = "JournalEntry/Save"

const JournalEntryTable = function(journalEntries){

    console.log(journalEntries[0]);
    
     let allItems = [];

    for (let x=0; x < journalEntries.length;x++){
        console.log(`journalEntries[${x}].note: ${journalEntries[x].note}`);
        let currentId = journalEntries[x].id;
        allItems.push( React.createElement("tr",{key:x, id:journalEntries[x].id},
        
        React.createElement("td",{id:`title-${currentId}`}, journalEntries[x].title),
        React.createElement("td",{width:"150px"}, 
            React.createElement("textarea",{id:`note-${currentId}`},journalEntries[x].note)),
        React.createElement("td",{width:"150px"},
            React.createElement("button", {onClick: this.handleSaveClick.bind(this)},"Save")),
        React.createElement("td",{id:`created-${currentId}`,width:"150px"},  new Date(journalEntries[x].created).yyyymmdd()),
        React.createElement("td",{width:"150px"}, journalEntries[x].updated)
        
            )
       );
    }
    return allItems.reverse();
}

function handleSaveClick(e){
    
    var entryId = 0;
    if (e.target.type == undefined){
        console.log(`e: ${e.target.parentElement.id}`);
        entryId = e.target.parentElement.id;
        return;
    }
    else{
        console.log(`e: ${e.target.parentElement.parentElement.id}`);
        entryId = e.target.parentElement.parentElement.id;
    }
    console.log(`entryId: ${entryId}`);
    var currentTitleText = document.querySelector(`#title-${entryId}`).textContent;
    var titleText = prompt("Please enter a title for the Journal Entry", currentTitleText);
    
    if (titleText != null){
        console.log(`I got that thing: ${titleText}`);
        document.querySelector(`#title-${entryId}`).textContent = titleText;
    }

    console.log(`entryId : ${entryId}`);

    // Do you want to save a completed date?

    var formData = new FormData();
//06-17    formData.append(uuid,{"uuid":currentUuid});
    formData.append("uuid",currentUuid);

    
    let noteText = document.querySelector(`#note-${entryId}`).value;
    let createdDate = document.querySelector(`#created-${entryId}`).textContent;
    
    console.log(`noteText: ${noteText}`);

    var jentry = {
        Id:entryId,
        Title: titleText,
        Note: noteText,
        Created: createdDate,
        Updated: null
    };

    console.log(`${JSON.stringify(jentry)}`);
    
    for (var key in jentry) {
        formData.append(key, jentry[key]);
    }
    // console.log(`formData - Id: ${formData.get("Id")}`);
    // formData.append("jentry",{Id:0,Title:titleText,Note:noteText,Created:createdDate,Updated:null});

    // var result = confirm("Would you like to set the COMPLETED date?\nOK = YES (Save completed date) or \nCancel = NO (Just save Note)");

    // if (result){
    //     var completedDate = new Date().yyyymmdd();
    //     formData.append("completed",completedDate);
    //     document.querySelector(`#completed-${entryId}`).innerHTML = completedDate;
    // }
   
    console.log(`finalURL: ${baseUrl}${saveEntry}`);

    fetch(`${baseUrl}${saveEntry}`,
	{
    	method: 'POST',
    	body:formData,
        
	
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success == false){
                alert("## ERROR! ##\nYour data couldn't be saved.\nPlease make sure you've registered your UUID.");
            }
            else{
                alert("You're data has been saved successfully.");
            }
        
            });


    global_e = e; // global_e used for debugging
}