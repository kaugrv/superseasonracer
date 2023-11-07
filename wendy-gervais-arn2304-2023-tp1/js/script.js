/* Javascript - TP1 ARN-2304 - Wendy GERVAIS - AUT. 2023 */

// ------------------ Variables globales ------------------ //

const tempsTotal = 56;

let currentSeason = "Autumn";
let currentShip = 1;
let soundOn = false;

// Inventaire
let nbCoins = 0;
let nbSkins = 1;
let nbGems = 1;

// Total à ramasser
const nbCoinsSilverTotal = 50;
const nbCoinsGoldTotal = 25;
const nbCoinsTotal = nbCoinsSilverTotal * 50 + nbCoinsGoldTotal * 100;
const nbBombTotal = 5;

let allObjects = [];

// ------------------ Neige ------------------ //
// d'après http://www.kommunauty.fr/article-727-javascript-de-la-neige-sur-vos-sites-web sauf la fonction Stop que j'ai ajoutée
snow = {
  wind: 0,
  maxXrange: 100,
  minXrange: 10,
  maxSpeed: 2,
  minSpeed: 1,
  color: "#fff",
  char: "*",
  maxSize: 20,
  minSize: 8,

  flakes: [],
  WIDTH: 0,
  HEIGHT: 0,

  init: function (nb) {
    var o = this,
      frag = document.createDocumentFragment();
    o.getSize();

    for (var i = 0; i < nb; i++) {
      var flake = {
        x: o.random(o.WIDTH),
        y: -o.maxSize,
        xrange: o.minXrange + o.random(o.maxXrange - o.minXrange),
        yspeed: o.minSpeed + o.random(o.maxSpeed - o.minSpeed, 100),
        life: 0,
        size: o.minSize + o.random(o.maxSize - o.minSize),
        html: document.createElement("span"),
      };

      flake.html.style.position = "absolute";
      flake.html.style.top = flake.y + "px";
      flake.html.style.left = flake.x + "px";
      flake.html.style.fontSize = flake.size + "px";
      flake.html.style.color = o.color;
      flake.html.style.pointerEvents = "none";
      flake.html.appendChild(document.createTextNode(o.char));

      frag.appendChild(flake.html);
      o.flakes.push(flake);
    }

    document.body.appendChild(frag);
    o.animate();

    window.onresize = function () {
      o.getSize();
    };
  },

  stop: function () {
    var o = this;

    for (var i = 0; i < o.flakes.length; i++) {
      var flake = o.flakes[i];
      if (flake.html && flake.html.parentNode) {
        flake.html.parentNode.removeChild(flake.html);
      }
    }

    o.flakes = [];
  },

  animate: function () {
    var o = this;
    for (var i = 0, c = o.flakes.length; i < c; i++) {
      var flake = o.flakes[i],
        top = flake.y + flake.yspeed,
        left = flake.x + Math.sin(flake.life) * flake.xrange + o.wind;
      if (
        top < o.HEIGHT - flake.size - 10 &&
        left < o.WIDTH - flake.size &&
        left > 0
      ) {
        flake.html.style.top = top + "px";
        flake.html.style.left = left + "px";
        flake.y = top;
        flake.x += o.wind;
        flake.life += 0.01;
      } else {
        flake.html.style.top = -o.maxSize + "px";
        flake.x = o.random(o.WIDTH);
        flake.y = -o.maxSize;
        flake.html.style.left = flake.x + "px";
        flake.life = 0;
      }
    }
    setTimeout(function () {
      o.animate();
    }, 20);
  },

  random: function (range, num) {
    var num = num ? num : 1;
    return Math.floor(Math.random() * (range + 1) * num) / num;
  },

  getSize: function () {
    this.WIDTH = document.body.clientWidth || window.innerWidth;
    this.HEIGHT = document.body.clientHeight || window.innerHeight;
  },
};

let snowing = false;

// Récupère la saison de départ (soit la saison réelle soit une saison au hasard).
// Initialise aussi la première gemme de saison dans l'inventaire et les 3 autres gemmes dans la liste de tous les objets.
function getSeason() {
  // Vraie saison
  const date = new Date();
  let month = date.getMonth() + 1;

  // Saison au hasard
  month = Math.floor(Math.random() * 12);

  if (month >= 3 && month <= 5) {
    currentSeason = "Spring";
    allObjects = ["Summer", "Autumn", "Winter"];
  } else if (month >= 6 && month <= 8) {
    currentSeason = "Summer";
    allObjects = ["Spring", "Autumn", "Winter"];
  } else if (month >= 9 && month <= 11) {
    currentSeason = "Autumn";
    allObjects = ["Spring", "Summer", "Winter"];
  } else {
    currentSeason = "Winter";
    allObjects = ["Spring", "Summer", "Autumn"];
  }

  let seasonHolder1 = document.querySelector("#season-holder-1");
  seasonHolder1.src = "images/objets/gem" + currentSeason + ".png";
  seasonHolder1.classList.add(currentSeason);

  let debutSeason = currentSeason;
  seasonHolder1.addEventListener("click", function () {
    toggleSeason(debutSeason);
  });

  document.querySelector("#main-game").style.backgroundImage =
    "url('images/background/" + currentSeason.toLowerCase() + "BG.jpg')";

  // Lance la neige si en hiver
  if (currentSeason === "Winter") {
    snow.init(50);
    snowing = true;
  }
}

getSeason();

// Gestion musique principale
let mainMusic = document.getElementById("main-music");
mainMusic.src = "musique/" + currentSeason.toLowerCase() + ".mp3";
mainMusic.playbackRate = 2;
mainMusic.volume = 0.1;

// Pour gérer timeout facilement
// https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(ms) {
  return new Promise((fonction) => setTimeout(fonction, ms));
}

// ------------------ Introduction ------------------ //

let defaultSkin = document.querySelector("#skin-holder-1");

defaultSkin.classList.add("skin1");
defaultSkin.addEventListener("click", function () {
  toggleSkin(1);
});

// Easter Egg : Si on clique sur le vaisseau dans l'intro on peut choisir son vaisseau de base
function changeShipIntro() {
  let img = document.querySelector(".ship-intro");
  let img2 = document.querySelector("#ship-illu");
  let playerBegin = document.querySelector("#player");

  let next = Number(img.alt[img.alt.length - 1]) + 1;

  if (next == 7) {
    next = 1;
  }

  img.src = "images/ships/shipIllu" + next + ".png";
  img.alt = "Vaisseau " + next;
  img2.src = "images/ships/shipIllu" + next + ".png";
  img2.alt = "Vaisseau " + next;
  player.src = "images/ships/ship" + next + ".png";
  currentShip = next;

  defaultSkin.src = "images/objets/skin" + next + ".png";

  defaultSkin.className = "skin skin" + next;

  document
    .querySelector("#skin-holder-1")
    .addEventListener("click", function () {
      toggleSkin(next);
    });
}

document
  .querySelector(".ship-intro")
  .addEventListener("click", changeShipIntro);

// ---------------- BOUTONS ---------------- //

let buttonJeu = document.querySelector("#speaker-button-jeu");

// Boutons Son ON/OFF
function sound() {
  if (soundOn) {
    buttonJeu.src = "images/boutons/soundOff.png";
    mainMusic.muted = true;
    soundOn = false;
  } else {
    buttonJeu.src = "images/boutons/soundOn.png";
    mainMusic.play();
    mainMusic.muted = false;
    soundOn = true;
  }
}

buttonJeu.addEventListener("click", sound);

let regles = document.querySelector(".regles-jeu");
let creditsFenetre = document.querySelector(".credits");

// Bouton "?"
function help() {
  if (regles.style.display == "block") {
    regles.style.display = "none"; // Pour fermer si déjà ouvert
  } else {
    regles.style.display = "block";
  }

  creditsFenetre.style.display = "none";
}

document.querySelector("#help-button").addEventListener("click", help);

function closeHelp() {
  regles.style.display = "none";
}
document.querySelector("#x-button").addEventListener("click", closeHelp);

// Bouton C
function credits() {
  if (creditsFenetre.style.display == "block") {
    creditsFenetre.style.display = "none"; // Pour fermer si déjà ouvert
  } else {
    creditsFenetre.style.display = "block";
  }
  regles.style.display = "none";
}

document.querySelector("#copyright-button").addEventListener("click", credits);

function closeCredits() {
  creditsFenetre.style.display = "none";
}
document.querySelector("#x-button-c").addEventListener("click", closeCredits);

// ---------------- LANCER LE JEU ---------------- //

let introduction = document.querySelector(".introduction");
let mainGame = document.querySelector(".main-game");

function launchGame() {
  sound();

  let startAudio = document.querySelector("#game-start-music");
  startAudio.volume = 0.5;
  if (soundOn) startAudio.play();

  document.querySelector("#go-button").removeEventListener("click", launchGame); // Pour ne pas qu'un double clic init le jeu 2 fois

  // Animation du vaisseau et transition vers le jeu

  introduction.style.animation = "fade-to-white 1.5s 1";

  document.querySelector(".ship-intro").style.animation = "ship-fly 1.5s";
  document.querySelector(".ship-shadow").style.animation = "ship-fly 1.5s";
  sleep(1500).then(() => {
    mainGame.style.display = "flex";
    mainGame.style.animation = "apparition 1.5s 1";
    introduction.style.display = "none";
  });

  // Timer
  let seconds = tempsTotal;
  let timer = document.querySelector("#timer");

  const timerInterval = setInterval(() => {
    seconds--;

    timer.innerText = (seconds % 60).toString();

    if (seconds <= 5) {
      timer.style.color = "red";
    }

    if (seconds === 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);

  initObjects();
  renderObjects();
}

document.querySelector("#go-button").addEventListener("click", launchGame);

// ---------------- BOUM ---------------- //

let gameOverFenetre = document.querySelector(".game-over");

function gameOver() {
  mainGame.style.display = "none";
  gameOverFenetre.style.display = "flex";
  gameOverFenetre.style.backgroundImage =
    "url('images/background/explosion.gif')";
  mainMusic.pause();

  let explosionSound = document.querySelector("#explosion-music");
  explosionSound.volume = 0.1;

  if (soundOn) explosionSound.play();

  sleep(1000).then(() => {
    soundOn = false;
  });
}

function reloadPage() {
  location.reload(); // True pour hard reload sur firefox (sinon le gif explosion ne se relance pas)
}

document.querySelector("#button-retry").addEventListener("click", reloadPage);

// ---------------- JEU ---------------- //

let player = document.querySelector("#player");

// Pour trier aléatoirement un array (utile pour la liste des objets)
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Remplit la liste allObjects avec tous les objets : pièces, skins, bombes
function initObjects() {
  for (let i = 1; i <= 6; i++) {
    if (i != currentShip) allObjects.push("skin" + i);
  }

  for (let i = 1; i <= nbBombTotal; i++) {
    allObjects.push("bomb" + i);
  }

  for (let i = 1; i <= nbCoinsSilverTotal; i++) {
    allObjects.push("silver" + i);
  }

  for (let i = 1; i <= nbCoinsGoldTotal; i++) {
    allObjects.push("gold" + i);
  }

  allObjects = shuffle(allObjects);
}

// Ajoute tous les objets de allObjects au DOM
function renderObjects() {
  let scrollArea = document.querySelector("#scrolling-objects");

  for (let i = 0; i < allObjects.length; i++) {
    switch (allObjects[i].slice(0, 4)) {
      case "silv":
        scrollArea.innerHTML +=
          "<div class='coin-wrap silver' id=" + allObjects[i] + "></div><br>";
        break;
      case "gold":
        scrollArea.innerHTML +=
          "<div class='coin-wrap' id=" + allObjects[i] + "></div><br>";
        break;

      case "Summ":
        scrollArea.innerHTML +=
          '<img src="images/objets/gemSummer.png" class="game-gem" id=' +
          allObjects[i] +
          "><br>";
        break;
      case "Autu":
        scrollArea.innerHTML +=
          '<img src="images/objets/gemAutumn.png" class="game-gem" id=' +
          allObjects[i] +
          "><br>";
        break;
      case "Spri":
        scrollArea.innerHTML +=
          '<img src="images/objets/gemSpring.png" class="game-gem" id=' +
          allObjects[i] +
          "><br>";
        break;
      case "Wint":
        scrollArea.innerHTML +=
          '<img src="images/objets/gemWinter.png" class="game-gem" id=' +
          allObjects[i] +
          "><br>";
        break;

      case "bomb":
        scrollArea.innerHTML +=
          "<div class='bomb-wrap' id=" + allObjects[i] + "></div><br>";
        break;

      case "skin":
        scrollArea.innerHTML +=
          '<img src="images/objets/skin' +
          allObjects[i].charAt(4) +
          '.png" class="skin" id=' +
          allObjects[i] +
          "><br>";
        break;

      default:
        break;
    }

    // Positionnement aléatoire des objets sur la route
    let objectI = document.querySelector("#" + allObjects[i]);
    objectI.style.position = "absolute";
    objectI.style.left = (Math.random() * 80 + 5).toString() + "%"; // Horizontal

    let VerticalRange;

    // 3 vagues d'objets de plus en plus tassés verticalement pour augmenter la difficulté
    if (i <= allObjects.length / 3) {
      VerticalRange = Math.random() * 30 + 50;
    } else if (i > allObjects.length / 3 && i <= (2 * allObjects.length) / 3) {
      VerticalRange = Math.random() * 20 + 20;
    } else {
      VerticalRange = Math.random() * 10;
    }

    objectI.style.top = VerticalRange.toString() + "%"; // Vertical
  }

  // L'ajout du clic sur chaque objet se fait dans une autre fonction :
  makeObjectsClickable();
}

function makeObjectsClickable() {
  let coinAudio = document.querySelector("#coin-music");
  coinAudio.volume = 0.5;

  let bonusAudio = document.querySelector("#bonus-music");
  bonusAudio.volume = 0.3;

  for (let i = 0; i < allObjects.length; i++) {
    let objectI = document.querySelector("#" + allObjects[i]);

    // Pour chaque objet : suppression du terrain
    objectI.addEventListener("mousedown", function () {
      objectI.style.display = "none";
    });

    // Pour chaque objet : ajout au nb de pieces ou à l'inventaire, jouer le son du clic,
    switch (allObjects[i].slice(0, 4)) {
      case "silv":
        objectI.addEventListener("mousedown", function () {
          nbCoins = nbCoins + 50;
          document.querySelector("#nbCoins").innerHTML = nbCoins.toString();
          if (soundOn) coinAudio.play();
        });
        break;
      case "gold":
        objectI.addEventListener("mousedown", function () {
          nbCoins = nbCoins + 100;
          document.querySelector("#nbCoins").innerHTML = nbCoins.toString();
          if (soundOn) coinAudio.play();
        });
        break;

      case "Summ":
        objectI.addEventListener("mousedown", function () {
          nbGems++;
          let idGem = "#season-holder-" + nbGems;
          document.querySelector(idGem).src = "images/objets/gemSummer.png";
          document.querySelector(idGem).classList.add("Summer");
          document
            .querySelector(".Summer")
            .addEventListener("click", function () {
              toggleSeason("Summer");
            });
          if (soundOn) bonusAudio.play();
        });
        break;
      case "Autu":
        objectI.addEventListener("mousedown", function () {
          nbGems++;
          let idGem = "#season-holder-" + nbGems;
          document.querySelector(idGem).src = "images/objets/gemAutumn.png";
          document.querySelector(idGem).classList.add("Autumn");
          document
            .querySelector(".Autumn")
            .addEventListener("click", function () {
              toggleSeason("Autumn");
            });
          if (soundOn) bonusAudio.play();
        });

        break;
      case "Spri":
        objectI.addEventListener("mousedown", function () {
          nbGems++;
          let idGem = "#season-holder-" + nbGems;
          document.querySelector(idGem).src = "images/objets/gemSpring.png";
          document.querySelector(idGem).classList.add("Spring");
          document
            .querySelector(".Spring")
            .addEventListener("click", function () {
              toggleSeason("Spring");
            });

          if (soundOn) bonusAudio.play();
        });

        break;

      case "Wint":
        objectI.addEventListener("mousedown", function () {
          nbGems++;
          let idGem = "#season-holder-" + nbGems;
          document.querySelector(idGem).src = "images/objets/gemWinter.png";
          document.querySelector(idGem).classList.add("Winter");
          document
            .querySelector(".Winter")
            .addEventListener("click", function () {
              toggleSeason("Winter");
            });
          if (soundOn) bonusAudio.play();
        });

        break;

      case "bomb":
        objectI.addEventListener("mousedown", gameOver);
        break;

      case "skin":
        objectI.addEventListener("mousedown", function () {
          nbSkins++;
          let idSkin = "#skin-holder-" + nbSkins;
          document.querySelector(idSkin).src =
            "images/objets/skin" + allObjects[i].charAt(4) + ".png";
          document
            .querySelector(idSkin)
            .classList.add(allObjects[i].toString());
          if (soundOn) bonusAudio.play();

          document
            .querySelector(".skin" + allObjects[i].charAt(4))
            .addEventListener("click", function () {
              toggleSkin(allObjects[i].charAt(4));
            });
        });
        break;

      default:
        break;
    }
  }
}

function toggleSeason(n) {
  currentSeason = n;
  mainMusic.src = "musique/" + currentSeason.toLowerCase() + ".mp3";
  mainMusic.playbackRate = 2;
  mainMusic.volume = 0.1;
  if (soundOn) mainMusic.play();

  if (currentSeason === "Winter" && !snowing) {
    snow.init(50);
  } else {
    snow.stop();
  }

  mainGame.style.backgroundImage =
    "url('images/background/" + currentSeason.toLowerCase() + "BG.jpg')";
}

function toggleSkin(n) {
  currentShip = n;

  let shipIllu = document.querySelector("#ship-illu");

  player.src = "images/ships/ship" + n + ".png";
  shipIllu.src = "images/ships/shipIllu" + n + ".png";
}

function endGame() {
  mainGame.style.display = "none";
  document.querySelector(".end-game").style.display = "flex";

  mainMusic.pause();

  document.querySelector(".scores").style.backgroundImage =
    "url('images/background/" + currentSeason.toLowerCase() + "BG.jpg')";

  let pourcentage = Math.round(
    ((nbCoins / nbCoinsTotal + nbSkins / 6 + nbGems / 4) / 3) * 100
  );
  let endText = document.querySelector("#end-text");

  let music = document.querySelector("#win-music");
  music.volume = 0.1;

  document.querySelector(".scores").innerHTML =
    '<span class="pourcentage">' +
    pourcentage +
    "%</span><br><br> Pieces : " +
    nbCoins +
    " / " +
    nbCoinsTotal +
    "<br> Saisons : " +
    nbGems +
    " / 4 <br> Vaisseaux : " +
    nbSkins +
    " / 6 <br>";

  if (!(nbCoins == nbCoinsTotal && nbSkins == 6 && nbGems == 4)) {
    if (pourcentage < 50) endText.innerHTML = "Dommage...";
    if (pourcentage >= 50) endText.innerHTML = "Presque!";
    document.querySelector("#end-thx").style.display = "none";
    document.querySelector(".retry-end").style.display = "block";
    music = document.querySelector("#end-music");
    music.volume = 0.3;
  } else {
    document.querySelector(".retry-end").style.display = "none";
  }

  if (soundOn) music.play();
}

document.querySelector(".retry-end").addEventListener("click", reloadPage);
