const JournalEntryTable = function(journalEntries){

    console.log(journalEntries[0]);
    
     let allItems = [];

    for (let x=0; x < journalEntries.length;x++){
        console.log(`journalEntries[${x}].note: ${journalEntries[x].note}`);
        allItems.push( React.createElement("tr",{key:x, id:journalEntries[x].id},
        
        React.createElement("td",{id:`title-${journalEntries[x].id}`}, journalEntries[x].title),
        React.createElement("td",{width:"150px"}, 
            React.createElement("textarea",{id:`note-${journalEntries[x].id}`},journalEntries[x].note)),
        React.createElement("td",{width:"150px"},
            React.createElement("button", {onClick: this.handleClick.bind(this)},"Save")),
        React.createElement("td",{width:"150px"},  new Date(journalEntries[x].created).yyyymmdd()),
        React.createElement("td",{width:"150px"}, journalEntries[x].updated)
        
            )
       );
    }
    return allItems.reverse();
}

function handleClick(e){
    
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
    
    var promptValue = prompt("Please enter a title for the Journal Entry");

    if (promptValue != null){
        console.log(`I got that thing: ${promptValue}`);
        document.querySelector(`#title-${entryId}`).textContent = promptValue;
    }

    alert(`entryId : ${entryId}`);
    return;

    // Do you want to save a completed date?

    var formData = new FormData();
    formData.append("entryId",entryId);
    let noteText = document.querySelector(`#note-${entryId}`).value;
    console.log(`noteText: ${noteText}`);
    formData.append("note",noteText);

    var result = confirm("Would you like to set the COMPLETED date?\nOK = YES (Save completed date) or \nCancel = NO (Just save Note)");

    if (result){
        var completedDate = new Date().yyyymmdd();
        formData.append("completed",completedDate);
        document.querySelector(`#completed-${entryId}`).innerHTML = completedDate;
    }
    console.log(`finalURL: ${urlRoot}${updateUserTask}`)
    fetch(`${urlRoot}${updateUserTask}`,
	{
    	method: 'POST',
    	body:formData,
	
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            alert("You're data has been saved successfully.");
        
            });


    global_e = e; // global_e used for debugging
}