class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
  }

  static checkWinner(player1, player2) {
    if (player1.score > player2.score) {
      return `Player (${player1.name}) won !`
    } else if (player1.score < player2.score) {
      return `Player (${player2.name}) won !`
    } else {
      return `DRAW`
    }
  }

  static resetScore(players) {
    players.forEach(player => player.score = 0);
  }

  scoreIncrease() {
    this.score++;
  }
}

export default Player;
