//----------------------------------------------------------------------------EVENT LISTENERS----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function(){
    langListeners();
    const lan = getLanguage();
    handleTranslation();
});

document.getElementById("langMod").addEventListener("click", function(event){
    const lan = checkLang(event.target);
    if(!lan) return;

    setCookie('language', lan, 1);
    handleTranslation();
});

document.getElementById("return").addEventListener("click", function(){window.location.href = "index.php";});

//--------------------------------------------------------------------------FUNZIONI DI UTILITA'-----------------------------------------------------------------------------
function handleTranslation(){
    translate(["fullRules", "modesRules"]);
    translate(["welcome", "usernameLabel", "pwLabel", "log", "reg"], -1, "loginForm");
}
