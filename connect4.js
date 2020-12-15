/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = [1, 2]; // active player: 1 or 2
let nbrOfPlays = 0       // how many plays were made. maximum is WIDTH * HEIGHT
let continueGame = true;

const board = []; // array of rows, each row is array of cells  (board[y][x])

// the h1 on the board will get updated each turn. Declare it globally.
const boardMsg = document.getElementById("msg");


/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {

  // set "board" to empty HEIGHT x WIDTH matrix array.

  // [0,0] is the top left and [(HEIGHT-1),(WIDTH-1)] is the bottom right
  // Make the board array. Declare a row array, then push null onto
  //  null onto the row array WIDTH times. 
  // Push the row onto the board array.
  // NOTE TO SELF: Access to board is (y,x)!!!!
  for (let y = 0; y < HEIGHT; y++) {
    const row = []
    for (let x = 0; x < WIDTH; x++) {
      row.push(null);
    }
    board.push(row);
  }

}


/** setBoardMsg: sets the board message (H!) to the current player */

function setBoardMsg() {

  // currPlayer[0] was set to the new current player before 
  //  calling. currPlayer[1] is removed, always.
  boardMsg.innerText = `Player ${currPlayer[0]}'s turn`;
  boardMsg.classList.remove(`clrP${currPlayer[1]}`);
  boardMsg.classList.toggle(`clrP${currPlayer[0]}`);

}


/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {

  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");

  // build the top, header row, for the table. The background color of a cell
  //  in the header row changes to gold as the player hovers on the cell. 
  // Clicking on the cell is dropping the piece into that column.
  // Header row cell ids are 0 - WIDTH.

  // build the row element. The row contains the data elements (cells)
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.setAttribute("class", "clrHoverP1");
  top.addEventListener("click", handleClick);

  setBoardMsg();

  htmlBoard.addEventListener("click", handleBoardClick);

  const btn = document.getElementById("startNew")
  btn.addEventListener("click", startNewGame);

  // the header row will have WIDTH number of data elements (td).
  // each cell, td, has an id of 0 through (WIDTH  - 1)
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // The 'playable', piece occupied section of the game board has
  // HEIGHT rows. Create a row element, tr, then create a cell, table 
  // data (td) and add the cell to the row element. A row will have
  // WIDTH # of cells. Each cell is identified by the row (y) and the
  // column (x), id="y-x".
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}


/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {

  // not going to struggle and try to force the use of an array method!
  // we have a column in x and we need to check each row, y, starting 
  //  from the bottom of the column (HEIGHT -1) through the top. Stop
  //  checking immediately when null is found.
  for (let y = HEIGHT - 1; y > -1; y--) {
    if (!(board[y][x])) {
      return y;
    }
  }
  return null;

}


/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {

  // css for ball gradient courtesy of https://codepen.io/vikas78/pen/vYEymWd

  const cell = document.getElementById(`${y}-${x}`);

  const divGamePiece = document.createElement("div");
  // class="r{0 | 1 | 2 | 3 | 4 | 5} ball clrP{1 | 2}"
  //  r{0-5} - controls the animation for the div, 
  //  ball - the size (px), margin, and other styles for the ball
  //  clrP1 or clrP2 - control the color gradient on the ball. One is 
  //   green with gradients and the second is red with gradients.
  divGamePiece.setAttribute("class", `r${y} ball clrP${currPlayer[0]}`);
  cell.append(divGamePiece);

}


/** removeFromTable: update DOM to remove piece from HTML table of board */

function removeFromTable(y, x) {

  // removed play piece from HTML cell at y-x

  const cell = document.getElementById(`${y}-${x}`);

  // remove the game piece.
  // Assumption is that the game piece is the only thing in the table data element.
  cell.firstChild.remove();

}


/** endGame: announce game end */

function endGame(msg, gameWon) {

  //alert("Game Over")
  // alert was not used because of the way it popped up BEFORE the winning play was
  //  posted to the board. Instead, a message block was added above the game board
  //  to hold game messaging.
  boardMsg.innerText = msg;

  // set coloring and text on the message if nobody won
  if (gameWon === false) {
    boardMsg.classList.toggle(`clrP${currPlayer[0]}`);
    boardMsg.classList.add("clrPX");
  }

  // block further moves
  continueGame = false;

  // turn off top row hovering . . well, really keep it, but set it clrHoverPX.  
  const topRow = document.getElementById("column-top")
  topRow.classList.remove(`clrHoverP${currPlayer[0]}`);
  topRow.classList.toggle("clrHoverPX");

}


/** clearBoard: clears the JavaScript and HTML boards of pieces */

function clearBoards() {

  // Elements in the JavaScript board that are not null are reset to null.
  // Each cell is checked because we need to clear the matching table data element in 
  //  the HTML board when a non-null value is found.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (board[y][x]) {
        board[y][x] = null;
        removeFromTable(y, x);
      }
    }
  }

}


/** starNewGame: logic to control the reset of counters, flags, and boards for 
  the start of a new game. */

function startNewGame() {

  // Clear stuff
  nbrOfPlays = 0
  continueGame = true;

  // Before resetting current player, make sure we use the value to remove
  //  turn-related class styles from top column (the hover) and the message
  //  background color.
  const topRow = document.getElementById("column-top");
  topRow.classList.remove("clrHoverPX");
  topRow.classList.remove(`clrHoverP${currPlayer[0]}`);

  // "bX" exists when the previous game ended in a tie.
  boardMsg.classList.remove("clrPX");
  boardMsg.classList.remove(`clrP${currPlayer[0]}`);

  // clear the JavaScript board array and HTML table
  clearBoards();

  // Set up for colors and player for new game
  currPlayer[0] = 1;
  currPlayer[1] = 2;

  // set the hover color to player 1
  topRow.classList.toggle(`clrHoverP${currPlayer[0]}`);

  // set the message to player 1
  setBoardMsg();

}


/** playColumn: we have a column from either a top row click or from
     a click on the board. Continue the play using column x */

function playColumn(x) {

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  nbrOfPlays += 1;
  placeInTable(y, x);
  board[y][x] = currPlayer[0];

  // check for win
  if (checkForWin(y, x)) {
    return endGame(`Congratulations Player ${currPlayer[0]} - You Won!`, true);
  }

  // check for tie by checking nbrOfPlays counter against the board size.
  //  (yeah, you probably wanted to see a .every() array method call but a counter
  //  check requires less resources).
  if (nbrOfPlays === (WIDTH * HEIGHT)) {
    // tie game
    return endGame("Tied Game. Please try again.", false);
  }

  // switch players
  [currPlayer[0], currPlayer[1]] = [currPlayer[1], currPlayer[0]]

  // switch the hover color
  const topRow = document.getElementById("column-top");
  topRow.classList.toggle(`clrHoverP${currPlayer[1]}`);
  topRow.classList.toggle(`clrHoverP${currPlayer[0]}`);

  // set the board message that announces next player
  setBoardMsg();

}


/** handleBoardClick: handle click somewhere in the board */

function handleBoardClick(evt) {

  if (continueGame) {

    if ((evt.target.id.indexOf("-") > -1) || (evt.target.nodeName === "DIV")) {

      let elementId;

      if (evt.target.nodeName === "DIV") {
        // a div was clicked. get the id from the parent. It should be "y-x"
        elementId = evt.target.parentNode.id;
      } else {
        elementId = evt.target.id;
      }

      let posn = elementId.indexOf("-");
      if (posn > -1) {
        // elementId contains a -. it should be y-x. We need the 'x'
        let column = elementId.slice((posn + 1));

        playColumn(column);

      }
    }
  }
}


/** handleClick: handle click of column top to play piece */

function handleClick(evt) {

  if (continueGame) {

    // get x from ID of clicked cell
    let x = +evt.target.id;

    // code that existed in original handleClick was moved to playColumn 
    //  because the board is also a clickable element. The same logic
    //  is needed to play the column once the column of the clicked cell 
    //  is determined when the board is clicked.
    playColumn(x);

  }
}


/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {

  function _win(cells) {

    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer[0]
    );
  }

  // Don't check until there are more than 6 pieces on the board.
  if (nbrOfPlays > 6) {

    // Initially thought this code was inefficient since it checks the entire board and figured one 
    //  checks for a win based on the piece just played is better.. until I started wrting it.
    // The stock code was tweaked by starting the y from the bottom of the board -- where there are 
    //  most likely pieces, instead of top down.
    //
    // For EVERY cell on the board, build 4 sets of coordinates for horizontal, vertical, diagonal 
    //  right (\) and diagonal left (/) coordinates. Coordinates that go out of bound on the board 
    //  will not pass the check performed in _win.  

    for (let y = (HEIGHT - 1); y > -1; y--) {
      for (let x = 0; x < WIDTH; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y - 1, x], [y - 2, x], [y - 3, x]];
        const diagDR = [[y, x], [y - 1, x + 1], [y - 2, x + 2], [y - 3, x + 3]];
        const diagDL = [[y, x], [y - 1, x - 1], [y - 2, x - 2], [y - 3, x - 3]];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }

  }
}

makeBoard();
makeHtmlBoard();
