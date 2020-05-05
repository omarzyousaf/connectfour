/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let p1 = document.querySelector('.play1');
let p2 = document.querySelector('.play2');

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
	// TODO: set "board" to empty HEIGHT x WIDTH matrix array
	//loop over HEIGHT (6) times to signify the 6 rows
	for (let i = 0; i < HEIGHT; i++) {
		//create an empty array
		let arr = [];
		//push the empty array into the empty "board" array
		board.push(arr);
		//loop over WIDTH times (7) to create the length of each row
		for (let i = 0; i < WIDTH; i++) {
			//push "null" into each "arr" array
			arr.push(null);
		}
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	const htmlBoard = document.querySelector('#board');

	// TODO: add comment for this code
	//creates the top row, sets its attributes to give it CSS properties
	let top = document.createElement('tr');
	top.setAttribute('id', 'column-top');

	//when a player clicks in the top row, the handleClick function will run
	top.addEventListener('click', handleClick);

	//loop over WIDTH (7) times
	for (let x = 0; x < WIDTH; x++) {
		//create a td (table data/cell)
		let headCell = document.createElement('td');
		//add the attribute to signify it as the head cell
		headCell.setAttribute('id', x);
		//append it to the top row
		top.append(headCell);
	}
	//append the top row to the HTML board
	htmlBoard.append(top);

	// TODO: add comment for this code
	// loop over HEIGHT times, which is 6
	for (let y = 0; y < HEIGHT; y++) {
		//create a row each time
		const row = document.createElement('tr');
		//loop over WIDTH times, 7
		for (let x = 0; x < WIDTH; x++) {
			//create a cell for each row
			const cell = document.createElement('td');
			//set its attribute based on its position
			cell.setAttribute('id', `${y}-${x}`);
			//append it to the row
			row.append(cell);
		}
		//append all the rows to the gameboard
		htmlBoard.append(row);
	}

	//select the top row
	let topTr = document.querySelector('tr');

	//show color of current player when hovering over top row
	//check if currPlayer is Player 1, use e.target to change each cell in top row as you hover
	topTr.addEventListener('mouseover', (e) => {
		let target = e.target;
		if (currPlayer === 1) {
			target.style.backgroundColor = 'red';
		} else {
			target.style.backgroundColor = 'gold';
		}
	});
	//have the color go back to blue when done hovering so that it doesn't stay red or gold
	topTr.addEventListener('mouseout', (e) => {
		let target = e.target;
		target.style.backgroundColor = 'rgba(0, 41, 203, 0.954)';
	});
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	// TODO: write the real version of this, rather than always returning 0
	//this was a little confusing, but the y coordinate will be HEIGHT (6)
	//we want to make sure that the clicked y,x coordinate is FALSE
	//if it is FALSE, it will drop the piece to the bottom
	for (let y = HEIGHT - 1; y >= 0; y--) {
		if (!board[y][x]) {
			return y;
		}
	}
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	// TODO: make a div and insert into correct table cell
	const move = document.createElement('div');
	move.classList.add('piece');
	//decides what color for the piece to be
	move.classList.add(`p${currPlayer}`);
	//adds animation for the fall
	move.classList.add(`fall`);

	//this code was in the Solution key but I am unsure what it is for:
	// move.style.top = -50 * (y + 2);

	//add the position ID to the current position and then append the created div to that position
	const position = document.getElementById(`${y}-${x}`);
	position.append(move);
}

/** endGame: announce game end */

function endGame(msg) {
	// TODO: pop up alert message
	// this delivers a special pop up alert when a player wins the game
	Swal.fire('Good job!', msg, 'success');
}

function switchPlayers() {
	// switch players
	// TODO: switch currPlayer 1 <-> 2
	currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);

	//when switching players, toggle the player button class on and off
	if (currPlayer === 1) {
		p1.classList.add('on');
		p2.classList.remove('on');
	} else if (currPlayer === 2) {
		p2.classList.add('on');
		p1.classList.remove('on');
	}
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get "x" coordinate from ID of clicked cell
	const x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	// TODO: add line to update in-memory board
	board[y][x] = currPlayer;
	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`);
	}

	// check for tie
	// TODO: check if all cells in board are filled; if so call, call endGame
	let tie = board.every(function(val) {
		return val > 0;
	});
	if (tie) {
		endGame('Game is a TIE! Play again.');
	}

	switchPlayers();
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	// TODO: read and understand this code. Add comments to help you.
	//for each y coordinate and each x coordinate,
	//check to see if the four surrounding coordinates are filled horizontally, vertically, or either direction diagonally.
	// if there are four coordinates filled of the same color, return true
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

function reset() {
	let gameboard = document.querySelector('#board');
	gameboard.innerHTML = ''; //clear the contents of the game
	board = []; //clear the board array
	currPlayer = 2; //set it to 2 because the function switchPlayers() will bring it back to 1
	switchPlayers();
	makeBoard();
	makeHtmlBoard();
}

//RESET button
const resetBtn = document.querySelector('button');
resetBtn.addEventListener('click', () => {
	reset();
});
makeBoard();
makeHtmlBoard();
