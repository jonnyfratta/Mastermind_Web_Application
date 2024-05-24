//---------------------------------------------------------------------------ALLOCAZIONE RISORSE-------------------------------------------------------------------------
let feedback;
const urlParams = new URLSearchParams(window.location.search);
const ret = urlParams.get('return');

//----------------------------------------------------------------------------EVENT LISTENERS----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function(){
  langListeners();
  translate(["nameLabel", "surnameLabel", "emailLabel", "usernameLabel", "pwLabel", "cpwLabel", "reg"], -1, "regForm");
});

document.getElementById("return").addEventListener("click", function(){comeback();});

document.getElementById("langMod").addEventListener("click", function(event){
  const lan = checkLang(event.target);
  if(!lan) return;
  
  setCookie('language', lan, 1);
  translate(["nameLabel", "surnameLabel", "emailLabel", "usernameLabel", "pwLabel", "cpwLabel", "reg"], -1, "regForm");
  
  translate(['msg'], feedback);
});

//---------------------------------------------------------------------------FUNZIONI DI UTILITA'-----------------------------------------------------------------------------

//identifico pagina di ritorno
function comeback(){
  switch(ret){
    case "1":
      window.location.replace("../SingleMatch.php?mode=classic");
      break;

    case "2":
      window.location.replace("../Competitive.php?mode=competitive");
      break;

    case "3":
      window.location.replace("../Custom.php?mode=custom");
      break;

    case "4":
      window.location.replace("../Rules.php?mode=rules");
      break;

    default:
      window.location.replace('../index.php');
      break;
  }
}

//------------------------------------------------------------------------------GESTIONE REGISTRAZIONE----------------------------------------------------------------------------
let form2 = document.getElementById('regForm');
form2.addEventListener("submit", function(element){
    element.preventDefault(); //evito comportamento default: refresh pagina

    const rExp = /^[\w.]{5,20}$/; // /^[a-zA-Z0-9_.]{5,20}$/;
    const e_rExp = /^\S+@\S+\.\S+$/; //qualcosa@qualcosa.qualcosa

    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const user = document.getElementById("username").value;
    const email = document.getElementById("mail").value;
    const pw = document.getElementById("pw").value;
    const cpw = document.getElementById("cpw").value;
            
    const err = document.getElementById("msg");
    err.style.display = "none";
    err.innerHTML = "";
    
    const testU = rExp.test(user);
    const testP = rExp.test(pw);
    const testE = e_rExp.test(email);

    if(typeof name !== 'string' || typeof surname !== 'string'){
        err.style.display = "block";
        translate(["msg"], "regInvInput");
        feedback = "regInvInput";
        return;
    }

    else if (!testU){
        err.style.display = "block";
        translate(["msg"], "regInvUser");
        feedback = "regInvUser";
        return;
    }
    else if (!testP){
        err.style.display = "block";
        translate(["msg"], "regInvPass");
        feedback = "regInvPass";
        return;
    }
    else if (!testE){
        err.style.display = "block";
        translate(["msg"], "regInvEmail");
        feedback = "regInvEmail";
        return;
    }
    else if (pw !== cpw){
        err.style.display = "block";
        translate(["msg"], "regInvCpw");
        feedback = "regInvCpw";
        return;
    }
    
    //se tutti i dati vanno bene
    else{
        fetch("../PHP/Back/registerBack.php", {
            method: 'POST',
            body: new FormData(form2)
          })
        .then(response => response.json())
        .then(data => {
            if(!data['outcome']){
              //caso registrazione fallita
                err.style.display = "block";
                err.innerHTML = data['message'];
            }
            else{
              //pagina precedente
              comeback();
            }
        })
    }
})

