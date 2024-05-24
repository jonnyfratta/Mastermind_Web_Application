//---------------------------------------------------------------------------ALLOCAZIONE RISORSE-------------------------------------------------------------------------
const err = document.getElementById("msg");

//----------------------------------------------------------------------------EVENT LISTENERS----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const loginButton = document.getElementById('loginButton');
  const mod = document.getElementById('mod');

  loginButton.addEventListener('click', function () {
      if (loginForm.style.opacity === '' || loginForm.style.opacity === '0') {
          mod.style.opacity = '1';
          mod.style.visibility = 'visible';
      }
      loginButton.classList.add('clicked');
  });

  window.addEventListener('click', function (event) {
    //controllo se si verifica un click al di fuori del modal mentre è aperto e in caso lo chiudo
    if (!mod.contains(event.target) && event.target !== loginButton) {
      mod.style.visibility = 'hidden';
      loginButton.classList.remove('clicked');
      err.innerText = '';
    }
  });
});

document.getElementById('close').addEventListener("click", function() {
  mod.style.visibility='hidden';
  loginButton.classList.remove('clicked');
  err.innerText = '';
});

//-----------------------------------------------------------------------------GESTIONE LOGIN-----------------------------------------------------------------------------

//invio al server i dati necessari ad effettuare il login
const form = document.getElementById("loginForm");
    form.addEventListener("submit", function(element) {
      err.style.display = "none";
      err.innerHTML = "";
      element.preventDefault(); //evito comportamento default: refresh pagina
    

      const rExp = /^[\w.]{5,20}$/; // /^[a-zA-Z0-9_.]{5,20}$/;
      const user = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if(!rExp.test(user) || !rExp.test(password)){
        //almeno uno tra username e password non sono nel formato corretto
          err.style.display = "block";

          if(!rExp.test(user)){
            translate(["msg"], "invUsername");
          }
          else{
            translate(["msg"], "invPassword");
          }
        }
      else{
          fetch("PHP/Back/loginBack.php", {
              method: 'POST',
              body: new FormData(form)
            })
          .then(response => response.json())
          .then(data => {
              if(!data['outcome']){
                //se non ci si è loggati con successo allora counica all'utente il problema
                  err.style.display = "block";
                  err.innerHTML = data['message'];
                  return;
              }
              else{
                //pagina precedente
                switch(data['back']){
                  case 1:
                    window.location.replace("SingleMatch.php?mode=classic");
                    break;

                  case 2:
                    window.location.replace("Competitive.php?mode=competitive");
                    break;

                  case 3:
                    window.location.replace("Custom.php?mode=custom");
                    break;

                  case 4:
                    window.location.replace("Rules.php?mode=rules");
                    break;

                  default:
                    window.location.replace('index.php');
                    break;
                }
                return;
              }
          })
      }
})

