import anime from "../animejs/lib/anime.es.js";

class Card {
  constructor(value) {
    this.value = value;
    this.isFlipped = false;
    this.isMatched = false;
    this.htmlElement = null;
  }

  createElement(cardWidth, cardHeight) {
    const element = document.createElement('div');
    element.className = 'card';
    element.innerHTML = `<span></span>`;
    this.htmlElement = element;
    this.htmlElement.style.width = `${cardWidth}px`;
    this.htmlElement.style.height = `${cardHeight}px`;
    this.initializeAnime();
    return element;
  }

  initializeAnime() {
    this.htmlElement.animeJS = anime.timeline({
      autoplay: false
    });

    this.htmlElement.animeJS.add({
      targets: this.htmlElement,
      rotateY: [{ value: "180deg", duration: 100 }]
    });
  }

  startAnime() {
    if (this.htmlElement.animeJS.reversed) this.htmlElement.animeJS.reverse();
    this.htmlElement.animeJS.play();
  }

  endAnime() {
    if (!this.htmlElement.animeJS.reversed) this.htmlElement.animeJS.reverse();
    this.htmlElement.animeJS.play();
  }

  flip() {
    this.isFlipped = !this.isFlipped;
    this.htmlElement.querySelector('span').textContent = this.isFlipped ? this.value : '';
    this.htmlElement.classList.toggle('flipped');
    if (this.isFlipped && !this.isMatched) this.startAnime();
    else this.endAnime();
  }

  match(player) {
    this.isMatched = true;
    
    this.htmlElement.classList.add('guessed', player === 0 ? 'matched-first' : 'matched-second')
  }
}

export default Card;
