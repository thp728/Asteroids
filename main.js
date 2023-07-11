import { Asteroid } from "./Asteroid.js";
import { Ship } from "./Ship.js";
import { Bullet } from "./Bullet.js";

export let canvas;
export let ctx; // context - used to draw on canvas
export let canvasWidth = 1400;
export let canvasHeight = 900;
let ship;
let keys = []; // allows multiple key presses at the same time
let bullets = [];
let asteroids = [];
let score = 0;
let lives = 3;

document.addEventListener('DOMContentLoaded', SetupCanvas);

function SetupCanvas() {
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ship = new Ship();

    for(let i=0; i<8; i++) {
        asteroids.push(new Asteroid());
    }

    document.body.addEventListener("keydown", function(e){
        keys[e.keyCode] = true;
    });
    document.body.addEventListener("keyup", function(e){
        keys[e.keyCode] = false;
        if(e.keyCode === 32) {
            bullets.push(new Bullet(ship.angle));
        }
    });
    Render();
}

function CircleCollisions(p1x, p1y, r1, p2x, p2y, r2) {
    let radiusSum;
    let xDiff;
    let yDiff;
    radiusSum = r1 + r2;
    xDiff = p1x - p2x;
    yDiff = p1y - p2y;

    if(radiusSum > Math.sqrt((xDiff*xDiff) + (yDiff*yDiff)) ) {
        return true;
    } else {
        return false;
    }
}

function DrawLifeShips() {
    let startX = 1350;
    let startY = 10;
    let points = [[9,9], [-9,9]];
    ctx.strokeStyle = 'white';

    for(let i=0; i<lives; i++) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        for(let j=0; j<points.length; j++) {
            ctx.lineTo(startX+points[j][0], startY + points[j][1]);
        }
        ctx.closePath();
        ctx.stroke();
        startX -= 30;
    }
}

// Update positions of all shapes and also draw them 
function Render() {
    ship.movingForward = (keys[87]); // W key
    // D key
    if(keys[68]) {
        ship.Rotate(1);
    }
    // A key
    if(keys[65]) {
        ship.Rotate(-1);
    }

    ctx.clearRect(0,0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'white';
    ctx.font = '21px Arial';
    ctx.fillText('SCORE: '+ score.toString(), 20, 35);
    if(lives<=0) {
        ship.visible = false;
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.fillText('GAME OVER', canvasWidth/2 - 150, canvasHeight/2);
    }
    DrawLifeShips();

    if(asteroids.length !== 0) {
        for(let k=0; k<asteroids.length; k++) {
            if(CircleCollisions(ship.x, ship.y, 11, asteroids[k].x, asteroids[k].y, asteroids[k].collisionRadius)) {
                ship.x = canvasWidth/2;
                ship.y = canvasHeight/2;
                ship.velX = 0;
                ship.velY = 0;
                lives -= 1;
            }
        }
    }

    if(asteroids.length !== 0 && bullets.length !== 0) {
loop1:
        for(let l=0; l<asteroids.length; l++) {
            for(let m=0; m<bullets.length; m++) {
                if(CircleCollisions(bullets[m].x, bullets[m].y, 3, asteroids[l].x, asteroids[l].y, asteroids[l].collisionRadius)) {
                    if(asteroids[l].level === 1) {
                        asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 25, 2, 22));
                        asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 25, 2, 22));
                    } else if(asteroids[l].level === 2) {
                        asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 15, 3, 12));
                        asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 15, 3, 12));
                    }

                    // Delete colliding asteroid and bullet
                    asteroids.splice(l, 1);
                    bullets.splice(m, 1);

                    score += 10;
                    break loop1;
                }
            }
        }
    }

    if(ship.visible) {
        ship.Update();
        ship.Draw();
    }


    if(bullets.length !== 0) {
        for(let i=0; i<bullets.length; i++) {
            bullets[i].Update();
            bullets[i].Draw();
        }
    }

    if(asteroids.length !== 0) {
        for(let j=0; j<asteroids.length; j++) {
            asteroids[j].Update();
            asteroids[j].Draw(j);
        }
    }

    // Repeatedly calls Render()
    requestAnimationFrame(Render);
}