
let localJEntries = [];

function addJournalEntries(){

    let at = document.querySelector("#journalEntryTable");

    let utasks = document.querySelector("#journalentries");
    if (utasks != null) {utasks.remove();}
    
    let elx = document.createElement("tbody");
    elx.setAttribute("id","journalentries");
    at.append(elx);
    
    let postData = new FormData();
    postData.append("uuid", currentUuid);
    fetch(`${baseUrl}JournalEntry/GetAll`, {
        method: 'POST',
        body: postData,
        })
        .then(response => response.json())
        .then(allJournalEntries => {
            localJEntries = allJournalEntries;            
            displayUserTaskTable(allJournalEntries, "#journalentries");
        });
    // displayUserTaskTable(fakeData, "#journalentries");
}

function addEntry(){
    
    localJEntries.push({id:0,title:"",note:null,created: new Date().yyyymmdd(),updated:null});
    
    displayUserTaskTable(localJEntries, "#journalentries");
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