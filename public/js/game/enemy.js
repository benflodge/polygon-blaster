function Enemy(startX, startY, sides, color, age, id, born) {

    Actor.call(this, startX, startY, color, born);

    this.age = age || Math.floor(Math.random() * 128);

    //age fancy maths to figure out latancy ?
    // age++;


    this.xVelocity = 0;
    this.yVelocity = 1.5;

    //life changes number of polygon sides 3 is minimum poly size
    this.sides = sides || 3;
    this.life = this.sides - 2;
    this.id = id;

    this.width = 32;
    this.height = 32;

}

Enemy.prototype = new Actor();

Enemy.prototype.inBounds = function() {
    return this.x >= 0 && this.x <= CANVAS_WIDTH &&
           this.y >= 0 && this.y <= CANVAS_HEIGHT;
};

Enemy.prototype.draw = function(sides) {

    canvas.beginPath();
    Polygon(canvas, this.x + (this.width/2), this.y +(this.height/2),
        this.width/2, this.sides, -Math.PI/2);
    canvas.strokeStyle = this.color;
    canvas.stroke();
};

Enemy.prototype.update = function(setX, setY, sides, active, diedAt) {

    if (setX && setY){
        this.x = setX;
        this.y = setY;
    } else {
        this.x += this.xVelocity;
        this.y += this.yVelocity;
    }

    if (sides){
        this.sides = sides;
    }

    if(null != active){
        this.active = active && this.inBounds();
    } else {
        this.active = this.active && this.inBounds();
    }

    if(diedAt){
        this.diedAt = diedAt;
    }

    // this.xVelocity = 3 * Math.sin(this.age * Math.PI / 64);
    this.age++;
};

Enemy.prototype.explode = function() {
    this.active = false;

    socket.emit("damage enemy", {
            id: this.id
    });

// Add an explosion graphic
};
Enemy.prototype.takeDamage = function(damage) {

    this.life --;
    this.sides --;

    if (this.life === 0){

        this.explode();
    } else {

        socket.emit("damage enemy", {
            id: this.id
        });
    }

};
// Enemy.prototype.damage = function(damage) {

//     this.life --;
//     this.sides --;

//     if (this.life === 0){

//         this.active = false;
//     }
// };