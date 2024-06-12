let fakeData = [];
fakeData.push({id:0,title:"first one",note:"first data",created:"2024-04-04",updated:null});
fakeData.push({id:1,title:"2nd one",note:"Anyone running a small-biz SaaS & making $$$?",created:"2024-04-06",updated:null});
let fakeId = 2;

function addJournalEntries(){

    let at = document.querySelector("#journalEntryTable");

    let utasks = document.querySelector("#journalentries");
    if (utasks != null) {utasks.remove();}
    
    let elx = document.createElement("tbody");
    elx.setAttribute("id","journalentries");
    at.append(elx);
    
    // fetch(`${urlRoot}${getAllJournalEntries}`, {
    //     method: 'POST',
    //     })
    //     .then(response => response.json())
    //     .then(allUserTasks => displayUserTaskTable(allUserTasks.allUserTasks, "#journalentries"));
    displayUserTaskTable(fakeData, "#journalentries");
}

function addEntry(){
    
    fakeData.push({id:entryCount++,title:"",note:null,created: new Date().yyyymmdd(),updated:null});
    
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