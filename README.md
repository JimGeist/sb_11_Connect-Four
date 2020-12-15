# Connect Four Game

Project involved taking a rough JavaScript, html, and css and putting in the pieces required to make it a working game.

[Connect Four](https://jimgeist.github.io/sb_11_Connect-Four/)  

Attempts were made to create an efficient checkForWin -- one that was based on the piece just played instead of the existing checkForWin that checks the entire board from top left to bottom right. The existing checkForWin was updated to at least check the board from the bottom right to the top left. checkForWin also does not execute until there are more than 6 pieces on the board.

css was updated to include ball colors, different top row hover colors, and animation related styling.

The html board was updated to allow for a click anywhere on the board instead of only the top row. The messaging in the game was enhanced by adding a current player message above the board. This was necessary since the current player color only appeared as a hover color change on the top row, but you do not know who has the current turn if you don't hover on the top row.

A 'Start New Game' button was added. 

Comments were added to describe the functions.