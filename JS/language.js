//--------------------------------------------------------------------------RESOURCE ALLOCATION---------------------------------------------------------------------------
const popUp = {
    it: ["You have changed the game mode. The game will be reset with the new settings. Press OK to confirm or CANCEL to return to the current game:",
         "By clicking confirm, you will lose all your points and start again from level 1. Do you really want to confirm?"],
    en: ["You have changed the game mode. The game will be reset with the new settings. Press OK to confirm or CANCEL to return to the current game:",
         "By clicking confirm, you will lose all your points and start again from level 1. Do you really want to confirm?"],
    es: ["You have changed the game mode. The game will be reset with the new settings. Press OK to confirm or CANCEL to return to the current game:",
         "By clicking confirm, you will lose all your points and start again from level 1. Do you really want to confirm?"],
    de: ["You have changed the game mode. The game will be reset with the new settings. Press OK to confirm or CANCEL to return to the current game:",
         "By clicking confirm, you will lose all your points and start again from level 1. Do you really want to confirm?"],
    fr: ["You have changed the game mode. The game will be reset with the new settings. Press OK to confirm or CANCEL to return to the current game:",
         "By clicking confirm, you will lose all your points and start again from level 1. Do you really want to confirm?"]
};

//--------------------------------------------------------------------------UTILITY FUNCTIONS'-----------------------------------------------------------------------------

//return the alert message in the correct language
function getAlert(type){
    const lan = getLanguage()
    return popUp[lan][type];
}

//attach listeners for the language selection button
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

    //if you click outside the modal while it is open, it closes
    window.addEventListener('click', function (event) {
      if (langMod.style.visibility !== 'hidden' && event.target !== langButton) {
        langMod.style.visibility = 'hidden';
        langMod.style.opacity = '0';
        langButton.classList.remove('clicked');
      }
    });
}

//detect which language was selected
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


//translate placeholders as well as labels
function translatePlH(formId){
    const formInputs = document.querySelectorAll(`#${formId} input`);
  
    formInputs.forEach(function (input) {
        input.placeholder = input.previousElementSibling.textContent.trim(); //copy the previous element text into the input placeholder (its label)
    });
}

//read the current language from the cookie
function getLanguage(){
    const userLanguage = getCookie('language');
    return userLanguage || 'en';
}

//--------------------------------------------------------------------------TRANSLATION HANDLING----------------------------------------------------------------------------
function translate(idArray, undCategory = null, formId = null){
    const lan = getLanguage();

    document.querySelector("html").lang = lan; //update the html lang attribute
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
