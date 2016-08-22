var util = require("util"),
    CONST = require('../game-constants'),
    Actor = require("./actor").Actor;

function Enemy(startX, startY, sides, color, age, id) {

    Actor.call(this, startX, startY, color);

    this.age = age || Math.floor(Math.random() * 128);

    this.xVelocity = 0;
    this.yVelocity = 1.5;

    //life changes number of polygon sides 3 is minimum poly size
    this.sides = sides || 3;
    this.lives = this.sides - 2;
    this.id = id || this.born.toString(36);

    this.width = 32;
    this.height = 32;

}

Enemy.prototype = new Actor();

Enemy.prototype.inBounds = function() {
    return this.x >= 0 && this.x <= CONST.CANVAS_WIDTH &&
           this.y >= 0 && this.y <= CONST.CANVAS_HEIGHT;
};

Enemy.prototype.draw = function(sides) {

    canvas.beginPath();
    Polygon(canvas, this.x + (this.width/2) ,this.y +(this.height/2),
        this.width/2 , this.sides,-Math.PI/2);
    canvas.strokeStyle = this.color;
    canvas.stroke();
};

Enemy.prototype.update = function(transX, transY) {
    this.x += this.xVelocity;
    this.y += this.yVelocity;

    // this.x += transX;
    // this.y += transY;

    this.xVelocity = 3 * Math.sin(this.age * Math.PI / 64);

    this.age++;

    this.active = this.active && this.inBounds();
};

Enemy.prototype.getSides = function() {
    return this.sides;
};

Enemy.prototype.getAge = function() {
    return this.age;
};

Enemy.prototype.setlives = function(newLives) {
    this.lives = newLives;
    this.sides = newLives - 2;
};

Enemy.prototype.removeLife = function() {

    this.lives--;
    this.sides--;

    if (this.lives == 0){

         this.explode();
    }
    util.log("damage enemy :" + this.id +
        " lives: " + this.lives +
        " sides: " + this.sides);

};

Enemy.prototype.explode = function() {

    this.active = false;
    this.diedAt = Date.now();

    util.log("Enemy destroyed: " + this.id);

    // socket.emit("damage enemy", {
    //         id: this.id
    // });

};

// Enemy.prototype.takeDamage = function(damage) {
//     this.life --;
//     this.sides --;
//     if (this.life == 0){
//         this.explode();
//     } else {
//         socket.emit("damage enemy", {
//             id: this.id
//         });
//     }
// };

// Enemy.prototype.damage = function(damage) {
//     this.life --;
//     this.sides --;
//     if (this.life === 0){
//         this.explode();
//     }
// };

exports.Enemy = Enemy;
