let winner, initial, players, score, turn, cells, dificulty, table, scoreboard;
var init;

Number.prototype.between = (a, b, inclusive) => {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return inclusive ? this >= min && this <= max : this > min && this < max;
};

window.onload = function () {
  table = document.getElementsByClassName('table')[0];
  scoreboard = document.getElementsByClassName('scoreboard')[0];

  var createElementFromHTML = function (htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
  }

  var changeTurn = () => {
    var currentIndex = players.indexOf(turn);
    if (currentIndex + 1 == players.length) {
      currentIndex = -1
    }
    turn = players[currentIndex + 1];
  }

  // var isLeft = (index) => {
  //   let left = false;
  //   for (let asd = 1; (asd * eachRow) <= dificulty; asd++) {
  //     let pos = asd * eachRow;
  //     if (index == (pos)) {
  //       left = true;
  //     }
  //   }
  //   return left;
  // };

  // var isRight = (index) => {
  //   let right = false;
  //   for (let asd = 1; (asd * eachRow) <= dificulty; asd++) {
  //     let pos = asd * eachRow;
  //     if (index == (pos - 1)) {
  //       right = true;
  //     }
  //   }
  //   return right;
  // };

  var determineWinner = (element) => {
    let thereIsAWinner = false;
    let currentIndex = cells.indexOf(element); // elemento que yo clickie
    let isTop = currentIndex.between(0, (eachRow - 1), true);
    let isDown = currentIndex.between((dificulty - (eachRow - 1)), (dificulty - 1), true);
    let isLeft = (currentIndex % eachRow == 0);
    let isRight = ((currentIndex + 1) % eachRow == 0);

    let nearestIndexes = [
      (isTop || isLeft ? -1 : (currentIndex - eachRow - 1)),
      (isTop ? -1 : (currentIndex - eachRow - 0)),
      (isTop || isRight ? -1 : (currentIndex - eachRow + 1)),
      (isLeft ? -1 : (currentIndex - 1)),
      (isRight ? -1 : (currentIndex + 1)),
      (isDown || isLeft ? -1 : (currentIndex + eachRow - 1)),
      (isDown ? -1 : (currentIndex + eachRow)),
      (isDown || isRight ? -1 : (currentIndex + eachRow + 1)),
    ];

    for (const index of nearestIndexes) { // elemento cercano
      if (index >= 0 && index < cells.length) {
        if (cells[index].classList.contains(turn) && nearestIndexes.includes(index)) {
          let differenceBetweenTwoIndexes = index > currentIndex ? (index - currentIndex) : (currentIndex - index);
          differenceBetweenTwoIndexes = differenceBetweenTwoIndexes == 0 ? 1 : differenceBetweenTwoIndexes;
          let posibilities = [
            (isLeft ? -1 : ((index < currentIndex ? index : currentIndex) - differenceBetweenTwoIndexes)),
            (isRight ? -1 : ((index < currentIndex ? currentIndex : index) + differenceBetweenTwoIndexes))
          ];

          posibilities.forEach((pos) => {
            if (pos >= 0 && pos < cells.length && cells[pos].classList.contains(turn)) {
              thereIsAWinner = true;
            }
          });
        }
      }
    }

    if (thereIsAWinner) {
      score[turn] = score[turn] + 1;
      embedScoreboard();
      init();
    }else {
      changeTurn();
    }
  }
  
  var embedScoreboard = () => {
    scoreboard.innerHTML = '';
    players.forEach(player => {
      let tempBoard = createElementFromHTML('<p class="player-' + player + '">' + player + ': ' + score[player] + '</p>');
      scoreboard.appendChild(tempBoard);
    });    
  }

  var initScoreboard = () => {
    score = {};
    players.forEach(player => {
      score[player] = 0;
    });
    embedScoreboard();
  }

  var addListener = () => {
    for (var element of cells) {
      element.addEventListener('click', e => {
        if (e.target.classList.value.split(' ').length == 2) {
          e.target.classList.add(turn);
          determineWinner(e.target);
        }
      })
    }
  };
  
  init = () => {
    players = players == null ? ['x', 'o'] : players;
    dificulty = (players.length + 1) ** players.length;
    eachRow = Math.sqrt(dificulty);
    turn = 'x';
    table.innerHTML = '';
    for (let index = 0; index < dificulty; index++) {
      let tempCell = createElementFromHTML('<div class="cell left"></div>');
      table.appendChild(tempCell);
    }
    table.style.maxWidth = eachRow * 92;
    cells = Array.from(document.getElementsByClassName('cell'));
    addListener();
  }
  
  init();
  initScoreboard();
}