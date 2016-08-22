var util = require("util"),
    CONST = require('../game-constants'),
    Actor = require("./actor").Actor,
    Bullet = require("./bullet").Bullet;

function Player(startX, startY, name, color, id) {

    Actor.call(this, startX, startY, color);

    // this.local = local || false;
    this.id = id;
    this.active = true;
    this.lives = 3;
    this.score = 0;
    this.bullets = [];
    this.name = name;
    this.charging = true;
    this.lastFired = 0;
    this.powerPoints = 0;
    this.rateLimit = 90;
    this.dbID = null;
}

Player.prototype = new Actor();

Player.prototype.setDbID = function(dbId) {
    this.dbID = dbId;
};

Player.prototype.getDbID = function() {
    return this.dbID;
};

Player.prototype.explode = function() {

    this.lives -= 1;
    if ( this.lives == 0) {
        this.active = false;
    }
    // } else {

    // }
    util.log("damage player :" + this.id +
        " name: " + this.name +
        " lives: " + this.lives);
    // end the game
};

Player.prototype.addScore = function(score) {
    this.score = this.score + score || this.score + 1;
    this.powerUp(score || 1);


    util.log("Debug: player addScore");
};

Player.prototype.draw = function() {
    if (this.active){

        canvas.beginPath();
        Polygon(canvas, this.x + (this.width/2), this.y + (this.height/2),
            this.width/2 ,3,-Math.PI/2);
        canvas.strokeStyle = this.color;
        canvas.stroke()
    }
};

Player.prototype.powerUp = function(score) {
    this.powerPoints += score;

    if (this.powerPoints > 100) {
        this.charging = false;
    }
};

Player.prototype.shoot = function() {

    if ( this.active ) {
        var currentTime = Date.now();
        if ( ( currentTime - this.lastFired ) > this.rateLimit ){

            this.fire();
            // socket.emit("shoot player", {
            //         id: this.id
            // });
            return true;
        }
        this.lastFired = currentTime;
    }
};

Player.prototype.fire = function() {

    var bulletPosition = this.midpoint();
    var bullet = new Bullet(
            bulletPosition.x,
            bulletPosition.y,
            6);

    this.bullets.push(bullet);
    // console.log('pow');
};

Player.prototype.boom = function() {
    var that = this;
    if ( this.active ) {
        this.powerPoints = 0;
        this.charging = true;

        if (this.local === true) {

            socket.emit("boom player", {
                    id: this.id
            });
        }

        enemies.forEach(function(enemy) {
            that.addScore();
            enemy.takeDamage();
        });
    }
};

Player.prototype.gun = function() {

};

Player.prototype.getName = function() {
    return this.name;
};

Player.prototype.update = function(){

    var prevX = this.x,
        prevY = this.y,
        prevScore = this.score;

    if (this.local === true) {

        if ( keyDown.l ) {
            this.shoot();
        }
        if ( keyDown.k && !this.charging) {
            this.boom();
        }

        if ( keyDown.left  ) {
            this.x -= 4;
        }
        if ( keyDown.up  ) {
            this.y -= 4;
        }
        if ( keyDown.right ) {
            this.x += 4;
        }
        if ( keyDown.down ) {
            this.y += 4;
        }
    }

    this.x = this.x.clamp(0, CONST.CANVAS_WIDTH - this.width);
    this.y = this.y.clamp(0, CONST.CANVAS_HEIGHT - this.height);

    this.bullets.forEach(function(bullet) {
        bullet.update();
    });

    this.bullets = this.bullets.filter(function(bullet) {
        return bullet.active;
    });

    return (prevX != this.x || prevY != this.y) ? true : false;
};

exports.Player = Player;
