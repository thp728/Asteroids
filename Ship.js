import { canvas, ctx, canvasWidth, canvasHeight } from "./main.js";

export class Ship {
    constructor() {
        this.visible = true;
        this.x = canvasWidth/2;
        this.y = canvasHeight/2;
        this.movingForward = false;
        this.speed = 0.1;
        this.velX = 0;
        this.velY = 0;
        this.rotateSpeed = 0.001;
        this.radius = 15;
        this.angle = 0; // degrees
        this.strokeColor = 'white';
        this.noseX = canvasWidth/2 + 15;
        this.noseY = canvasHeight/2;
    }

    // Rotate the ship
    Rotate(dir) {
        // dir is +1 or -1
        this.angle += this.rotateSpeed * dir;
    }

    // Handles moving the ship
    Update() {
        let radians = this.angle / Math.PI * 180;

        // oldX + cos(radians) * distance
        // oldY + sin(radians) * distance
        if(this.movingForward) {
            this.velX += Math.cos(radians) * this.speed;
            this.velY += Math.sin(radians) * this.speed;
        }

        // Ship crosses the borders of the screen
        if(this.x < this.radius) {
            this.x = canvas.width;
        }
        if(this.x > canvas.width) {
            this.x = this.radius;
        }
        if(this.y < this.radius) {
            this.y = canvas.height;
        }
        if(this.y > canvas.height) {
            this.y = this.radius;
        }

        // Slowing down if key not pressed
        this.velX *= 0.99;
        this.velY *= 0.99;

        // Simulating air friction
        this.x -= this.velX;
        this.y -= this.velY;
    }

    Draw() {
        ctx.strokeStyle = this.strokeColor;
        ctx.beginPath();
        let vertAngle = ((Math.PI * 2) /3);
        let radians = this.angle / Math.PI * 180;
        this.noseX = this.x  - this.radius * Math.cos(radians);
        this.noseY = this.y  - this.radius * Math.sin(radians);

        for(let i=0; i<3; i++) {
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians ));
        }
        ctx.closePath();
        ctx.stroke();
    }
}