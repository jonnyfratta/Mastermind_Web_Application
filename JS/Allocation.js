//----------------------------------------------------------------------------EVENT LISTENERS----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function(){
    langListeners();
    const lan = getLanguage();
    handleTranslation();

    setCookie('language', lan, 1);
});

document.getElementById("return").addEventListener("click", function(){
    if(selectedMode === 'competitive' && round > 1 && level > 1){
        const outcome = (level > 1) ? true : false;
        gameEnded(outcome);
    }

    window.location.href="index.php";

});

document.getElementById("langMod").addEventListener("click", function(event){
    const lan = checkLang(event.target);
    if(!lan) return;

    setCookie('language', lan, 1);
    handleTranslation();

    feedback = (selectedMode === "custom" && !gameStarted) ? "void" : feedback;
    handleMessage();

    if(selectedMode !== "custom")
        translateLeaderboard();
});

document.getElementById("check").addEventListener("click", function(){
    if(!gameStarted) return;
    check();
    return;
});

document.getElementById("clear").addEventListener("click", function () {
    if(!gameStarted) return;

    currentAttempt.pop();
    let x = currentAttempt.length;

    let id = document.querySelector(`[id="${x + 1}"]`);

    if (id) {
        id.style.backgroundColor = "rgb(106, 74, 57)";
    } else {
        console.error(`Invalid id: ${x + 1}`);
    }

    return;
});

document.getElementById("reset").addEventListener("click", function(){
    if (selectedMode === "competitive"){
        if(level !== 1 && gameStarted) {
            const message = getAlert(1); 
            let confirm = window.confirm(message);
            if(!confirm)
                return;
        }        
    }

    reset(false);
    start();
});
//---------------------------------------------------------------------------ALLOCAZIONE RISORSE-------------------------------------------------------------------------
const colorChoices = ["red", "blue", "green", "yellow", "purple", "orange"]; //colori selezionabili
let hiddenComb = [];                     //combinazione segreta
let currentAttempt = [];                 //risposta corrente
let indexOfCorrect = [];                 //array che contiene gli indici dei colori giusti nella posizione giusta
let round = 1;
let results = [];                        //array che contiene i pin di risultato da colorare
let feedback;                            //tipo di messaggio mostrato
let win;              
let gameStarted;                         //ricorda se la partita è attualmente attiva oppure no

let rows = 10;
let columns = 4;
let rws = rows;                          //ricorda il numero di righe totali quando rows viene decrementata
createBoard(rows, columns);

let allowDuplicates = false;

//modalità competitiva
let level = 1;
let points = 0;

// Identifica modalità selezionata
const urlParams = new URLSearchParams(window.location.search);              
const selectedMode = urlParams.get('mode');                     //identifica in quale modalità ci troviamo

//--------------------------------------------------------------------------FUNZIONI DI UTILITA'-----------------------------------------------------------------------------

//si occupa della traduzione di tutto il testo fisso
function handleTranslation(){
    switch(selectedMode){
        case "competitive":
            translate(["case1", "case2", "scoreView", "streakView","levelText", "pointsText",  "reset", "check", "clear"]);
            translate(["welcome", "usernameLabel", "pwLabel", "log", "reg"], -1, "loginForm");
            break;
    
        case "custom":
            translate(["case1", "case2", "combLabel", "rowLabel", "columnLabel", "reset", "start", "check", "clear"]);
            translate(["welcome", "usernameLabel", "pwLabel", "log", "reg"], -1, "loginForm");
            break;
    
        default: 
            translate(["case1", "case2", "combLabel", "reset", "check", "clear"]);
            translate(["welcome", "usernameLabel", "pwLabel", "log", "reg"], -1, "loginForm");
            break; 
    }
}

function handleMessage(){
    translate(['comment'], feedback);
}

//riassegna listener on click ai bottoni di selezione colore
function reinstateListeners(){
    document.querySelectorAll(".color_button").forEach(function (element) {
        element.addEventListener("click", function (event) {
            const clickedColor = event.target.id;
            if (currentAttempt.length < columns) {
                //trovo prima cella vuota in currentAttempt
                let emptyIndex = findEmptyPin();
                if (emptyIndex !== -1) {
                    currentAttempt[emptyIndex] = indexOfClickedColor(clickedColor);
                }
    
                colorClicked(clickedColor); //inserisco nell'array currentAttempt
                
                changePinColor(currentAttempt.length, indexOfClickedColor(clickedColor), "current"); //coloro il pallino
            } else {
                translate(["comment"], "tooManyCol");
                feedback = "tooManyCol";
            }
        });
    });
}

function removeElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function recreateBoard(value, what){
    removeBoard();
    //il parametro what a 0 indica che va cambiato il numero di righe, se invece è a 1 va cambiato il numero di colonne
    if(!what){ 
        rows = parseInt(value);
        rws = rows;
    }else{
        columns = parseInt(value);
    }
    createBoard(rows, columns);
    reinstateListeners();
    reset(false);
}

//----------------------------------------------------------------------------GESTIONE SCHERMATA-------------------------------------------------------------------------
if(selectedMode === "custom"){
    //caso in cui venga cambiato il numero di righe
    document.getElementById("rows").addEventListener("change", function () {
        if(round === 1 || !gameStarted){
            recreateBoard(parseInt(this.value), 0);
        }
        else{
            //la partita è già iniziata da più di un turno, si chiede all'utente il permesso di resettare la tabella
            const message = getAlert(0); 
            const confirmation = window.confirm(message);
            if (confirmation) {
                recreateBoard(parseInt(this.value), 0);
            } else {
                return;
            }
        }
    });
    
    //caso in cui venga cambiato il numero di colonne
    document.getElementById("columns").addEventListener("change", function () {
        if(round === 1 || !gameStarted){
            recreateBoard(parseInt(this.value), 1);
        }
        else{
            const message = getAlert(0); 
            const confirmation = window.confirm(message);
            if (confirmation) {
                recreateBoard(parseInt(this.value), 1);
            } else {
                return;
            }
        }
    });
} else{
    document.getElementById("chart").addEventListener('click', function () {
        const leaderboard = document.getElementById('leaderboard');
        const chart = document.getElementById('chart');
        const choice = document.querySelector('.choice');

        if (!chart.classList.contains('clicked')) {
            //la classifica è nascosta e va mostrata
            leaderboard.style.opacity = '1';
            leaderboard.style.visibility = 'visible';
            chart.classList.add('clicked');
            
            if(selectedMode === 'competitive'){
                //mostro anche i tasti di selezione classifica
                choice.style.opacity = '1';
                choice.style.visibility = 'visible';
            }
        }
        else {
            //la classifica è mostrata e va nascosta
            leaderboard.style.opacity = '0';
            leaderboard.style.visibility = 'hidden';
            chart.classList.remove('clicked');

            if(selectedMode === 'competitive'){
                //nascondo anche i tasti di selezione classifica
                choice.style.opacity = '0';
                choice.style.visibility = 'hidden';
            }
        }
    });
}

if(selectedMode !== "competitive"){
    //se non sono in competitiva abilito pulsante per presenza multipla colori
    const comb = document.getElementById("combinations");
    comb.addEventListener("change", function(){
        if(round === 1)
            if(comb.checked) allowDuplicates = true;
            else allowDuplicates = false;
        else{
            const message = getAlert(0); 
            const confirmation = window.confirm(message);
            
            if (confirmation) {
                if(comb.checked) allowDuplicates = true;
                else allowDuplicates = false;
                reset(false);
            } else {
                if(comb.checked) comb.checked = false;
                else comb.checked = true;
                return;
            }
        }
    });
}else{
    //in competitiva invece lo abilito automaticamente 
    if(level >= 25) 
        allowDuplicates = true;
}

//------------------------------------------------------------------------------GESTIONE BOARD----------------------------------------------------------------------------
function removeBoard() {
    // Rimuovo la combinazione da indovinare
    const hidden = document.getElementById("hidden");
    removeElements(hidden);

    // Rimuovo gli elementi dal corpo centrale
    const box = document.getElementById("box");
    removeElements(box);

    // Rimuovo la riga della risposta corrente (ultima in basso)
    const current = document.getElementById("current");
    removeElements(current);

    // Rimuovo i pulsanti di selezione colore
    const colorButtons = document.querySelectorAll('.color_button');
    colorButtons.forEach(function (button) {
        button.remove();
    });
}

function createBoard (rows, columns){    
    //creazione prima riga
    createRow(rows+1, rows, columns);

    //creazione corpo centrale (tentativi)
    for (let i = rows-1; i >= 0; i--)
        createRow(i+1, rows, columns);

    //creazione ultima riga
    createRow(0, rows, columns);

    //gestisco styling dei tentativi
    const elPinContainer = document.querySelectorAll(".attempt");
    elPinContainer.forEach(function(element) {
        element.style.gridTemplateColumns = 'repeat(' + columns + ', 1fr)';

        if(element.id !== "hidden" && element.id !== "bet1" && element.id !== "current")
        element.style.borderBottom = "1px dashed #d7b791";
    });

    //gestisco styling dei risultati
    const elAnsContainer = document.querySelectorAll(".outcome");
    elAnsContainer.forEach(function(element) {
        element.style.gridTemplateColumns = 'repeat(' + (columns/2) + ', 1fr)';
        if (element.id !== "color_selection" && element.id !== "hint1") {
            element.style.borderBottom = "1px dashed #d7b791";
        }
    });

    //sistemo il selettore di colori su due righe e 3 colonne
    const colors = document.getElementById("color_selection");
    colors.style.gridTemplateColumns = 'repeat(3, 1fr)';
    colors.style.gridTemplateRows = 'repeat(2, 1fr)';
}

function createRow(i, rows, columns){
    if(i === rows+1){
        //crea riga combinazione da indovinare
        const combinazione = document.getElementById('hidden');
        combinazione.parentElement.classList.add("row");

        for (let j = 0; j < columns; j++){
            const p = createPin(i, rows, j, 0);
            combinazione.appendChild(p);
        }
        return;
    }else if (!i){
        //crea riga risposta corrente
        const risposta = document.getElementById('current');
        risposta.parentElement.classList.add("row");

        for (let j = 0; j < columns; j++) {
            const p = createPin(i, rows, j, 0);
            p.id = String(j+1);
            risposta.appendChild(p);
        }

        //crea slot selezione colori
        const selezione = document.getElementById('color_selection');
        for (let c of colorChoices){
            const q = document.createElement("button");
            q.className = 'color_button';
            q.id = c;
            selezione.appendChild(q);
        }
        return;
    }

    //box centrale
    const bodyRow = document.getElementById("box");

    const rw = document.createElement("tr");
    rw.classList.add('row');

    //sinistra
    const container = document.createElement("td");
    container.classList.add('attempt');
    container.id = 'bet' + i
    rw.appendChild(container);

    //crea pallini sinistra
    for (let j = 0; j < columns; j++) {
        const p = createPin(i, rows, j, 0);
        container.appendChild(p);
    }

    //destra
    const container2 = document.createElement("td");
    container2.classList.add('outcome');
    container2.id = 'hint' + i;
    rw.appendChild(container2);

    //crea pallini piccoli a destra
    for (let j = 0; j < columns; j++) {
        const p = createPin(i, rows, j, 1);
        container2.appendChild(p);
    }

    bodyRow.appendChild(rw);
}

//Parametri: i(numero di riga decrescente),
//           rows(numero di righe della board)
//           j(numero colonna corrente)
//           lato(0 = sinistra, 1 = destra)
function createPin(i, rows, j, lato){
    if(!lato){
        const big = document.createElement("div");
        big.className = 'big_pin';
        
        //tutte le righe tranne quella di risposta sono identificate dall'id del primo pallino
        if(!j && i !== rows+1) big.id = 'b' + i;
        return big;
    }

    const small = document.createElement("div");
    small.className = 'small_pin';
    return small;
}