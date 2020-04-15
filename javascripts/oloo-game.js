const randomWord = function() {
  const wordArr = [
    'abacus',
    'quotient',
    'octothorpe',
    'proselytize',
    'stipend',
    'supercalifragilisticexpialadocious',
  ];

  return function randomWord() {
    return wordArr.splice(Math.floor(Math.random() * wordArr.length), 1)[0];
  };
}();

const $spaces = $('#spaces');
const $guesses = $('#guesses');
const $message = $('#message');
const $replay = $('#replay');
const $apples = $('#apples');

const Game = {
  init() {
    this.letters = [...(randomWord() || '')];
    this.correct = 0;
    this.targetCorrect = this.letters.length;
    this.incorrect = 0;
    this.maxIncorrect = 6;
    this.guessed = [];

    this.createBlanks();
    this.removeGuesses();
    this.displayMessage('');

    if (this.letters.length === 0) {
      this.displayMessage("Sorry, I've run out of words!");
      $(document).off('keydown');
    }

    return this;
  },
  displayMessage(text) {
    $message.text(text);
  },
  createBlanks() {
    $spaces.find('span').remove();
    $spaces.append('<span></span>'.repeat(this.letters.length));
    this.$spaces = $spaces.find('span');
  },
  removeGuesses() {
    $guesses.find('span').remove();
  },
  addGuess(letter) {
    this.guessed.push(letter);
    $guesses.append(`<span>${letter}</span>`);
  },
  lose() {
    $(document).off('keydown');
    $(document.body).addClass('lose');
    $replay.show();
    this.displayMessage("You're out of guesses! Better luck next time!");
  },
  win() {
    $(document).off('keydown');
    $(document.body).addClass('win');
    $replay.show();
    this.displayMessage('Congratulations! You won!');
  },
};

const startGame = function startGame() {
  let game = Object.create(Game);

  $apples.removeAttr('class');
  $replay.hide();
  $(document.body).removeAttr('class');
  $(document).off('keydown');

  $(document).on('keydown', (e) => {
    const letter = e.key.toLowerCase();
    if (e.keyCode < 65
        || e.keyCode > 90
        || game.guessed.includes(letter)) return;

    let correctGuess = false;

    game.addGuess(letter);
    game.letters.forEach((ltr, idx) => {
      if (ltr !== letter) return;

      game.$spaces.eq(idx).text(letter);
      game.correct += 1;
      correctGuess = true;
    });

    if (!correctGuess) {
      game.incorrect += 1;
      $apples.attr('class', `guess_${game.incorrect}`);
    }

    if (game.incorrect === game.maxIncorrect) {
      game.lose();
    } else if (game.correct === game.targetCorrect) {
      game.win();
    }
  });

  game.init();
};

$replay.on('click', (e) => {
  e.preventDefault();
  startGame();
});

startGame();
