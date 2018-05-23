var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

// turn function. check if tie and turns stop. check tie and best spot functionand stop player fromc linking aon an already clicked spot
function turnClick(square) {
	//if type clicked is a number no one has played in that spot
	if (typeof origBoard[square.target.id] == 'number')
	turn(square.target.id, huPlayer)
	if (!checkTie()) turn(bestSpot(), aiPlayer)
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	//checks if game is won on each turn
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}
//reduce methdod to go thru the board to see what empty spaces there are
//if element = player takes accumulater array and adds index to array. if e !=poalyer returns as is
function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, [] );
	let gameWon = null;
	//lops thru win combos
	for (let [index, win] of winCombos.entries()) {
		if(win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break; 
		}
	}
	return gameWon;
}
//Game Over function handling all rules for game over
//backbround color changes depending on who wins
function gameOver (gameWon) {
	for (let index of winCombos [gameWon.index]) {
		document.getElementById(index).style.backgroundColor = 
			gameWon.player == huPlayer ? "blue" : "red";
	}
	// for loop that stops clicking once game won or over
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner (gameWon.player == huPlayer ? "You Win!" : "You Lose!")

}


function declareWinner (who) {
	document.querySelector(".endgame").style.display = 'block';
	document.querySelector(".endgame. text").innerText = who;
}

//if the square is a number it has not been played in
function emptySquares () {
	return origBoard.filter (s => typeof s == 'number');
}
// create basic AI and show winner box w/o minmax algorithm. find empty squares and plays in first empty square
function bestSpot () {
	return emptySquares() [0];
}
//if every square is filled but no winner that is a tie
function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = 'green';
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner ("Tie Game!")
		return true;
	}
	return false;
}

//finish basic AI section. AI plays in next open spot.