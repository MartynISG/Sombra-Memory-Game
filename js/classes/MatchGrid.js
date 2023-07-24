import Player from './Player.js';
import Card from './Card.js';

class MatchGrid {
  constructor({width, height, columnsNumber, rowsNumber, timeLimit, theme, playerNames }) {
    this.board = document.getElementById('game-board');
    this.gameWrapper = document.getElementById('game-wrapper');
    this.width = width;
    this.height = height;
    this.columnsNumber = columnsNumber;
    this.rowsNumber = rowsNumber;
    this.timeLimit = timeLimit;
    this.timeLeft = timeLimit;
    this.theme = theme;
    this.isGameFinished = true;
    this.flippedCards = [];
    this.players = [];
    this.currentPlayer = 0;
    this.cards = [];
    this.mouseInside = false;
    this.initializeGame(playerNames);
  }

  initializeGame(playerNames) {
    this.setUpStyles();
    this.initializePlayers(playerNames);
    this.updateBoardScore();
  }

  initializePlayers(playerNames) {
    this.players = playerNames.map(name => new Player(name));

    const [firstPlayer, secondPlayer] = this.players;

    const firstPlayerScore = document.getElementById('player1-score');
    const secondPlayerScore = document.getElementById('player2-score');

    firstPlayerScore.innerText = firstPlayer.name;
    secondPlayerScore.innerText = secondPlayer.name;
  }

  setUpStyles() {
    document.body.classList.add(this.theme);
    Object.assign(this.board.style, {
      width: `${this.width}px`,
      height: `${this.height}px`,
    });
  }

  startGame() {
    if (this.isGameFinished && this.timeLimit === this.timeLeft) {
      this.resetGame();
    }
  }

  resetGame(){
    this.flippedCards = [];
    this.isGameFinished = false;
    const shuffledCards = this.generateCardsArray();
    this.createBoard(shuffledCards);
    Player.resetScore(this.players);
    this.resetTimer();
    this.startTimer();

    this.updateBoardScore();
  }

  endGame() {
    clearInterval(this.timerInterval);
    this.isGameFinished = true;
    this.showGameOverMessage();
  }

  mouseOut = (event) => {
    const isInside = event.relatedTarget && this.gameWrapper.contains(event.relatedTarget);

    if (!isInside) this.stopTimer();
  }

  mouseOver = () => {
    this.startTimer();
  }

  addOverEvent = () => {
    this.gameWrapper.removeEventListener('mouseover', this.mouseOver);
    this.gameWrapper.addEventListener('mouseout', this.mouseOut);
  }

  addOutEvent = () => {
    this.gameWrapper.removeEventListener('mouseout', this.mouseOut);
    this.gameWrapper.addEventListener('mouseover', this.mouseOver);
  }

  stopTimer() {
    this.addOutEvent();
    clearInterval(this.timerInterval);
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.timeLeft = this.timeLimit;
    this.updateTimer();
  }

  updateTimer() {
    const timer = document.getElementById('time-left');
    timer.textContent = this.timeLeft;
  }

  startTimer() {
    this.addOverEvent();
    this.timerInterval = setInterval(() => {
      this.updateTimer();
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000)
  }

  generateCardsArray() {
    const cards = [];

    let totalElementsNumber = this.columnsNumber * this.rowsNumber;
    let finalCardsAmount = totalElementsNumber;

    if (totalElementsNumber % 2) {
      finalCardsAmount = totalElementsNumber - 1;
    }

    for (let i = 1; i <= finalCardsAmount / 2; i++) {
      cards.push(i, i);
    }

    this.cards = [...cards];
    return this.shuffle(cards);
  }

  shuffle(cards) {
    let currentIndex = cards.length - 1;

    while (currentIndex > 0) {
      const randIndex = Math.floor(Math.random() * currentIndex);

      [cards[currentIndex], cards[randIndex]] = [cards[randIndex], cards[currentIndex]];

      currentIndex--;
    }

    return cards;
  }

  createBoard(cardValues) {
    const cards = cardValues.map(value => {
      const card = new Card(value);
      const cardWidth = Math.floor((this.width - this.rowsNumber * 10) / (this.rowsNumber + 1));
      const cardHeight = Math.floor((this.height - this.columnsNumber * 10) / (this.columnsNumber + 1));
      const cardElement = card.createElement(cardWidth, cardHeight);
      cardElement.addEventListener('click', () => this.flipCard(card));
      return cardElement;
    });

    this.board.innerHTML = '';
    this.board.append(...cards);
  }

  flipCard(card) {
    if (this.isGameFinished || card.isMatched || card.isFlipped) return;

    if (this.flippedCards.length < 2) {
      card.flip();
      this.flippedCards.push(card);

      if (this.flippedCards.length === 2) {
        setTimeout(() => this.checkMatches(), 1000);
      }
    }
  }

  showGameOverMessage() {
    const modalWindow = document.createElement('div');
    modalWindow.className = 'modal-window';
    const [ firstPlayer, secondPlayer ] = this.players;
    modalWindow.textContent = Player.checkWinner(firstPlayer, secondPlayer);
    document.body.append(modalWindow);
    setTimeout(() => modalWindow.remove(), 5000);
  }

  checkGameFinished() {
    const isAllFlipped = [...this.board.children].every(elem => elem.classList.contains('flipped'))
    if (isAllFlipped) {
      this.endGame();
    }
  }

  checkMatches() {
    const [card1, card2] = this.flippedCards;

    if (card1.value === card2.value) {
      card1.match(this.currentPlayer);
      card2.match(this.currentPlayer);

      this.players[this.currentPlayer].scoreIncrease();
      this.updateBoardScore();

      this.checkGameFinished();
    } else {
      card1.flip();
      card2.flip();

      this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
    }

    this.flippedCards = [];
  }

  updateBoardScore() {
    const playersScores = document.getElementById('players-scores');
    const [firstPlayer, secondPlayer] = this.players;
    playersScores.innerText = `${firstPlayer.score || 0} :: ${secondPlayer.score || 0}`

    if (firstPlayer.score > (this.cards.length / 4) || secondPlayer.score > (this.cards.length / 4)) {
      this.endGame();
    }
  }
}

export default MatchGrid;
