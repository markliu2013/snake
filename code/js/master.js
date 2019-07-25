var gameState = 1;// game status  1 stopped  2 running  3 paused
var gridRowNum = 30;
var gridColNum = 30;
var snakeArr = null;// the coordinates snake holding
var food = null;// the coordinate food holding
var speed = 200;// speed,  the milliseconds to move a grid
var direction = 39;// direction of snake, init to right
var moveThread = null;
$(function() {
	initGrid(gridRowNum, gridColNum);
	initsnakeArr();
	drawSnake();
	initFood();
	bindKeyBoard();
	initControl();
});

function initsnakeArr() {
	snakeArr = [[1, 1], [2, 1], [3, 1]];
}

function startNewGame() {
	gridRowNum = parseInt($("#select-gridRowNum").val());
	gridColNum = parseInt($("#select-gridColNum").val());
	speed = parseInt($("#select-speed").val());
	direction = 39;
	initGrid(gridRowNum, gridColNum);
	initsnakeArr();
	drawSnake();
	initFood();
	resetMoveThread();
	gameState = 2;
	updateGameStateText();
	updateScore();
	$("#pause-game").removeClass("disabled");
	$("#stop-game").removeClass("disabled");
}

function pauseGame() {
	clearInterval(moveThread);
	gameState = 3;
	updateGameStateText();
	$("#pause-game").text("Continue");
	$("#pause-game").addClass("paused");
}
function continueGame() {
	resetMoveThread();
	gameState = 2;
	updateGameStateText();
	$("#pause-game").text("Pause");
	$("#pause-game").removeClass("paused");
}
function stopGame() {
	clearInterval(moveThread);
	initsnakeArr();
	drawSnake();
	initFood();
	gameState = 1;
	updateGameStateText();
	$("#pause-game").addClass("disabled");
	$("#stop-game").addClass("disabled");
}

/**
 * 初始化Grid
 */
function initGrid(rows, cols) {
	var gridHTML = '';
	for(var i=0; i<rows; i++) {
		gridHTML += '<div class="row clearfix">';
		for(var j=0; j<cols; j++) {
			gridHTML += '<div class="col">';
			gridHTML += '</div>';
		}
		gridHTML += '</div>';
	}
	$("#snake-grid").html(gridHTML);
}

/**
 * draw the snake on the grid, call when init.
 * @param snakeArr
 */
function drawSnake() {
	$("#snake-grid .row .col.on").removeClass("on");
	for(var i=0; i<snakeArr.length; i++) {
		$("#snake-grid .row:nth-child("+snakeArr[i][1]+") .col:nth-child("+snakeArr[i][0]+")").addClass("on");
	}
}

/**
 * main function of snake run
 */
function snakeRun() {
	if (direction == 37) {
		moveLeft();
	}
	else if (direction == 38) {
		moveUp();
	}
	else if (direction == 39) {
		moveRight();
	}
	else if (direction == 40) {
		moveDown();
	}
}
/**
 * reset the thread of sanke
 */
function resetMoveThread() {
	clearInterval(moveThread);
	moveThread = setInterval(snakeRun, speed);
}
/**
 * snake moves up a grid
 */
function moveUp() {
	var nextNode = [snakeArr[snakeArr.length-1][0], snakeArr[snakeArr.length-1][1]-1];
	if (checkEqual(food, nextNode)) {//the next step will get food
		snakeArr.push(food);
		updateScore();
		initFood();
		return;
	}
	var lastNode = snakeArr[snakeArr.length-1];
	if ((lastNode[1]-1) < 1 || checkExists([lastNode[0], lastNode[1]-1], snakeArr)) {// knock the wall or self
		clearInterval(moveThread);
		gameState = 1;
		updateGameStateText();
		$("#pause-game").addClass("disabled");
		return;
	}
	//update DOM and snakeArr
	$("#snake-grid .row:nth-child("+snakeArr[0][1]+") .col:nth-child("+snakeArr[0][0]+")").removeClass("on");
	snakeArr.shift();
	$("#snake-grid .row:nth-child("+(lastNode[1]-1)+") .col:nth-child("+lastNode[0]+")").addClass("on");
	snakeArr.push([lastNode[0], lastNode[1]-1]);
}
/**
 * snake moves right a grid
 */
function moveRight() {
	var nextNode = [snakeArr[snakeArr.length-1][0]+1, snakeArr[snakeArr.length-1][1]];
	if (checkEqual(food, nextNode)) {//the next step will get food
		snakeArr.push(food);
		updateScore();
		initFood();
		return;
	}
	var lastNode = snakeArr[snakeArr.length-1];
	// check if out of bounds
	if ((lastNode[0]+1) > gridColNum || checkExists([lastNode[0]+1, lastNode[1]], snakeArr)) {// knock the wall or self
		clearInterval(moveThread);
		gameState = 1;
		updateGameStateText();
		$("#pause-game").addClass("disabled");
		return;
	}
	//update DOM and snakeArr
	$("#snake-grid .row:nth-child("+snakeArr[0][1]+") .col:nth-child("+snakeArr[0][0]+")").removeClass("on");
	snakeArr.shift();
	$("#snake-grid .row:nth-child("+lastNode[1]+") .col:nth-child("+(lastNode[0]+1)+")").addClass("on");
	snakeArr.push([lastNode[0]+1, lastNode[1]]);

	//drawSnake();// no need to draw again.
}
/**
 * snake moves down a grid
 */
function moveDown() {
	var nextNode = [snakeArr[snakeArr.length-1][0], snakeArr[snakeArr.length-1][1]+1];
	if (checkEqual(food, nextNode)) {//the next step will get food
		snakeArr.push(food);
		updateScore();
		initFood();
		return;
	}
	var lastNode = snakeArr[snakeArr.length-1];
	if ((lastNode[1]+1) > gridRowNum || checkExists([lastNode[0], lastNode[1]+1], snakeArr)) {// knock the wall or self
		clearInterval(moveThread);
		gameState = 1;
		updateGameStateText();
		$("#pause-game").addClass("disabled");
		return;
	}
	//update DOM and snakeArr
	$("#snake-grid .row:nth-child("+snakeArr[0][1]+") .col:nth-child("+snakeArr[0][0]+")").removeClass("on");
	snakeArr.shift();
	$("#snake-grid .row:nth-child("+(lastNode[1]+1)+") .col:nth-child("+lastNode[0]+")").addClass("on");
	snakeArr.push([lastNode[0], lastNode[1]+1]);
}
/**
 * snake moves left a grid
 */
function moveLeft() {
	var nextNode = [snakeArr[snakeArr.length-1][0]-1, snakeArr[snakeArr.length-1][1]];
	if (checkEqual(food, nextNode)) {//the next step will get food
		snakeArr.push(food);
		updateScore();
		initFood();
		return;
	}
	var lastNode = snakeArr[snakeArr.length-1];
	//check if out of bounds
	if ((lastNode[0]-1) < 1 || checkExists([lastNode[0]-1, lastNode[1]], snakeArr)) {//knock the wall or self
		clearInterval(moveThread);
		gameState = 1;
		updateGameStateText();
		$("#pause-game").addClass("disabled");
		return;
	}
	//update DOM and snakeArr
	$("#snake-grid .row:nth-child("+snakeArr[0][1]+") .col:nth-child("+snakeArr[0][0]+")").removeClass("on");
	snakeArr.shift();
	$("#snake-grid .row:nth-child("+lastNode[1]+") .col:nth-child("+(lastNode[0]-1)+")").addClass("on");
	snakeArr.push([lastNode[0]-1, lastNode[1]]);
}
/**
 * bind keyboard event
 */
function bindKeyBoard() {
	$(document).bind("keydown", function(event) {
		if (gameState != 2) {
			return;
		}
		// direction can't be switched in a short time, to avoid switch direction quickly, reset the thread.
		if (event.keyCode==37) {//left
			if (direction != 39) {
				resetMoveThread();
				direction = event.keyCode;
				moveLeft(); // when you change direction, move one step immediately.
			}
			event.preventDefault();
		}
		else if (event.keyCode==38) {//up
			if (direction != 40) {
				resetMoveThread();
				direction = event.keyCode;
				moveUp();
			}
			event.preventDefault();
		}
		else if (event.keyCode==39) {//right
			if (direction != 37) {
				resetMoveThread();
				direction = event.keyCode;
				moveRight();
			}
			event.preventDefault();
		}
		else if (event.keyCode==40) {//down
			if (direction != 38) {
				resetMoveThread();
				direction = event.keyCode;
				moveDown();
			}
			event.preventDefault();
		}
	});
}

/**
 * random a food not over the snake
 */
function initFood() {
	food = null;
	while (true) {
		food = getRandomPoint();
		if (!checkExists(food, snakeArr)) {
			break;
		}
	}
	$("#snake-grid .row:nth-child("+food[1]+") .col:nth-child("+food[0]+")").addClass("on");
}

function getRandomPoint() {
	//two random numbers within gridRowNum and gridColNum
	var x = Math.floor(Math.random()*gridColNum+1);
	var y = Math.floor(Math.random()*gridRowNum+1);
	return [x,y];
}
/**
 * check if the two array equals
 * @param arr1
 * @param arr2
 */
function checkEqual(arr1, arr2) {
	return arr1.toString() == arr2.toString();
}
/**
 * check if arr2 contains arr1
 * @param arr1
 * @param arr2
 */
function checkExists(arr1, arr2) {
	for (var i=0; i<arr2.length; i++) {
		if (checkEqual(arr1, arr2[i])) {
			return true;
		}
	}
	return false;
}

function initControl() {
	$("#start-game").bind("click", function(event) {
		startNewGame();
		return false;
	});
	$("#pause-game").bind("click", function(event) {
		if ($(this).hasClass("disabled")) {
			return false;
		}
		if ($(this).hasClass("paused")) {
			continueGame();
		} else {
			pauseGame();
		}
		return false;
	});
	$("#stop-game").bind("click", function(event) {
		if ($(this).hasClass("disabled")) {
			return false;
		}
		stopGame();
		return false;
	})
}

function updateGameStateText() {
	switch (gameState) {
		case 1:
			$("#game-state").text("Stopped");
			break;
		case 2:
			$("#game-state").text("Runniing");
			break;
		case 3:
			$("#game-state").text("Paused");
			break;
	}
}

function updateScore() {
	$("#score-num").text(snakeArr.length);
}






















