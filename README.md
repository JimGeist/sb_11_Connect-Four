# Connect Four Game

Project involved taking a rough JavaScript, html, and css and putting in the pieces required to make it a working game.

[Connect Four](https://jimgeist.github.io/sb_11_Connect-Four/)  

This version includes a new checkForWinNew function. The function does not check the entire board for a win and instead checks around the piece that was just played. The _win function required an update since it
was now receiving in some cases more than 4 coordinate pairs. The _win function now uses a reduce function to 
determine whether there were 4 or more consecutive pieces for the current player. The re-written checkForWinNew function is more efficient, but it is also not as straightforward as the original checkForWin.

The reduce method call in the _win function in checkForWinNew had its function changed to an arrow function. console logs were also removed from this version.

css was updated to include ball colors, different top row hover colors, and animation related styling.

The html board was updated to allow for a click anywhere on the board instead of only the top row. The messaging in the game was enhanced by adding a current player message above the board. This was necessary since the current player color only appeared as a hover color change on the top row, but you do not know who has the current turn if you don't hover on the top row.

A 'Start New Game' button was added. 

Comments were added to describe the functions.