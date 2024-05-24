//--------------------------------------------------------------------------------EVENT LISTENERS-------------------------------------------------------------------------
if(selectedMode === 'custom'){
    document.getElementById('start').addEventListener("click", function(){
        if(round !== 1 && gameStarted)
            return;
        
        reset(false);
        start();
    });
} else {
    document.addEventListener("DOMContentLoaded", start);
}

document.querySelectorAll(".color_button").forEach(function (element) {
    element.addEventListener("click", function (event) {
        const clickedColor = event.target.id;
        if (currentAttempt.length < columns) {
            //trovo prima cella vuota in currentAttempt
            const emptyIndex = findEmptyPin();
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

//--------------------------------------------------------------------------FUNZIONI DI UTILITA'-----------------------------------------------------------------------------

// Cambia colore del singolo pin in base al numero indice del colore selezionato
function changePinColor(pinNum, colorInd, id) {
    if(!gameStarted) return;

    const pinContainer = document.getElementById(id);

    if (pinContainer && pinNum >= 1 && pinNum <= columns) {
        const pin = pinContainer.querySelector(`div:nth-child(${pinNum})`);

        if (pin) {
            switch (colorChoices[colorInd]) {
                case "red":
                    pin.style.backgroundColor = "#ff8097";
                    break;
                case "orange":
                    pin.style.backgroundColor = "#ffa66b";
                    break;
                case "yellow":
                    pin.style.backgroundColor = "#ffe992";
                    break;
                case "blue":
                    pin.style.backgroundColor = "#92d6e2";
                    break;
                case "green":
                    pin.style.backgroundColor = "#9fec98";
                    break;
                case "purple":
                    pin.style.backgroundColor = "#a38add";
                    break;
            }
        }
    }
}

//identifica in base all'id del colore cliccato, il suo indice nell'array dei colori
function indexOfClickedColor(clickedId) {
    let color_id;
    switch (clickedId) {
        case "red":
            color_id = 0;
            break;
        case "blue":
            color_id = 1;
            break;
        case "green":
            color_id = 2;
            break;
        case "yellow":
            color_id = 3;
            break;
        case "purple":
            color_id = 4;
            break;
        case "orange":
            color_id = 5;
            break;
    }
    return color_id;
}
//inserisce nell'array currentAttempt l'indice del colore cliccato
function colorClicked(id) {
    if(!gameStarted) return;

    switch (id) {
        case "red":
            currentAttempt.push(0);
            break;
        case "blue":
            currentAttempt.push(1);
            break;
        case "green":
            currentAttempt.push(2);
            break;
        case "yellow":
            currentAttempt.push(3);
            break;
        case "purple":
            currentAttempt.push(4);
            break;
        case "orange":
            currentAttempt.push(5);
            break;
    }
}

//svuota il tentativo corrente
function clearAnswer() {
    for (let i = 1; i <= columns; i++) {
        const pin = document.querySelector(`#current div:nth-child(${i})`);
        pin.style.backgroundColor = "rgb(106, 74, 57)";
    }
}

function changeAllToBlank() {
    for (let i = 1; i <= rws; i++) {
        for (let j = 1; j <= columns; j++) {
            const pin = document.querySelector(`#bet${i} div:nth-child(${j})`);
            pin.style.backgroundColor = "rgb(106, 74, 57)";
        }
    }
    for (let i = 1; i <= rws; i++) {
        for (let j = 1; j <= columns; j++) {
            const pin = document.querySelector(`#hint${i} div:nth-child(${j})`);
            pin.style.backgroundColor = "rgb(106, 74, 57)";
            pin.style.borderColor = "rgb(248, 248, 248)"
        }
    }
    for (let i = 1; i <= columns; i++) {
        const pin = document.querySelector(`#current div:nth-child(${i})`);
        pin.style.backgroundColor = "rgb(106, 74, 57)";

        const ans = document.querySelector(`#hidden div:nth-child(${i})`);
        ans.style.backgroundColor = "rgb(192, 174, 150)";
    }
}

function findEmptyPin() {
    let emptyPin;
    for (let i = 0; i > columns-1; i++) {
        if (currentAttempt[i] == null) {
            emptyPin = i;
        }
    }
    return emptyPin;
}

//colora i pin di risultato
function changeResultPins() {
    results.forEach((element, i) => {
        const pin = document.querySelector(`#hint${round} div:nth-child(${i + 1})`);
        pin.style.backgroundColor = element;
        pin.style.borderColor = element;
    });
}

//colora i pallini dei tentativi
function changeRoundPins() {
    const id = "bet" + round;
    const pinBg = document.querySelector("#b" + round);
    if (pinBg.style.backgroundColor === "" || pinBg.style.backgroundColor === "rgb(106, 74, 57)") {
        //se il primo pin di una riga è vuoto, la riga è vuota e quindi la riempio con la risposta corrente
        currentAttempt.forEach((element, i) => {
            changePinColor(i + 1, element, id);
        });
    }
}

//mostra livello e punteggio
function show(){
    if(selectedMode === "competitive"){
        const liv = document.getElementById("level");
        const pun = document.getElementById("points");
        
        translate(["levelText", "pointsText"]);

        liv.textContent = level;
        pun.textContent = points;
    }
}

//------------------------------------------------------------------------------FUNZIONI DI GIOCO-------------------------------------------------------------------------
//avvio il gioco
function start(){
    setHiddenComb(allowDuplicates);
    if(round == 1){
        translate(["comment"], "newMatch");
        feedback = "newMatch";

        if(selectedMode == 'competitive')
            show();
    }
    gameStarted = true;
}

// Creo combinazione casuale da indovinare
function setHiddenComb(allowDuplicates) {
    hiddenComb = []; // Svuota eventuale combinazione precedente
    let availableColors = [0, 1, 2, 3, 4, 5];

    for (let i = 0; i < columns; i++) {
        let colorIndex;

        if (allowDuplicates) {
            // Se sono ammessi duplicati oppure sono finiti i colori inediti allora scelta random tra tutti i colori
            colorIndex = Math.floor(Math.random() * 6);
        } else {
            // Se i duplicati non sono ammessi allora rimuove quel colore dall'elenco dei disponibili
            const randomIndex = Math.floor(Math.random() * availableColors.length);
            colorIndex = availableColors[randomIndex];
            availableColors.splice(randomIndex, 1);
        }
        hiddenComb.push(colorIndex);
    }
}

//confronto risposta attuale con combinazione segreta
function checkWin() {
    let equals = 0;

    hiddenComb.forEach((element, i) =>{
        if (element == currentAttempt[i])
            equals++;
    })

    if(equals === columns){
        win = true;
    }
    else {
        win = false;
        if (round !== rows) {
            translate(["comment"], "wrongAttempt");
            feedback = "wrongAttempt";
            currentAttempt = [];
        }
    }
    return win;
}

//carico la partita nel database al termine della stessa
function gameEnded(victory){
    gameStarted = false;
    
    let current_date = new Date();
    const record = {
        mode: selectedMode,
        level: level,
        points: points,
        date: current_date.toISOString().split('T')[0],
        victory: victory
    };
    
    fetch('PHP/Back/gameBack.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
    })
    .then(response => response.json())
    .then(data => {
        //aggiorno classifica
        if(selectedMode !== "custom"){
            console.log('Outcome:', data['status']);
            destroyTable();
            fetchDataAndCreateTable();
        }
    })
}

function getGuessResults() {
    //crea copia array da confrontare
    let ans = Array.from(hiddenComb);
    let gs = Array.from(currentAttempt);

    //cerca pin neri e salva sia l'indice del confronto che li ha generati in indexOfCorrect, sia la loro presenza nell'array results
    gs.forEach((element, i) => {
        if (element == ans[i]) {
            indexOfCorrect.push(i);
            results.push("black");
        }
    });

    //rimuove gli elementi avente indice in removeItems per evitare che vengano valutati nel ciclo dei bianchi
    const removeItems = indexOfCorrect.reverse();
    removeItems.forEach((element) => {
        ans.splice(element, 1);
        gs.splice(element, 1);
    });

    gs.sort();
    ans.sort();

    //cerca pin bianchi tra gli elementi rimanenti e rimuove da ans l'elemento se è presente in gs
    gs.forEach((element) => {
        if (ans.includes(element)) {
            results.push("white");
            const indOfEl = ans.indexOf(element);
            ans.splice(indOfEl, 1);
        }
    });

    changeResultPins();
    results = [];
    indexOfCorrect = [];
}

// gestisce le consegueze del click su "valuta"
function check() {

    if (currentAttempt.length === hiddenComb.length) {

        getGuessResults();  //calcolo e coloro i pin di risultato
        changeRoundPins();  //copio il tentativo attuale nella prima riga libera
        clearAnswer();      //svuoto la riga tentativo attuale
        checkWin();         //controllo se la combinazione appena inserita è quella vincente

        if (win || round === rows) {
            //fermo il gioco e svelo la combinazione
            document.getElementById("check").removeEventListener("click", check);
            hiddenComb.forEach((element, i) => {
                changePinColor(i + 1, element, "hidden");
            });

            if (win) {
                translate(["comment"], "winner");
                feedback = "winner";

                if(selectedMode === "competitive"){
                    //calcolo punteggio
                    if(round === 1) points += (rows*10)+10;
                    else points += ((rows-round+1)*10);
                    
                    const temp = level+1;
                    const temp2 = points;

                    //nuova partita
                    reset(true);
                    level = temp;
                    points = temp2;
                    show();
                }else{
                    gameEnded(true);
                }
            } else {
                translate(["comment"], "loser");
                feedback = "loser";

                const outcome = (selectedMode === "competitive" && level > 1) ? true : false;
                gameEnded(outcome);
            }

            if (selectedMode === "competitive"){
                // ogni 10 livelli, fino a che non rimangono 5 soli tentativi, viene rimossa una possibilità
                if(((level)%10) === 0 && rows-1 > 5){
                    removeBoard();
                    rows--;
                    createBoard(rows, columns);
                    reinstateListeners();
                }
            }
        } else {
            round++;
        }
    } else {
        translate(["comment"], "notEnoughCol");
        feedback = "notEnoughCol";
    }
}

// resetta la partita e quindi la avola di gioco
function reset(winning) {
    hiddenComb = [];
    currentAttempt = [];
    indexOfCorrect = [];
    round = 1;
    results = [];
    translate(["comment"], "waitForStart");
    feedback = "waitForStart";
    win = undefined;
    gameStarted = false;

    if(selectedMode === "competitive"){
        removeBoard();
        createBoard(rows, columns);
        reinstateListeners();

        if(winning) {
            start();
        }
        else {
            level = 1;
            points = 0;
            consWins = 0;
        }
    } else{
        changeAllToBlank();
    }
}