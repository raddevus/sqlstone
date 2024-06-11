function addJournalEntries(){

    let at = document.querySelector("#journalEntryTable");

    let utasks = document.querySelector("#journalentries");
    if (utasks != null) {utasks.remove();}
    
    let elx = document.createElement("tbody");
    elx.setAttribute("id","journalentries");
    at.append(elx);
    
    let fakeData = [];
    fakeData.push({title:"first one",note:"first data",created:"2024-04-04",updated:null});
    // fetch(`${urlRoot}${getAllJournalEntries}`, {
    //     method: 'POST',
    //     })
    //     .then(response => response.json())
    //     .then(allUserTasks => displayUserTaskTable(allUserTasks.allUserTasks, "#journalentries"));
    displayUserTaskTable(fakeData, "#journalentries");
}

function displayUserTaskTable(journalEntries, rootElement){
    console.log(`userTasks ${JSON.stringify(journalEntries)}`);
    //initUserTaskTable();
    ReactDOM.render(
        // We are passing in just the tasks - not the outer object 
        // which includes the success property
        JournalEntryTable (journalEntries),
        document.querySelector(rootElement),
        hideWaitCursor("#history-spinner")
    );
}


function hideWaitCursor(waitCursorId){
    document.querySelector(waitCursorId).classList.add("k-hidden");
}