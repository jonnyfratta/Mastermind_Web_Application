//----------------------------------------------------------------------------EVENT LISTENERS----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    langListeners();

    const lan = getLanguage();
    setCookie('language', lan, 1);

    fetch("Back/profileBack.php", { method: 'GET' })
    .then(response => response.json())
    .then(data => {
        translate(["dateLabel"]); 
        document.getElementById('date').innerText = data["date"];
        let i = 0;
          // Create and append elements for overall stats
          i = createAndAppendStats('VT', [
              { label: 'Total Wins', value: data["totVic"] },
              { label: 'Total Matches', value: data["totMat"] },
              { label: 'Win Percentage', value: data["totPerc"] + '%' }
          ], i);

          document.getElementById("statBox0").firstChild.id = "totVic";
          document.getElementById("statBox1").firstChild.id = "totMat";
          document.getElementById("statBox2").firstChild.id = "totPerc";

          let competitive = (data["favMod"] === 'competitive') ? true : false;

          let l1 = (competitive) ? 'Attempts' : 'Matches Played';
          let v1 = (competitive) ? data["compAtt"] : data["fm_totMat"];

          let l2 = (competitive) ? 'Best Streak' : 'Matches Won';
          let v2 = (competitive) ? data["best_streak"] : data["fm_totVit"];

          // Create and append elements for favorite-mode stats
          createAndAppendStats('FM', [{ label: 'Favorite Mode', value: data["favMod"] },
                                      { label: l1, value: v1},
                                      { label: l2, value: v2},
                                      { label: 'Win Percentage', value: data["fm_perc"] + '%' }
                                     ], i);
            
          document.getElementById("statBox3").firstChild.id = "favMod";
          document.getElementById("statBox4").firstChild.id = "fm_totMat";
          document.getElementById("statBox5").firstChild.id = "fm_totVic";
          document.getElementById("statBox6").firstChild.id = "fm_Perc";
          

          translate(["glStats", "fmStats", "totVic", "totMat", "totPerc", "favMod", "fm_Perc"]);
          if(competitive)
                translate(["fm_totMat", "fm_totVic"], "comp");
          else
                translate(["fm_totMat", "fm_totVic"], "notComp");

          // Fill leaderboard position boxes
          fillLeaderboardPosition('global', 'Your position in the global leaderboard is: ', data["globalPos"]);
          document.getElementById('global').firstChild.id = "globalPos";

          fillLeaderboardPosition('streak', 'Your position in the level leaderboard by win streak is: ', data["streakPos"]);
          document.getElementById("streak").firstChild.id = "streakPos";

          fillLeaderboardPosition('score', 'Your position in the level leaderboard by best score is: ', data["scorePos"]);
          document.getElementById("score").firstChild.id = "scorePos";
        
          translate(["globalPos"]);
          translate(["streakPos"]);
          translate(["scorePos"]);
        });
});


document.getElementById("return").addEventListener("click", function(){window.location.href="../index.php";});


document.getElementById("langMod").addEventListener("click", function(event){
  const lan = checkLang(event.target);
  if(!lan) return;

  setCookie('language', lan, 1);
  translateProfile();
});


document.getElementById("logout").addEventListener("click", function () {
  fetch("Back/logoutBack.php", { method: 'GET' }).then(response => response.json())
      .then(data => {
          // Previous page
          switch (data['back']) {
              case 1:
                  window.location.replace("../SingleMatch.php?mode=classic");
                  break;

              case 2:
                  window.location.replace("../Competitive.php?mode=competitive");
                  break;

              case 3:
                  window.location.replace("../Custom.php?mode=custom");
                  break;

              case 4:
                window.location.replace("../Rules.php?mode=rules");
                break;

              default:
                  window.location.replace('../index.php');
                  break;
          }
      });
});

//--------------------------------------------------------------------------UTILITY FUNCTIONS'-----------------------------------------------------------------------------
function translateProfile(){
  let fm = document.getElementById("statBox3").lastChild.textContent;

  translate(["dateLabel"]); 

  translate(["glStats", "fmStats", "totVic", "totMat", "totPerc", "favMod", "fm_Perc"]);
  if(fm === "competitive")
        translate(["fm_totMat", "fm_totVic"], "comp");
  else
        translate(["fm_totMat", "fm_totVic"], "notComp");

  translate(["globalPos"]);
  translate(["streakPos"]);
  translate(["scorePos"]);
}

function createAndAppendStats(containerId, stats, i) {
let container = document.getElementById(containerId);

stats.forEach(stat => {
    let div = document.createElement("div");
    div.id = "statBox"+i;

    let pLabel = document.createElement("p");
    let pInfo = document.createElement("p");

    pLabel.className = 'info';
    pInfo.className = 'info';

    pLabel.textContent = stat.label;
    pInfo.textContent = stat.value;

    div.appendChild(pLabel);
    div.appendChild(pInfo);

    container.appendChild(div);

    i++;
});

return i;
}

function fillLeaderboardPosition(containerId, label, position) {
let container = document.getElementById(containerId);

let pLabel = document.createElement("p");
let pPosition = document.createElement("p");

pLabel.className = 'info';
pPosition.className = 'position';

pLabel.textContent = label;
pPosition.textContent = position;

container.appendChild(pLabel);
container.appendChild(pPosition);
}
