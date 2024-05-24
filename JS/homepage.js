//----------------------------------------------------------------------------EVENT LISTENERS----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function(){
    langListeners();
    const lan = getLanguage();
    handleTranslation();

    setCookie('language', lan, 1);
});

document.getElementById("langMod").addEventListener("click", function(event){
    const lan = checkLang(event.target);
    if(!lan) return;

    setCookie('language', lan, 1);
    handleTranslation();
});

document.getElementById("single").addEventListener("click", function(){window.location.href = "SingleMatch.php?mode=classic";});
document.getElementById("compet").addEventListener("click", function(){window.location.href = "Competitive.php?mode=competitive";});
document.getElementById("custom").addEventListener("click", function(){window.location.href = "Custom.php?mode=custom";});
document.getElementById("rules").addEventListener("click", function(){window.location.href = "Rules.php?mode=rules";});

//--------------------------------------------------------------------------FUNZIONI DI UTILITA'-----------------------------------------------------------------------------
function handleTranslation(){
    translate(["single", "compet", "custom", "rules"]);
    translate(["welcome", "usernameLabel", "pwLabel", "log", "reg"], -1, "loginForm");
}
