/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = [1, 2]; // active player: 1 or 2
let nbrOfPlays = 0 // how many plays were made. maximum is WIDTH * HEIGHT
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
  // FUTURE CODE -- Turn the header row off when column is full.

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
  // TODO: write the real version of this, rather than always returning 0

  // not going to struggle and try to force the use of an array method!
  // we have a column in x and we need to check each row, y, starting 
  //  from the bottom of the column (HEIGHT -1) through the top. Stop
  //  checking immediately when null is found.
  // FUTURE ENHANCEMENT - ??turn the column off when returning 0 for y??
  for (let y = HEIGHT - 1; y > -1; y--) {
    if (!(board[y][x])) {
      return y;
    }
  }
  return null;

}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  // css for ball courtesy of https://codepen.io/vikas78/pen/vYEymWd

  const cell = document.getElementById(`${y}-${x}`);

  const divGamePiece = document.createElement("div");
  divGamePiece.setAttribute("class", `ball b${currPlayer[0]}`);
  cell.append(divGamePiece);
  //cell.innerText = currPlayer[0];

}

/** placeInTable: update DOM to place piece into HTML table of board */

function removeFromTable(y, x) {

  // removed play piece from HTML cell at y-x

  const cell = document.getElementById(`${y}-${x}`);

  // remove the game piece.
  // Assumption is that the game piece is the only thing in the
  //  table data element.
  cell.firstChild.remove();

}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  //alert("Game Over")
  document.getElementById("msg").innerText = msg;

  continueGame = false;

  nbrOfPlays = (WIDTH * HEIGHT) + 1;

}


function clearBoard() {

  // all elements in the JavaScript board array are reset to null.


  // NOTE TO SELF: Access to board is (y,x)!!!!
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (board[y][x]) {
        board[y][x] = null;
        removeFromTable(y, x);

      }
    }
  }

}

function startNewGame() {

  nbrOfPlays = 0
  continueGame = true;
  document.getElementById("msg").innerHTML = "&nbsp;"

  currPlayer[0] = 1;
  currPlayer[1] = 2;

  clearBoard();

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
    // TODO: add line to update in-memory board
    nbrOfPlays += 1;
    placeInTable(y, x);
    board[y][x] = currPlayer[0];

    // check for win
    if (checkForWin(y, x)) {
      return endGame(`Congratulations Player ${currPlayer[0]} - You Won!`);
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame
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
    // The stock code was tweaked bu starting the y from the bottom of the board -- where there are 
    //  most likely pieces, instead of the top down.
    // For EVERY cell on the board, build 4-pair sets for horizontal, vertical, diagonal right (\) 
    //  and diagonal coordinates. Coordinates that go out of bound on the board will not pass the 
    //  check performed in _win.  
    // Inefficient since it repeatedly checks entire board when you need to 
    //  only check around the piece that was just played.
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

    // for (let y = 0; y < HEIGHT; y++) {
    //   for (let x = 0; x < WIDTH; x++) {
    //     const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
    //     const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
    //     const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
    //     const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

    //     if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
    //       return true;
    //     }
    //   }
    // }

  }
}

function checkForWinNew(y, x) {

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

  function _adjustMin(a, aMin, b, bMin) {

    // if ((x - xMin) < (y - yMin)) {
    //   // we need to adjust yMin
    //   yMin = y - ((x - xMin));
    // }    
    if ((a - aMin) < (b - bMin)) {
      // we need to adjust bMin
      return b - ((a - aMin));
    }
    return bMin
  }


  function _adjustMax(a, aMax, b, bMax) {

    // if ((xMax - x) < (yMax - y)) {
    //   // we need to adjust yMax
    //   yMax = y + ((xMax - x));
    // }        
    if ((aMax - a) < (bMax - b)) {
      // we need to adjust yMax
      return b + ((aMax - a));
    }
    return bMax;
  }


  // Don't bother checking until there are more than 6 pieces on the board.
  if (nbrOfPlays > 6) {


    // instead of checking the entire board from 0,0 to (HEIGHT - 1), (WIDTH - 1)
    //  just look around the piece that was just played. 
    let xMin = x - 3;
    let xMax = x + 3;
    let yMin = y - 3;
    let yMax = y + 3;

    // clip the min and max to make sure we do not go out of bounds.
    // Maxes are adjusted by when because we check for < when building pairs.
    xMin < 0 ? xMin = 0 : xMin = xMin;
    yMin < 0 ? yMin = 0 : yMin = yMin;
    xMax > (WIDTH - 1) ? xMax = WIDTH : xMax = xMax + 1;
    yMax > (HEIGHT - 1) ? yMax = HEIGHT : yMax = yMax + 1;

    console.log(`xIn ${x}: range: ${xMin} - ${xMax}`);
    console.log(`yIn ${y}: range: ${yMin} - ${yMax}`);

    // Build the horizontal, vertical, diagDR, and diagDL coordinates of the cells we 
    //  we need to check for a win.
    const horiz = [];
    for (let xCtr = xMin; xCtr < xMax; xCtr++) {
      // y is constant for horizontal
      horiz.push([y, xCtr]);
    }

    const vert = [];
    // for (let yCtr = yMin; yCtr < yMax; yCtr++) {
    //   // x is constant for vertical
    //   vert.push([yCtr, x]);
    // }    
    for (let yCtr = yMax; yCtr > yMin; yCtr--) {
      // x is constant for vertical. Built max to min
      //  because the board fills from max (bottom) to min (top). 
      vert.push([(yCtr - 1), x]);
    }

    console.log(`y=${y}, x=${x}: horiz: ${JSON.stringify(horiz)}`);
    console.log(`y=${y}, x=${x}: vert: ${JSON.stringify(vert)}`);


    // for the diagonals, we need to check for check for clipping and adjust the 
    //  minimums and maximums so both the xMin, yMin are the same distance from x
    //  and y
    // if ((x - xMin) < (y - yMin)) {
    //   // we need to adjust yMin
    //   yMin = y - ((x - xMin));
    // }
    let yDLMin = _adjustMin(x, xMin, y, yMin);
    let xDLMin = _adjustMin(y, yMin, x, xMin);
    let yDLMax = _adjustMax(x, xMax, y, yMax);
    let xDLMax = _adjustMax(y, yMax, x, xMax);


    console.log(`adjusted xMin ${xDLMin}, adjusted yMin ${yDLMin}.`)
    console.log(`adjusted xMax ${xDLMax}, adjusted yMax ${yDLMax}.`)

    // Build the coordinate pairs for the \ diagonal. 
    // The pairings are from xMax, yMax to xMin, yMin. We start at 
    //  the bottom of the board (yMax) and work up (decreasing y)
    //  because the board bottom is most likely to have pieces to 
    //  check. 
    const diagDL = [];
    let adj = 0;
    for (let xCtr = xMax; xCtr > xMin; xCtr--) {
      diagDL.push([yMax - adj - 1, xCtr - 1]);
      adj++;
    }
    console.log(`y=${y}, x=${x}: diagDL: ${JSON.stringify(diagDL)}`);

    // Build coordinate pairs for / diagonal. This one will need new
    //  mins and maxes because the pairings are a yMax, xMin to
    //  yMin, xMax.
    // As before, we start on the bottom of the board and work up.
    yMax = _adjustMin(x, xMin, yMax, y);
    xMin = _adjustMin(yMax, y, x, xMin);

    yMin = _adjustMax(x, xMax, y, yMin);


    xMax = _adjustMax(y, yMin, x, xMax);
    //                x  xMax       y yMax
    // if ((     -  ) < (yMax - y)) {
    // if ((yMin - y) < (yMax - y)) {
    //   // we need to adjust yMax
    //   // we need to adjust yMax
    //   yMax = y + ((xMax -  ));
    //   yMax = y + ((xMax - y));
    // }

    const diagDR = [];
    adj = 0;
    for (let xCtr = xMin; xCtr < xMax; xCtr++) {
      diagDR.push([yMax - adj, xCtr]);
      adj++;
    }
    console.log(`y=${y}, x=${x}: diagDR: ${JSON.stringify(diagDR)}`);

    console.log("");

    // TODO: read and understand this code. Add comments to help you.
    // Inefficient since it repeatedly checks entire board when you need to 
    //  only check around the piece that was just played.
    // for (let y = 0; y < HEIGHT; y++) {
    //   for (let x = 0; x < WIDTH; x++) {
    //     const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
    //     const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
    //     const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
    //     const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

    //     if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
    //       return true;
    //     }
    //   }
    // }

  } else {
    console.log("win check bypassed, nbrOfPlays =", nbrOfPlays);
  }

}

makeBoard();
makeHtmlBoard();
