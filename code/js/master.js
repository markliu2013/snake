var gameState = 1;//游戏的状态 1停止  2运行  3已暂停
var gridRowNum = 30;
var gridColNum = 30;
var snakeArr = null;//存储snake所占的grid数据
var food = null;//存储food所占的grid数据
var speed = 200;//速度，单位毫秒，表示多少毫秒移动一格
var direction = 39;//蛇运动的方向，初始化向右。
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
	$("#pause-game").text("继续");
	$("#pause-game").addClass("paused");
}
function continueGame() {
	resetMoveThread();
	gameState = 2;
	updateGameStateText();
	$("#pause-game").text("暂停");
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
 * 在grid中画出蛇，只在初始化时调用。
 * @param snakeArr
 */
function drawSnake() {
	$("#snake-grid .row .col.on").removeClass("on");
	for(var i=0; i<snakeArr.length; i++) {
		$("#snake-grid .row:nth-child("+snakeArr[i][1]+") .col:nth-child("+snakeArr[i][0]+")").addClass("on");
	}
}

/**
 * 蛇运动的总函数
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
 * 重置蛇运动的线程
 */
function resetMoveThread() {
	clearInterval(moveThread);
	moveThread = setInterval(snakeRun, speed);
}
/**
 * 蛇向上移动一格
 */
function moveUp() {
	var nextNode = [snakeArr[snakeArr.length-1][0], snakeArr[snakeArr.length-1][1]-1];
	if (checkEqual(food, nextNode)) {//下一步吃到食物
		snakeArr.push(food);
		updateScore();
		initFood();
		return;
	}
	var lastNode = snakeArr[snakeArr.length-1];
	if ((lastNode[1]-1) < 1 || checkExists([lastNode[0], lastNode[1]-1], snakeArr)) {//撞到墙或撞到自己
		clearInterval(moveThread);
		gameState = 1;
		updateGameStateText();
		$("#pause-game").addClass("disabled");
		return;
	}
	//更新DOM和snakeArr
	$("#snake-grid .row:nth-child("+snakeArr[0][1]+") .col:nth-child("+snakeArr[0][0]+")").removeClass("on");
	snakeArr.shift();
	$("#snake-grid .row:nth-child("+(lastNode[1]-1)+") .col:nth-child("+lastNode[0]+")").addClass("on");
	snakeArr.push([lastNode[0], lastNode[1]-1]);
}
/**
 * 蛇向右移动一格
 */
function moveRight() {
	var nextNode = [snakeArr[snakeArr.length-1][0]+1, snakeArr[snakeArr.length-1][1]];
	if (checkEqual(food, nextNode)) {//下一步吃到食物
		snakeArr.push(food);
		updateScore();
		initFood();
		return;
	}
	var lastNode = snakeArr[snakeArr.length-1];
	//先判断是否要越界？
	if ((lastNode[0]+1) > gridColNum || checkExists([lastNode[0]+1, lastNode[1]], snakeArr)) {//撞到墙或撞到自己
		clearInterval(moveThread);
		gameState = 1;
		updateGameStateText();
		$("#pause-game").addClass("disabled");
		return;
	}
	//更新DOM和snakeArr
	$("#snake-grid .row:nth-child("+snakeArr[0][1]+") .col:nth-child("+snakeArr[0][0]+")").removeClass("on");
	snakeArr.shift();
	$("#snake-grid .row:nth-child("+lastNode[1]+") .col:nth-child("+(lastNode[0]+1)+")").addClass("on");
	snakeArr.push([lastNode[0]+1, lastNode[1]]);

	//drawSnake();//重新画一遍蛇，不好。
}
/**
 * 向下移动一格
 */
function moveDown() {
	var nextNode = [snakeArr[snakeArr.length-1][0], snakeArr[snakeArr.length-1][1]+1];
	if (checkEqual(food, nextNode)) {//下一步吃到食物
		snakeArr.push(food);
		updateScore();
		initFood();
		return;
	}
	var lastNode = snakeArr[snakeArr.length-1];
	if ((lastNode[1]+1) > gridRowNum || checkExists([lastNode[0], lastNode[1]+1], snakeArr)) {//撞到墙或撞到自己
		clearInterval(moveThread);
		gameState = 1;
		updateGameStateText();
		$("#pause-game").addClass("disabled");
		return;
	}
	//更新DOM和snakeArr
	$("#snake-grid .row:nth-child("+snakeArr[0][1]+") .col:nth-child("+snakeArr[0][0]+")").removeClass("on");
	snakeArr.shift();
	$("#snake-grid .row:nth-child("+(lastNode[1]+1)+") .col:nth-child("+lastNode[0]+")").addClass("on");
	snakeArr.push([lastNode[0], lastNode[1]+1]);
}
/**
 * 向左移动一格
 */
function moveLeft() {
	var nextNode = [snakeArr[snakeArr.length-1][0]-1, snakeArr[snakeArr.length-1][1]];
	if (checkEqual(food, nextNode)) {//下一步吃到食物
		snakeArr.push(food);
		updateScore();
		initFood();
		return;
	}
	var lastNode = snakeArr[snakeArr.length-1];
	//先判断是否要越界？
	if ((lastNode[0]-1) < 1 || checkExists([lastNode[0]-1, lastNode[1]], snakeArr)) {//撞到墙或撞到自己
		clearInterval(moveThread);
		gameState = 1;
		updateGameStateText();
		$("#pause-game").addClass("disabled");
		return;
	}
	//更新DOM和snakeArr
	$("#snake-grid .row:nth-child("+snakeArr[0][1]+") .col:nth-child("+snakeArr[0][0]+")").removeClass("on");
	snakeArr.shift();
	$("#snake-grid .row:nth-child("+lastNode[1]+") .col:nth-child("+(lastNode[0]-1)+")").addClass("on");
	snakeArr.push([lastNode[0]-1, lastNode[1]]);
}
/**
 * 绑定键盘事件
 */
function bindKeyBoard() {
	$(document).bind("keydown", function(event) {
		if (gameState != 2) {
			return;
		}
		//方向不能瞬间掉头，为防止快速切换方向，重置线程。
		if (event.keyCode==37) {//left
			if (direction != 39) {
				resetMoveThread();
				direction = event.keyCode;
				moveLeft();
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
 * 随机生成一个食物,保证了食物不出现在蛇身上。
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
	//需要随机生成两个不超过gridRowNum，gridColNum的随机数
	var x = Math.floor(Math.random()*gridColNum+1);
	var y = Math.floor(Math.random()*gridRowNum+1);
	return [x,y];
}
/**
 * 判断两个数组是否相等
 * @param arr1
 * @param arr2
 */
function checkEqual(arr1, arr2) {
	return arr1.toString() == arr2.toString();
}
/**
 * 监察arr2是否包含arr1
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
			$("#game-state").text("游戏停止");
			break;
		case 2:
			$("#game-state").text("正在游戏");
			break;
		case 3:
			$("#game-state").text("游戏暂停");
			break;
	}
}

function updateScore() {
	$("#score-num").text(snakeArr.length);
}






















