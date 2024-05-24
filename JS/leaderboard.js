//----------------------------------------------------------------------------EVENT LISTENERS----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function(){
  destroyTable();
  fetchDataAndCreateTable();
});

let scoreView = true;   //variabile che decide quale tipo di classifica mostrare

if(selectedMode === "competitive"){
  const elem1 = document.getElementById("scoreView");
  const elem2 = document.getElementById("streakView");

  elem1.addEventListener("click", function(){
    //mostro la classifica per punteggio
      scoreView = true;
      if(elem2.classList.contains("clicked"))
          elem2.classList.remove("clicked");

      elem1.classList.add("clicked");
      destroyTable();
      fetchDataAndCreateTable();
    });
  elem2.addEventListener("click", function(){
    //mostro la classifica per vittorie consecutive
      scoreView = false;
      if(elem1.classList.contains("clicked"))
          elem1.classList.remove("clicked");

      elem2.classList.add("clicked");
      destroyTable();
      fetchDataAndCreateTable();
  });
}

//--------------------------------------------------------------------------FUNZIONI DI UTILITA'-----------------------------------------------------------------------------

//recupero le informazioni dal server e le uso per creare la classifica
function fetchDataAndCreateTable() {
  fetch("PHP/Back/lbBack.php?scoreView=" + scoreView)
    .then(response => response.json())
    .then(data => {
      createLboard(data);
    })
}

function destroyTable() {
  const leaderboardElement = document.getElementById("leaderboard");
  const tableElement = leaderboardElement.querySelector("table");

  if (tableElement)
    leaderboardElement.removeChild(tableElement);
}

function translateLeaderboard(){
  let subclass = "classic";
  
  if(selectedMode === "competitive"){
    subclass = (scoreView) ? "scoreView" : "streakView";
  }
  
  translate(["position", "player"]);
  translate(['third'], subclass);
}

//------------------------------------------------------------------------------GESTIONE LEADERBOARD----------------------------------------------------------------------------
function createLboard(data) {
  const table = document.createElement("table");

  //alloco l'header della tabella
  const header = document.createElement("thead");

  table.appendChild(header);

  const headerRow = header.insertRow();

  const positionHeader = document.createElement("th");
  positionHeader.id = "position";
  const usernameHeader = document.createElement("th");
  usernameHeader.id = "player";
  const thirdColumnHeader = document.createElement("th");
  thirdColumnHeader.id = "third";

  headerRow.appendChild(positionHeader);
  headerRow.appendChild(usernameHeader);
  headerRow.appendChild(thirdColumnHeader);

  if(selectedMode !== 'classic' && selectedMode !== 'competitive'){
    table.style.display = "none";
    return;
  }

  translateLeaderboard();

  //alloco il corpo della tabella
  const user = document.getElementById("user");

  const bodyBox = document.createElement("tbody");
  table.appendChild(bodyBox);

  for (let i = 0; i < data.length; i++) {
    const row = bodyBox.insertRow();

    const positionCell = row.insertCell();
    const usernameCell = row.insertCell();
    const thirdColumnCell = row.insertCell();

    positionCell.textContent = data[i]["position"];
    usernameCell.textContent = data[i]["player"];
    thirdColumnCell.textContent = data[i]["third"];

    if(usernameCell.textContent === user.value){
      row.classList.add("highlighted");
    }
  }

  document.getElementById("leaderboard").appendChild(table);
}
