var util = require("util"),
    CONST = require('../game-constants'),
    Actor = require("./actor").Actor;

function Bullet(startX, startY, speed) {

    Actor.call(this, startX, startY);

    this.active = true;
    this.speed = speed;
    this.xVelocity = 0;
    this.yVelocity = -this.speed;
    this.width = 8;
    this.height = 8;
    this.color = "red";
    this.counter = 0;

}
Bullet.prototype = new Actor();

Bullet.prototype.inBounds = function() {
    return this.x >= 0 && this.x <= CONST.CANVAS_WIDTH &&
      this.y >= 0 && this.y <= CONST.CANVAS_HEIGHT;
};

//Need to draw all player bullets
Bullet.prototype.draw = function(curentPlayer) {

    for(i in curentPlayer.bullets) {
        var bullets = curentPlayer.bullets[i];
        var count = Math.floor(this.counter/4);
        var xoff = (count%4)*24;

        canvas.drawImage(
            bulletCache,
            this.x-4 ,this.y - 24
        );

    }
};

Bullet.prototype.update = function() {
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        this.counter++;
    this.active = this.active && this.inBounds();
};


exports.Bullet = Bullet;
