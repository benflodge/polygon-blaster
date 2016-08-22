function Polygon(ctx, x, y, radius, sides, startAngle, anticlockwise) {
    if (sides < 3) return;
    var a = (Math.PI * 2)/sides;
    a = anticlockwise?-a:a;
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(startAngle);
    ctx.moveTo(radius,0);
    for (var i = 1; i < sides; i++) {
        ctx.lineTo(radius*Math.cos(a*i),radius*Math.sin(a*i));
    }
    ctx.closePath();
    ctx.restore();
}

var bulletCache = false,
    triangleCache = false,
    diamondCache = false,
    drawPentagon = false,
    drawHexagon = false,
    drawSeptagon = false,
    drawOctagon = false,
    drawEnneagon = false,
    drawDecagon = false,
    drawUndecagon = false,
    drawDodecagon = false;

function drawBullet(){
    if( bulletCache == false ){ // create and save the title image
        bulletCache = document.createElement('canvas');
        bulletCache.width = 8;
        bulletCache.height = 8;

        var context = bulletCache.getContext('2d');
        // context.fillStyle = 'black';
        // context.fillRect( 0, 0, 368, 25 );
        // context.fillStyle = 'white';
        // context.font = "bold 21px Georgia";
        // context.fillText( "SINTEL", 10, 20 );
        context.beginPath();
        Polygon(context, 4 , 4, 8/2 , 6, -Math.PI/2);
        context.strokeStyle =  '#FFA500';
        context.stroke()
    }

}
drawBullet();

/*
function drawTriangle(){
    if( triangleCache == false ){ // create and save the title image
        triangleCache = document.createElement('canvas');
        triangleCache.width = osCanvas.width;
        triangleCache.height = 25;

        var context = triangleCache.getContext('2d');
        // context.fillStyle = 'black';
        // context.fillRect( 0, 0, 368, 25 );
        // context.fillStyle = 'white';
        // context.font = "bold 21px Georgia";
        // context.fillText( "SINTEL", 10, 20 );
        context.beginPath();
        Polygon(context, this.x + (this.width/2) ,this.y +(this.height/2),this.width/2 ,3,-Math.PI/2);
        context.strokeStyle = this.color;
        context.stroke()
    }

}

function drawDiamond(){
    if( diamondCache == false ){ // create and save the title image
        diamondCache = document.createElement('canvas');
        diamondCache.width = osCanvas.width;
        diamondCache.height = 25;

        var context = diamondCache.getContext('2d');
        // context.fillStyle = 'black';
        // context.fillRect( 0, 0, 368, 25 );
        // context.fillStyle = 'white';
        // context.font = "bold 21px Georgia";
        // context.fillText( "SINTEL", 10, 20 );
        context.beginPath();
        Polygon(context, this.x + (this.width/2) ,this.y +(this.height/2),this.width/2 ,3,-Math.PI/2);
        context.strokeStyle = this.color;
        context.stroke()
    }
}


function drawPentagon(){
    if( pentagonCache == false ){ // create and save the title image
        pentagonCache = document.createElement('canvas');
        pentagonCache.width = osCanvas.width;
        pentagonCache.height = 25;

        var context = pentagonCache.getContext('2d');
        // context.fillStyle = 'black';
        // context.fillRect( 0, 0, 368, 25 );
        // context.fillStyle = 'white';
        // context.font = "bold 21px Georgia";
        // context.fillText( "SINTEL", 10, 20 );
        context.beginPath();
        Polygon(context, this.x + (this.width/2) ,this.y +(this.height/2),this.width/2 ,3,-Math.PI/2);
        context.strokeStyle = this.color;
        context.stroke()
    }

}

function drawHexagon(){
    if( hexagonCache == false ){ // create and save the title image
        hexagonCache = document.createElement('canvas');
        hexagonCache.width = osCanvas.width;
        hexagonCache.height = 25;

        var context = hexagonCache.getContext('2d');
        // context.fillStyle = 'black';
        // context.fillRect( 0, 0, 368, 25 );
        // context.fillStyle = 'white';
        // context.font = "bold 21px Georgia";
        // context.fillText( "SINTEL", 10, 20 );
        context.beginPath();
        Polygon(context, this.x + (this.width/2) ,this.y +(this.height/2),this.width/2 ,3,-Math.PI/2);
        context.strokeStyle = this.color;
        context.stroke()
    }
}


function drawSeptagon(){
    if( septagonCache == false ){ // create and save the title image
        septagonCache = document.createElement('canvas');
        septagonCache.width = osCanvas.width;
        septagonCache.height = 25;

        var context = septagonCache.getContext('2d');
        // context.fillStyle = 'black';
        // context.fillRect( 0, 0, 368, 25 );
        // context.fillStyle = 'white';
        // context.font = "bold 21px Georgia";
        // context.fillText( "SINTEL", 10, 20 );
        context.beginPath();
        Polygon(context, this.x + (this.width/2) ,this.y +(this.height/2),this.width/2 ,3,-Math.PI/2);
        context.strokeStyle = this.color;
        context.stroke()
    }

}

function drawOctagon(){
    if( octagonCache == false ){ // create and save the title image
        octagonCache = document.createElement('canvas');
        octagonCache.width = osCanvas.width;
        octagonCache.height = 25;

        var context = octagonCache.getContext('2d');
        // context.fillStyle = 'black';
        // context.fillRect( 0, 0, 368, 25 );
        // context.fillStyle = 'white';
        // context.font = "bold 21px Georgia";
        // context.fillText( "SINTEL", 10, 20 );
                context.beginPath();
        Polygon(context, this.x + (this.width/2) ,this.y +(this.height/2),this.width/2 ,3,-Math.PI/2);
        context.strokeStyle = this.color;
        context.stroke()
    }
}


function drawEnneagon(){
    if( enneagonCache == false ){ // create and save the title image
        enneagonCache = document.createElement('canvas');
        enneagonCache.width = osCanvas.width;
        enneagonCache.height = 25;

        var context = enneagonCache.getContext('2d');
        // context.fillStyle = 'black';
        // context.fillRect( 0, 0, 368, 25 );
        // context.fillStyle = 'white';
        // context.font = "bold 21px Georgia";
        // context.fillText( "SINTEL", 10, 20 );
                context.beginPath();
        Polygon(context, this.x + (this.width/2) ,this.y +(this.height/2),this.width/2 ,3,-Math.PI/2);
        context.strokeStyle = this.color;
        context.stroke()
    }

}

function drawDecagon(){
    if( undecagonCache == false ){ // create and save the title image
        decagonCache = document.createElement('canvas');
        decagonCache.width = osCanvas.width;
        decagonCache.height = 25;

        var context = decagonCache.getContext('2d');
                context.beginPath();
        Polygon(context, this.x + (this.width/2) ,this.y +(this.height/2),this.width/2 ,3,-Math.PI/2);
        context.strokeStyle = this.color;
        context.stroke()
    }
}


function drawUndecagon(){
    if( undecagonCache == false ){ // create and save the title image
        undecagonCache = document.createElement('canvas');
        undecagonCache.width = osCanvas.width;
        undecagonCache.height = 25;

        var context = undecagonCache.getContext('2d');
        // context.fillStyle = 'black';
        // context.fillRect( 0, 0, 368, 25 );
        // context.fillStyle = 'white';
        // context.font = "bold 21px Georgia";
        // context.fillText( "SINTEL", 10, 20 );
                context.beginPath();
        Polygon(context, this.x + (this.width/2) ,this.y +(this.height/2),this.width/2 ,3,-Math.PI/2);
        context.strokeStyle = this.color;
        context.stroke()
    }


}

function drawDodecagon(){
    if( dodecagonCache == false ){ // create and save the title image
        dodecagonCache = document.createElement('canvas');
        dodecagonCache.width = osCanvas.width;
        dodecagonCache.height = 25;

        var context = dodecagonCache.getContext('2d');
        // context.fillStyle = 'black';
        // context.fillRect( 0, 0, 368, 25 );
        // context.fillStyle = 'white';
        // context.font = "bold 21px Georgia";
        // context.fillText( "SINTEL", 10, 20 );
                context.beginPath();
        Polygon(context, this.x + (this.width/2) ,this.y +(this.height/2),this.width/2 ,3,-Math.PI/2);
        context.strokeStyle = this.color;
        context.stroke()
    }


}
*/