//--------------------------------------------------------------------------ALLOCAZIONE RISORSE---------------------------------------------------------------------------
const popUp = {
    it: ["Hai modificato la modalità di gioco. La partita verrà resettata con le nuove impostazioni. Premi OK per confermare o ANNULLA per tornare alla partita corrente:",
         "Cliccando su conferma perderai tutti i tuoi punti e ricomincerai dal livello 1. Vuoi davvero confermare?"],
    en: ["You have changed the game mode. The game will be reset with the new settings. Press OK to confirm or CANCEL to return to the current game:",
         "By clicking confirm, you will lose all your points and start again from level 1. Do you really want to confirm?"],
    es: ["Has cambiado el modo de juego. El juego se reiniciará con las nuevas configuraciones. Presiona OK para confirmar o CANCELAR para volver al juego actual:",
         "Al confirmar, perderás todos tus puntos y comenzarás de nuevo desde el nivel 1. ¿Realmente deseas confirmar?"],
    de: ["Du hast den Spielmodus geändert. Das Spiel wird mit den neuen Einstellungen zurückgesetzt. Drücke OK, um zu bestätigen, oder ABBRECHEN, um zum aktuellen Spiel zurückzukehren:",
         "Durch Bestätigen verlierst du alle deine Punkte und beginnst wieder bei Level 1. Möchtest du wirklich bestätigen?"],
    fr: ["Vous avez changé le mode de jeu. Le jeu sera réinitialisé avec les nouvelles paramètres. Appuyez sur OK pour confirmer ou ANNULER pour revenir au jeu en cours :",
         "En confirmant, vous perdrez tous vos points et recommencerez depuis le niveau 1. Voulez-vous vraiment confirmer ?"]
};

//--------------------------------------------------------------------------FUNZIONI DI UTILITA'-----------------------------------------------------------------------------

//restituisco il messaggio alert nella lingua corretta
function getAlert(type){
    const lan = getLanguage()
    return popUp[lan][type];
}

//alloco i listeners per il bottone di selezione lingue
function langListeners(){
    const langButton = document.getElementById('langButton');
    const langMod = document.getElementById("langMod");

    langButton.addEventListener('click', function () {
        if (langMod.style.opacity === '' || langMod.style.opacity === '0') {
            langMod.style.opacity = '1';
            langMod.style.visibility = 'visible';
        }
        langButton.classList.add('clicked');
    });

    //se clicco al di fuori del modal mentre è aperto, si chiude
    window.addEventListener('click', function (event) {
      if (langMod.style.visibility !== 'hidden' && event.target !== langButton) {
        langMod.style.visibility = 'hidden';
        langMod.style.opacity = '0';
        langButton.classList.remove('clicked');
      }
    });
}

//riconosco quale lingua è stata selezionata
function checkLang(target){
    const it = document.getElementById("it");
    const en = document.getElementById("en");
    const es = document.getElementById("es");
    const fr = document.getElementById("fr");
    const de = document.getElementById("de");

    let lan;
    if(it.contains(target)) lan = 'it';
    else if(en.contains(target)) lan = 'en';
    else if(es.contains(target)) lan = 'es';
    else if(fr.contains(target)) lan = 'fr';
    else if(de.contains(target)) lan = 'de';
    else return false;

    return lan;
}


//traduco anche i placeholder oltre che i Label
function translatePlH(formId){
    const formInputs = document.querySelectorAll(`#${formId} input`);
  
    formInputs.forEach(function (input) {
        input.placeholder = input.previousElementSibling.textContent.trim(); //copio il testo dell'elemento precedente all'input, ovvero il suo Label
    });
}

//ricavo la lingua attuale tramite il cookie
function getLanguage(){
    const userLanguage = getCookie('language');
    return userLanguage || 'it';
}

//--------------------------------------------------------------------------GESTIONE TRADUZIONE----------------------------------------------------------------------------
function translate(idArray, undCategory = null, formId = null){
    const lan = getLanguage();

    document.querySelector("html").lang = lan; //correggo il valore di lang in html
    const loc = window.location.pathname;

    const searchString = 'Mastermind_Web_Application/';
    const index = loc.indexOf(searchString);

    let path = loc.substring(0, index + searchString.length) + "JSON/" + lan +".json";
    
    fetch(path)
    .then(response => response.json())
    .then(data =>{
        for (let i = 0; i < idArray.length; i++) {
            if(undCategory && undCategory !== -1){
                //assegno all'elemento avente id == idArray[i] e sottocategoria undCategory il testo associato a quell'id e a quella sottocategoria nel file JSON
                document.getElementById(idArray[i]).textContent = data[idArray[i]][undCategory];
            }
            else{
                document.getElementById(idArray[i]).textContent = data[idArray[i]];
            }
        }

        if(undCategory === -1)      //quando ho bisogno di tradurre i placeholder passo -1 come undCategory
            translatePlH(formId);
    })
}