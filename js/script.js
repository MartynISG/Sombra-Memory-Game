import MatchGrid from './classes/MatchGrid.js';
import anime from "../js/animejs/lib/anime.es.js";
import validateForm from './validate.js';

const gameConfigBtn = document.getElementById('config-game');
gameConfigBtn.addEventListener('click', startGame);

let isFlipped = false;

function flipBoard(e) {
  e.preventDefault();

  isFlipped = !isFlipped;

  const game = document.getElementById('game');
  const gameWrapper = document.getElementById('game-wrapper');
  const gameForm = document.getElementById('game-form');

  anime.timeline()
    .add({
      targets: game,
      rotateY: [{ value: `${isFlipped ? 180 : 0}deg`, duration: 1000 }],
      complete: function () {
        gameWrapper.style.visibility = isFlipped ? 'visible' : 'hidden';
        gameForm.style.visibility = isFlipped ? 'hidden' : 'visible';
      }
    });
}

function startGame(e) {
  initializeBoard(e);
}

function initializeBoard(e) {
  const args = validateForm(e);

  if (!args) return;

  const game = new MatchGrid({ ...args });

  const [startBtn, endBtn, resetBtn] = document.querySelectorAll('.game-btn');

  startBtn.addEventListener('click', game.startGame.bind(game));
  endBtn.addEventListener('click', game.endGame.bind(game));
  resetBtn.addEventListener('click', game.resetGame.bind(game));

  flipBoard(e);
}