/* Game Code */

var CANVAS_WIDTH = 700,
	CANVAS_HEIGHT = 500,
	canvasElement = document.getElementById("canvas");
canvasElement.setAttribute("width", CANVAS_WIDTH);
canvasElement.setAttribute("height", CANVAS_HEIGHT);

var canvas = canvasElement.getContext("2d");

var ship_image,
	bomb_image,
	bullet_image,
	enemy_skull,
	socket,
	player,
	enemies = [],
	remotePlayers,
	playerInfo,
	scores = [];

function getInfo() {
    $.ajax({
        url:'/game/users/me',
        type:'GET',
        dataType:"json",
        success:function (data) {
            console.log("Login request details: ", data);

            if(data.error) {
            	window.location.replace('/');
            } else {
            	initGame(data.name);
            }
        },
        error: function () {
        	window.location.replace('/');
        },
        xhrFields: {
   			withCredentials: true
		},
	    crossDomain: true
    });
}

function initGame(playerName, color) {

	playerInfo = { playerName:playerName};
	socket = io.connect("http://benflodge.ovh:8000/");
	//loadResources();
	remotePlayers = [];
	setEventHandlers();
}

/******************************************************************************/
/* Socket Event Handlers */
var setEventHandlers = function() {
	// sockets
	socket.on("connect", onSocketConnected);
	socket.on("connect conf", onSocketConf);
	socket.on("disconnect", onSocketDisconnect);
	socket.on("new player", onNewPlayer);
	socket.on("move player", onMovePlayer);
	socket.on("remove player", onRemovePlayer);
	// socket.on("new enemy", addEnemy);
	// socket.on("damage enemy", damageEnemy);
	socket.on("shoot player", onShootPlayer);
	socket.on("boom player", onBoomPlayer);
	socket.on("update poll", updateGame);
}

function onSocketConnected() {
    console.log("Connected to socket server");
}

function onSocketConf(data) {
    console.log("Connected to socket server");

    player = new Player(data.x, data.y, data.name, data.color, true, data.born, data.id);

    runGame();
	//player.id = data.id;
}

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
}

/******************************************************************************/
/* Player updates */
function onNewPlayer(data) {
    console.log("New player connected: " + data.id);

    var newPlayer = new Player(data.x, data.y, data.name, data.color, data.born);
	newPlayer.id = data.id;
	remotePlayers.push(newPlayer);
}

function onMovePlayer(data) {
	// var thisPlayer = playerById(data.id);

	// if (!thisPlayer) {
	//     console.log("Player not found: " + data.id);
	//     return;
	// };

	// thisPlayer.setX(data.x);
	// thisPlayer.setY(data.y);
	//thisPlayer.setScore(data.score);
	//thisPlayer.setLives(data.lives);
	//thisPlayer.setIsActive(data.active);

	//console.log("player" + thisPlayer + "data" + data);
}

function onShootPlayer(data) {
	var thisPlayer = playerById(data.id);

	if (!thisPlayer) {
	    console.log("Player not found: " + data.id);
	    return;
	};

	thisPlayer.fire();

	console.log("player fireing" + thisPlayer.id + "data" + data.id);
}

function onBoomPlayer(data) {
	var thisPlayer = playerById(data.id);

	if (!thisPlayer) {
	    console.log("Player not found: " + data.id);
	    return;
	};

	thisPlayer.boom();
	console.log("player booming" + thisPlayer.id + "data" + data.id);

}

function onRemovePlayer(data) {
	console.log("Player disconnected: "+data.id);
	var removePlayer = playerById(data.id);

	if (!removePlayer) {
	    console.log("Player not found: "+data.id);
	    return;
	};

	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
}

function playerById(id) {
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].id == id)
            return remotePlayers[i];
    };

    return false;
}

/******************************************************************************/
/* Enemy Functions */

// function addEnemy(data) {
// 	console.log('add enemy: ' + data);
// 	var enemy = new Enemy(data.x, data.y, data.sides, data.color, data.age, data.id);
// 	enemies.push(enemy);
// }

// function damageEnemy(data) {
// 	console.log('damage enemy: ' +data.id);
// 	var enemy = enemiesById(data.id);
// 	enemy.damage();
// }

function enemiesById(id) {
    var i;
    for (i = 0; i < enemies.length; i++) {
        if (enemies[i].id == id){
            return enemies[i];
        }
    }
    return false;
}

/******************************************************************************/
/* Game Poller update */
function updateGame(data) {

	// console.log("Game Update form Broadcast: " + data);

	//This function should only get data that has changed
	// socket.on("update poll", updateGame);
	//Up date actors :-
		//GameState:-
			//time
		//Players :-
			//position
			//Score
			//lifes?
			//power?
			//Bullits
		//Enemys :-
			// sides
			// position

	data.players.forEach(function(thatPlayer){
		if (player && thatPlayer.id == player.id){

			player.setScore(thatPlayer.score);
			player.setLives(thatPlayer.lives);
			player.setIsActive(thatPlayer.active);

		} else {
			var thisPlayer = playerById(thatPlayer.id);
			if (thisPlayer) {
				thisPlayer.setX(thatPlayer.x);
				thisPlayer.setY(thatPlayer.y);
				thisPlayer.setScore(thatPlayer.score);
				thisPlayer.setLives(thatPlayer.lives);
				thisPlayer.setIsActive(thatPlayer.active);
			}
		}

	});

	data.enemies.forEach(function(newEnemy) {

		//FIXME Enemy life or lives :P
		var enemy = enemiesById(newEnemy.id);
		if(enemy){
		    enemy.update(newEnemy.x, newEnemy.y, newEnemy.sides, newEnemy.active, newEnemy.diedAt);
		} else if (newEnemy.active) {
			enemy = new Enemy(newEnemy.x, newEnemy.y, newEnemy.sides, newEnemy.color, newEnemy.age, newEnemy.id, newEnemy.diedAt);
			enemies.push(enemy);
		}

	});
	// Remove dead
}

/******************************************************************************/
/* Game updates */
function draw() {

	canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	player.draw();
	player.bullets.forEach(function(bullet) {
		bullet.draw(player);
	});

	enemies.forEach(function(enemy) {
		enemy.draw();
	});

	var i;

	for (i = 0; i < remotePlayers.length; i++) {
	    remotePlayers[i].draw(canvas);

	    remotePlayers[i].bullets.forEach(function(bullet) {
			bullet.draw(remotePlayers[i]);
		});
	};

	//redraw GUI
	updatePower();
	updateScore();
	updateLives();
	updateScores();

}
function update() {

	// console.log(Date().now)
	if(player != null){
		if (player.update()) {
		    socket.emit("move player", {
		    	score: player.getScore(),
		    	lives: player.getLives(),
		    	active: player.getIsActive(),
		    	x: player.getX(),
		    	y: player.getY()
		    });
		};
	}

	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		remotePlayers[i].update();
	};

	enemies.forEach(function(enemy) {
	    enemy.update();
	});

	handleCollisions();

	var timeNow = Date.now();

	//Remove dead/old enemys
	enemies = enemies.filter(function(enemy) {

		// if (enemy.active){
  //           return true;
  //   	} else if (enemy.diedAt > (timeNow - 1000)){
  //           console.log('Dont REMOVE:' + enemy.diedAt);
  //           return true;
  //       } else if(enemy.diedAt){
  //           console.log('REMOVE:' + enemy.diedAt );
  //       }
		return enemy.active || enemy.diedAt > (timeNow - 1000);
	});

}

/******************************************************************************/
/* GUI */
var powerBar = document.getElementById("power-bar");
var scoresBox = document.getElementById("scores");
var scoreBox = document.getElementById("player-score");
var livesBox = document.getElementById("player-lives");

function updatePower() {
	powerBar.style.width = player.powerPoints + "%";
}
function updateScore () {
	scoreBox.innerHTML = player.score;
}
function updateLives () {
	livesBox.innerHTML = player.lives;
}
function updateScores () {
	var scoreString = "";

	for (var i = 0; i < remotePlayers.length; i++) {
		scoreString = scoreString + remotePlayers[i].name + ": " + remotePlayers[i].score + " ";
	};
	scoresBox.innerHTML = player.name + ': ' + player.score + " " + scoreString;
}
function gameOver(player){
	console.log("Game Over "+ player.name + " You score "+ player.score );
	//add more $$
}

/******************************************************************************/
/* Game Functions */
function collides(a, b) {
	return a.x < b.x + b.width &&
		   a.x + a.width > b.x &&
		   a.y < b.y + b.height &&
		   a.y + a.height > b.y;
}

function handleCollisions() {

	player.bullets.forEach(function(bullet) {
		if(!bullet.active){return};
		enemies.forEach(function(enemy) {
			if(!enemy.active){return};
			if (collides(bullet, enemy)) {
				player.addScore();
				enemy.takeDamage();
				bullet.active = false;

			}
		});
	});

	for (var i = 0; i < remotePlayers.length; i++) {

		remotePlayers[i].bullets.forEach(function(bullet) {
			if(!bullet.active){return};
			enemies.forEach(function(enemy) {
				if(!enemy.active){return};
				if (collides(bullet, enemy)) {

					bullet.active = false;

				}
			});
		});
	};
}

getInfo();
/******************************************************************************/
/* Game loop */
var FPS = 60;
var gameSpeed = 30;
var now;
var then = Date.now();
var interval = 1000/FPS;
var delta;

// SetInterval phsysics loop
var gameLoop;

function runGame(){

	gameLoop = setInterval( function(){
		update();
    }, 1000/gameSpeed );

    reAnimate();
}

//Request animation frame GFX loop
var reAnimate = function() {

	requestAnimationFrame(reAnimate);

	now = Date.now();
	delta = now - then;

	if ( delta > interval ) {

		then = now - (delta % interval);
		//animate();
		draw();
	}
}
