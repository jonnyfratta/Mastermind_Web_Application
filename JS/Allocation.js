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
//---------------------------------------------------------------------------RESOURCE ALLOCATION-------------------------------------------------------------------------
const colorChoices = ["red", "blue", "green", "yellow", "purple", "orange"]; //selectable colors
let hiddenComb = [];                     //secret combination
let currentAttempt = [];                 //current guess
let indexOfCorrect = [];                 //indexes of colors that are correct and in the correct position
let round = 1;
let results = [];                        //result pins to color
let feedback;                            //currently displayed feedback type
let win;              
let gameStarted;                         //whether a game is currently active

let rows = 10;
let columns = 4;
let rws = rows;                          //store total rows even when rows is decremented
createBoard(rows, columns);

let allowDuplicates = false;

//competitive mode
let level = 1;
let points = 0;

// Identify selected mode
const urlParams = new URLSearchParams(window.location.search);              
const selectedMode = urlParams.get('mode');                     //identify the selected mode

//--------------------------------------------------------------------------UTILITY FUNCTIONS'-----------------------------------------------------------------------------

//translate all static text
function handleTranslation(){
    switch(selectedMode){
        case "competitive":
            translate(["case1", "case2", "case3", "case4", "scoreView", "streakView","levelText", "pointsText",  "reset", "check", "clear"]);
            translate(["welcome", "usernameLabel", "pwLabel", "log", "reg"], -1, "loginForm");
            break;
    
        case "custom":
            translate(["case1", "case2", "case3", "case4", "combLabel", "rowLabel", "columnLabel", "reset", "start", "check", "clear"]);
            translate(["welcome", "usernameLabel", "pwLabel", "log", "reg"], -1, "loginForm");
            break;
    
        default: 
            translate(["case1", "case2", "case3", "case4", "combLabel", "reset", "check", "clear"]);
            translate(["welcome", "usernameLabel", "pwLabel", "log", "reg"], -1, "loginForm");
            break; 
    }
}

function handleMessage(){
    translate(['comment'], feedback);
}

//re-attach click listeners to color selection buttons
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
    //if `what` is 0 update rows, if 1 update columns
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

//----------------------------------------------------------------------------SCREEN HANDLING-------------------------------------------------------------------------
if(selectedMode === "custom"){
    //when the row count changes
    document.getElementById("rows").addEventListener("change", function () {
        if(round === 1 || !gameStarted){
            recreateBoard(parseInt(this.value), 0);
        }
        else{
            //the game has already started; ask the user to confirm resetting the board
            const message = getAlert(0); 
            const confirmation = window.confirm(message);
            if (confirmation) {
                recreateBoard(parseInt(this.value), 0);
            } else {
                return;
            }
        }
    });
    
    //when the column count changes
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
            //leaderboard is hidden and should be shown
            leaderboard.style.opacity = '1';
            leaderboard.style.visibility = 'visible';
            chart.classList.add('clicked');
            
            if(selectedMode === 'competitive'){
                //show leaderboard selection tabs as well
                choice.style.display = 'flex';
                choice.style.opacity = '1';
                choice.style.visibility = 'visible';
            }
        }
        else {
            //leaderboard is visible and should be hidden
            leaderboard.style.opacity = '0';
            leaderboard.style.visibility = 'hidden';
            chart.classList.remove('clicked');

            if(selectedMode === 'competitive'){
                //hide leaderboard selection tabs as well
                choice.style.opacity = '0';
                choice.style.visibility = 'hidden';
                choice.style.display = 'none';
            }
        }
    });
}

if(selectedMode !== "competitive"){
    //outside competitive mode, enable the duplicate-colors toggle
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
    //in competitive mode, enable it automatically 
    if(level >= 25) 
        allowDuplicates = true;
}

//------------------------------------------------------------------------------BOARD HANDLING----------------------------------------------------------------------------
function removeBoard() {
    //remove the hidden combination row
    const hidden = document.getElementById("hidden");
    removeElements(hidden);

    //remove elements from the central body
    const box = document.getElementById("box");
    removeElements(box);

    //remove the current guess row (bottom row)
    const current = document.getElementById("current");
    removeElements(current);

    //remove color selection buttons
    const colorButtons = document.querySelectorAll('.color_button');
    colorButtons.forEach(function (button) {
        button.remove();
    });
}

function createBoard (rows, columns){    
    //create first row
    createRow(rows+1, rows, columns);

    //create central body (attempts)
    for (let i = rows-1; i >= 0; i--)
        createRow(i+1, rows, columns);

    //create last row
    createRow(0, rows, columns);

    //set attempts styling
    const elPinContainer = document.querySelectorAll(".attempt");
    elPinContainer.forEach(function(element) {
        element.style.gridTemplateColumns = 'repeat(' + columns + ', 1fr)';

        if(element.id !== "hidden" && element.id !== "bet1" && element.id !== "current")
        element.style.borderBottom = "1px dashed #d7b791";
    });

    //set results styling
    const elAnsContainer = document.querySelectorAll(".outcome");
    elAnsContainer.forEach(function(element) {
        element.style.gridTemplateColumns = 'repeat(' + (columns/2) + ', 1fr)';
        if (element.id !== "color_selection" && element.id !== "hint1") {
            element.style.borderBottom = "1px dashed #d7b791";
        }
    });

    //set the color selector to 2 rows and 3 columns
    const colors = document.getElementById("color_selection");
    colors.style.gridTemplateColumns = 'repeat(3, 1fr)';
    colors.style.gridTemplateRows = 'repeat(2, 1fr)';
}

function createRow(i, rows, columns){
    if(i === rows+1){
        //create hidden combination row
        const hiddenCombination = document.getElementById('hidden');
        hiddenCombination.parentElement.classList.add("row");

        for (let j = 0; j < columns; j++){
            const p = createPin(i, rows, j, 0);
            hiddenCombination.appendChild(p);
        }
        return;
    }else if (!i){
        //create current guess row
        const currentGuessRow = document.getElementById('current');
        currentGuessRow.parentElement.classList.add("row");

        for (let j = 0; j < columns; j++) {
            const p = createPin(i, rows, j, 0);
            p.id = String(j+1);
            currentGuessRow.appendChild(p);
        }

        //create color selection slots
        const colorSelection = document.getElementById('color_selection');
        for (let c of colorChoices){
            const q = document.createElement("button");
            q.className = 'color_button';
            q.id = c;
            colorSelection.appendChild(q);
        }
        return;
    }

    //central box
    const bodyRow = document.getElementById("box");

    const rw = document.createElement("tr");
    rw.classList.add('row');

    //left side
    const container = document.createElement("td");
    container.classList.add('attempt');
    container.id = 'bet' + i
    rw.appendChild(container);

    //create left pins
    for (let j = 0; j < columns; j++) {
        const p = createPin(i, rows, j, 0);
        container.appendChild(p);
    }

    //right side
    const container2 = document.createElement("td");
    container2.classList.add('outcome');
    container2.id = 'hint' + i;
    rw.appendChild(container2);

    //create small right pins
    for (let j = 0; j < columns; j++) {
        const p = createPin(i, rows, j, 1);
        container2.appendChild(p);
    }

    bodyRow.appendChild(rw);
}

//Parameters: i (descending row index),
//            rows (total board rows),
//            j (current column index),
//            side (0 = left, 1 = right)
function createPin(i, rows, j, side){
    if(!side){
        const big = document.createElement("div");
        big.className = 'big_pin';
        
        //all rows except current guess are identified by their first pin id
        if(!j && i !== rows+1) big.id = 'b' + i;
        return big;
    }

    const small = document.createElement("div");
    small.className = 'small_pin';
    return small;
}
