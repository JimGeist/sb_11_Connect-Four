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
  top.setAttribute("class", "player1");
  top.addEventListener("click", handleClick);

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

  // css for ball courtesy of https://codepen.io/vikas78/pen/vYEymWd

  const cell = document.getElementById(`${y}-${x}`);

  const divGamePiece = document.createElement("div");
  divGamePiece.setAttribute("class", `ball b${currPlayer[0]}`);
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

function endGame(msg) {

  //alert("Game Over")
  // alert was not used because of the way it popped up BEFORE the winning play was
  //  posted to the board. Instead, a message block was added above the game board
  //  to hold game completion messages.
  document.getElementById("msg").innerText = msg;

  // block further moves
  continueGame = false;

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


/** starNewGame: logic to control the reset of counters, flags, and boards for the start of a 
     new game. */

function startNewGame() {

  nbrOfPlays = 0
  continueGame = true;
  // The &nbsp; in the h2 message will keep the space between the top of page and the 
  //  game board free for messages without shifting when a message is added.
  document.getElementById("msg").innerHTML = "&nbsp;"

  currPlayer[0] = 1;
  currPlayer[1] = 2;

  clearBoards();

}


/** handleClick: handle click of column top to play piece */

function handleClick(evt) {

  if (continueGame) {

    // get x from ID of clicked cell
    let x = +evt.target.id;

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
      return endGame(`Congratulations Player ${currPlayer[0]} - You Won!`);
    }

    // check for tie by checking nbrOfPlays counter against the board size.
    //  (yeah, you probably wanted to see a .every() array method call but a counter
    //  check requires less resources).
    if (nbrOfPlays === (WIDTH * HEIGHT)) {
      // tie game
      return endGame("Tied Game. Please Play Again.");
    }

    // switch players
    [currPlayer[0], currPlayer[1]] = [currPlayer[1], currPlayer[0]]

    // switch the hover color
    const top = document.getElementById("column-top");
    top.classList.toggle(`player${currPlayer[1]}`);
    top.classList.toggle(`player${currPlayer[0]}`);

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
