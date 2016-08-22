var util = require('util'),
    _u = require('underscore'),
    CONST = require('./game-constants'),
    Player = require('./model/player').Player,
    Enemy = require('./model/enemy').Enemy,
    setPlayerScore = require('./api').setPlayerScore;

//Init with socket io room instance
function Game(io, gameId) {
    this.io = io;

    this.players = [];
    this.enemies = [];
    this.deltaTime = Date.now();

    //FIXME Set game ID used to identify game score and use for multiple games.
}

_u.extend(Game.prototype, {

    initGame: function() {

        this.setEventHandlers();
        this.gameLoop(); // FIXME Is first loop needed ?

        this.broadcastInterval = setInterval(this.broadcastPoller.bind(this),
            1000/CONST.BROADCAST_POLLER_SPEED);

        this.loopinterval = setInterval(this.gameLoop.bind(this),
            1000/CONST.GAME_SPEED);

        this.saveStatePoller = setInterval(this.savePoller.bind(this),
            1000);

    },

    setEventHandlers: function() {
        this.io.on('connection', this.onSocketConnection.bind(this));
    },

    onSocketConnection: function(socket) {
        util.log('New player has connected: ' + socket.id);

        // Socket Admin
        // Get session info for connected user then return user to client
        socket.request.sessionStore.get(socket.request.sessionID,
            this.serverReady.bind(this, socket));

        socket.on('disconnect', this.onClientDisconnect.bind(this, socket));

        // Player Controls
        socket.on('move player', this.onMovePlayer.bind(this, socket));
        socket.on('damage enemy', this.damageEnemy.bind(this, socket));
        socket.on('shoot player', this.shootPlayer.bind(this, socket));
        socket.on('boom player', this.onBoomPlayer.bind(this, socket));
    },

    serverReady: function(socket, err, data){
        if(err || !data){
            return;
        }

        if (!data.user) {
            console.log('Player not found in system, Please log in.')
            return;
        }
        console.log('Player found starting game', data);
        this.onNewPlayer.call(this, socket, data.user);
    },

    onClientDisconnect: function(socket) {
        util.log('Player has disconnected: ' + socket.id);
        var removePlayer = playerById(this.players, socket.id);

        if (!removePlayer) {
            util.log('Player not found: ' + socket.id);
            return;
        };
        this.players.splice(this.players.indexOf(removePlayer), 1);
        socket.broadcast.emit('remove player', {id: socket.id});
    },

    /******************************************************************************/
    /* Broadcast poller */
    /******************************************************************************/
    broadcastPoller: function(socket) {
        this.io.emit('update poll', {
            players: this.players,
            enemies: this.enemies
        });
    },

    /******************************************************************************/
    /* Player Handlers */
    /******************************************************************************/

    onNewPlayer: function(socket, data) {
        var i,
            existingPlayer,
            newPlayer = new Player(20, 400, data.user, data.color, socket.id);
        // newPlayer.id = socket.id;

        newPlayer.setDbID(data['_id']);

        console.log(util.inspect(data , false, null));

        //Inform all Clients of new player
        socket.broadcast.emit('new player', {
            id: newPlayer.id,
            x: newPlayer.getX(),
            y: newPlayer.getY(),
            lives: newPlayer.getLives(),
            color: newPlayer.getColor(),
            name: newPlayer.getName(),
            born: newPlayer.getBorn()
        });

        //Send new player info back to client
        socket.emit('connect conf', {
            id: newPlayer.id,
            x: newPlayer.getX(),
            y: newPlayer.getY(),
            lives: newPlayer.getLives(),
            color: newPlayer.getColor(),
            name: newPlayer.getName(),
            born: newPlayer.getBorn()
        });

        // Send all current players back to client
        for (i = 0; i < this.players.length; i++) {
            existingPlayer = this.players[i];
            socket.emit('new player', {
                id: existingPlayer.id,
                x: existingPlayer.getX(),
                y: existingPlayer.getY(),
                lives: existingPlayer.getLives(),
                color: newPlayer.getColor(),
                name: newPlayer.getName(),
                born: newPlayer.getBorn()
            });
        };
        this.players.push(newPlayer);

    },

    onMovePlayer: function(socket, data) {

        var movePlayer = playerById(this.players, socket.id);
        if (!movePlayer) {
            util.log('Player not found: ' + socket.id);
            return;
        };

        /* FIXME Need to check user input ?
         * IE data.x < movePlayer.getX +4 &&  data.x > movePlayer.getX - 4 ?
         * 4 = MAXIMUM_MOVE_DIST
         * ELSE move max dist in appropriate distance
         */

        movePlayer.setX(data.x);
        movePlayer.setY(data.y);

        /* Removed as broadcastPoller now handles client updates */
        //movePlayer.setScore(data.score);
        //movePlayer.setLives(data.lives);
        //movePlayer.setIsActive(data.active);
        // this.broadcast.emit('move player', {
        //  id:           movePlayer.id,
        //  x:            movePlayer.getX(),
        //  y:            movePlayer.getY(),
        //  lives:        movePlayer.getLives(),
        //  active:       movePlayer.getIsActive(),
        //  score:        movePlayer.getScore()
        // });
    },

    shootPlayer: function(socket, data){

        var movePlayer = playerById(this.players, socket.id);

        if (!movePlayer) {
            util.log('Player not found: ' + socket.id);
            return;
        };

        movePlayer.shoot();
        socket.broadcast.emit('shoot player', {
            id:  socket.id
        });

    },

    onBoomPlayer: function(socket, data){

        var movePlayer = playerById(this.players, socket.id);

        if (!movePlayer) {
            util.log('Player not found: ' + socket.id);
            return;
        };

        socket.broadcast.emit('boom player', {
            id:  socket.id
        });
    },

    /******************************************************************************/
    /* Enemy Event Handlers */
    /******************************************************************************/
    newEnemy: function(x, y, sides, color, age) {
        var enemy = new Enemy(x, y, sides, color, age);

        this.io.emit('new enemy', {
            x: enemy.getX(),
            y: enemy.getY(),
            lives: enemy.getLives(),
            color: enemy.getColor(),
            sides: enemy.getSides(),
            age: enemy.getAge(),
            born: enemy.getBorn(),
            id: enemy.getId()
        });

        this.enemies.push(enemy);
    },

    damageEnemy: function(data) {
        var enemy = enemiesById(this.enemies, data.id);
        if (!enemy) {
            util.log('enemy not found: ', data.id);
            return;
        };

        // FIXME Do we need to check the player data at this point ?
        // Enemy damage is now handled server side by
        // enemy.removeLife();

        /* Removed as broadcastPoller now handles client updates */
        // this.broadcast.emit('damage enemy', {
        //     id: data.id
        // });

        //util.log('enemy has been damaged: ' + data.id + ' life left: ' + enemy.getLives() );
        //  if (enemy.getLives() === 0) {
            // enemies.splice(enemies.indexOf(enemy), 1);
            // util.log('enemy has been killed :' + data.id);
        //}
    },

    /*  FIXME
    *   Fix score so it increments by right amount!
    */
    savePoller: function(){
        this.players.forEach(function(player){
            setPlayerScore(player.getDbID(), player.score);
        });
    },

    /******************************************************************************/
    /* Game Logic */
    /******************************************************************************/
    gameLoop: function() {

        this.players.forEach(function(player) {
            player.update();
        });

        this.enemies.forEach(function(enemy) {
            enemy.update();
        });

        this.handleCollisions();

        var timeNow = Date.now();

        // Remove dead/old enemies
        this.enemies = this.enemies.filter(function(enemy) {
            return enemy.active || enemy.diedAt > (timeNow - 1000);
        });

        this.addEnemey();

    },

    handleCollisions: function() {

        for (var i = 0; i < this.players.length; i++) {
            this.players[i].bullets.forEach(function(bullet) {
                if(!bullet.active){return};

                this.enemies.forEach(function(enemy) {
                    if(!enemy.active){return};

                    if (collides(bullet, enemy)) {
                        bullet.active = false;
                        this.players[i].addScore();
                        enemy.removeLife();
                    }
                }, this);
            }, this);

            this.enemies.forEach(function(enemy) {
                if (this.players[i].active){
                    if (collides(enemy, this.players[i])) {
                        if(!enemy.active){return};

                        enemy.explode();
                        this.players[i].explode();
                    }
                }
            }, this);
        };
    },

    addEnemey: function(){
        var sides;

        if(Math.random() < 0.01) {
            sides = randomIntFromInterval(1, 1200);
            switch (true) {
                case sides > 1150:
                    sides = 12;
                    break;
                case sides > 1100:
                    sides = 11;
                    break;
                case sides > 1050:
                    sides = 10;
                    break;
                case sides > 950:
                    sides = 9;
                    break;
                case sides > 850:
                    sides = 8;
                    break;
                case sides > 750:
                    sides = 7;
                    break;
                case sides > 600:
                    sides = 6;
                    break;
                case sides > 400:
                    sides = 5;
                    break;
                case sides > 300:
                    sides = 4;
                    break;
                default:
                    sides = 3;
            }

            this.newEnemy(randomIntFromInterval(100, 600), 0, sides, '#A2B');
            //FIXME add more enemies depending on combined player score
        }
    }
});


/******************************************************************************/
/* Game Functions */
/******************************************************************************/
function collides(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function playerById (players, id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    };

    return false;
}

function enemiesById(enemies, id) {
    var i;
    for (i = 0; i < enemies.length; i++) {
        if (enemies[i].id == id)
            return enemies[i];
    };

    return false;
}

/******************************************************************************/
/* Higher Order Func & Prototypes */
/******************************************************************************/
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

function forEach(array, action){
    for ( var i = 0; i < array.length; i++ )
        action(array[i]);
}

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

/******************************************************************************/

module.exports = Game;
