/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
var scores, roundScore, activePlayer, gamePlaying, previousDiceValue;

initGame();

document.querySelector('.btn-roll').addEventListener('click', function () {
    if (!gamePlaying) {
        return;
    }
    
    // 1. Random number
    var dice1 = Math.floor(Math.random() * 6) + 1;
    var dice2 = Math.floor(Math.random() * 6) + 1;

    // 2. Display result
    var dice1DOM = document.querySelector('.dice-0');
    var dice2DOM = document.querySelector('.dice-1');
    dice1DOM.style.display = 'block';
    dice2DOM.style.display = 'block';

    // 3. Update the score IF the rolled number was NOT a 1
    dice1DOM.src = 'dice-' + dice1 + '.png';
    dice2DOM.src = 'dice-' + dice2 + '.png';

    if (dice1 !== 1 && dice2 !== 1) {
        roundScore += dice1 + dice2;
        document.getElementById('current-' + activePlayer).textContent = roundScore;
    } else {
        nextPlayer();
    }

});

document.querySelector('.btn-hold').addEventListener('click', function () {
    if (!gamePlaying) {
        return;
    }
    
    scores[activePlayer] += roundScore;
    document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

    if (scores[activePlayer] >= 100) {
        gamePlaying = false;
        var playerPanelDOM = document.querySelector('.player-' + activePlayer + '-panel');
        document.getElementById('name-' + activePlayer).textContent = 'Winner!';
        playerPanelDOM.classList.add('winner');
        playerPanelDOM.classList.remove('active');
        document.querySelector('.dice-0').style.display = 'none';
        document.querySelector('.dice-1').style.display = 'none';

        return;
    }

    nextPlayer();
});

document.querySelector('.btn-new').addEventListener('click', initGame);

function nextPlayer() {
    roundScore = 0;
    previousDiceValue = 0;
    document.getElementById('current-' + activePlayer).textContent = roundScore;
    document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');

    activePlayer = activePlayer === 0 ? 1 : 0;
    document.querySelector('.player-' + activePlayer + '-panel').classList.add('active');

    document.querySelector('.dice-0').style.display = 'none';
    document.querySelector('.dice-1').style.display = 'none';
}

function initGame() {
    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;
    previousDiceValue = 0;
    gamePlaying = true;

    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';

    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('winner');

    document.querySelector('.dice-0').style.display = 'none';
    document.querySelector('.dice-1').style.display = 'none';

    document.getElementById('score-0').textContent = 0;
    document.getElementById('score-1').textContent = 0;
    document.getElementById('current-0').textContent = 0;
    document.getElementById('current-1').textContent = 0;
}