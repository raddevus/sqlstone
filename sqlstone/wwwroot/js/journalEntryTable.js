var entryCount = 0;

const JournalEntryTable = function(journalEntries){

    console.log(journalEntries[0]);
    
     let allItems = [];
    entryCount = 0;
    for (let x=0; x < journalEntries.length;x++){
        console.log(`journalEntries[${x}].note: ${journalEntries[x].note}`);
        allItems.push( React.createElement("tr",{key:x, id:journalEntries[x].id},
        
        React.createElement("td",null, journalEntries[x].title),
        React.createElement("td",{width:"150px"}, 
            React.createElement("textarea",{id:`note-${journalEntries[x].id}`},journalEntries[x].note)),
        React.createElement("td",{width:"150px"},
            React.createElement("button", {onClick: this.handleClick.bind(this)},"Save")),
        React.createElement("td",{width:"150px"},  new Date(journalEntries[x].created).yyyymmdd()),
        React.createElement("td",{width:"150px"}, journalEntries[x].updated)
        
            )
       );
       entryCount++;
       
    }
    return allItems.reverse();
}

function handleClick(e){
    var userTaskId = 0;
    if (e.target.type == undefined){
        console.log(`e: ${e.target.parentElement.id}`);
        userTaskId = e.target.parentElement.id;
        return;
    }
    else{
        console.log(`e: ${e.target.parentElement.parentElement.id}`);
        userTaskId = e.target.parentElement.parentElement.id;
    }
    
    // Do you want to save a completed date?

    var formData = new FormData();
    formData.append("userTaskId",userTaskId);
    let noteText = document.querySelector(`#note-${userTaskId}`).value;
    console.log(`noteText: ${noteText}`);
    formData.append("note",noteText);

    var result = confirm("Would you like to set the COMPLETED date?\nOK = YES (Save completed date) or \nCancel = NO (Just save Note)");

    if (result){
        var completedDate = new Date().yyyymmdd();
        formData.append("completed",completedDate);
        document.querySelector(`#completed-${userTaskId}`).innerHTML = completedDate;
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