/* Javascript - TP1 ARN-2304 - Wendy GERVAIS - AUT. 2023 */


// Variables globales
let nbCoins = 0;
let time = 0;
let currentSeason = 'Summer';
let gameState = 'Intro';
let soundOn = false;


// https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(ms) {
    return new Promise(fonction => setTimeout(fonction, ms));
}


function sound() {
    let button = document.querySelector('#speaker-button');
    if (button.textContent === '🔊') {
        button.textContent = '🔈';
    } else {
        button.textContent = '🔊'
    }
}

function help() {
    document.querySelector('.regles-jeu').style.display = 'block';
}


function closeHelp() {
    document.querySelector('.regles-jeu').style.display = 'none';
}


function launchGame() {
    document.querySelector('.ship-intro').style.animation = 'ship-fly 1s';
    document.querySelector('.ship-shadow').style.animation = 'ship-fly 1s';
    sleep(1000).then(() => {
        document.querySelector('.ship-intro').style.animation = 'ship-intro-anim  8s ease-in-out infinite';
        document.querySelector('.ship-shadow').style.animation = 'ship-intro-shadow-anim  8s ease-in-out infinite';
    });

}

document.querySelector('#speaker-button').addEventListener('click', sound);
document.querySelector('#help-button').addEventListener('click', help);
document.querySelector('#x-button').addEventListener('click',  closeHelp);
document.querySelector('#go-button').addEventListener('click', launchGame);




// Neige https://codepen.io/jeeve/pen/GrKNpN