function Actor(startX, startY, color, id, born) {

    this.x = startX;
    this.y = startY;
    this.width = 48;
    this.height = 48;
    this.color = color || 'blue';
    this.active = true;
    this.lives = 3;
    this.score = 0;
    this.id = id || null;
    this.born = born || Date.now();
    this.diedAt = null;

}

Actor.prototype.addScore = function(score) {
    this.score = this.score + score || this.score + 1;
};
Actor.prototype.midpoint = function() {
    return {
        x: this.x + this.width/2,
        y: this.y + this.height/2
    };
};
Actor.prototype.getId = function() {
    return this.id;
};
Actor.prototype.getColor = function() {
    return this.color;
};
Actor.prototype.getX = function() {
    return this.x;
};
Actor.prototype.getY = function() {
    return this.y;
};
Actor.prototype.getLives = function() {
    return this.lives;
};
Actor.prototype.getScore = function() {
    return this.score;
};
Actor.prototype.getIsActive = function() {
    return this.active;
};
Actor.prototype.setX = function(newX) {
    this.x = newX;
};
Actor.prototype.setY = function(newY) {
    this.y = newY;
};
Actor.prototype.transX = function(newX) {
    this.x += newX;
};
Actor.prototype.transY = function(newY) {
    this.y += newY;
};
Actor.prototype.setScore = function(newScore) {
    this.score = newScore;
};
Actor.prototype.setLives = function(newLives) {
    this.lives = newLives;
};
Actor.prototype.setIsActive = function(isActive) {
    this.active = isActive;
};
Actor.prototype.getBorn = function() {
    return this.born;
};
exports.Actor = Actor;