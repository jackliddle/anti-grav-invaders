export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 20;
        this.speed = 5;
        this.color = '#00f3ff'; // Neon Blue
    }

    move(dir, canvasWidth) {
        this.x += dir * this.speed;
        // Boundary checks
        if (this.x < this.width / 2) this.x = this.width / 2;
        if (this.x > canvasWidth - this.width / 2) this.x = canvasWidth - this.width / 2;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;

        // Draw ship shape
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.height / 2);
        ctx.lineTo(this.x - this.width / 2, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height / 2);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
    }
}

export class Invader {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.active = true;
        this.color = '#ff00ff'; // Neon Pink
        this.frame = 0;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        // Alien shape changes based on frame
        if (this.frame === 0) {
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            // Legs down
            ctx.fillRect(this.x - this.width / 2, this.y + this.height / 2, 5, 5);
            ctx.fillRect(this.x + this.width / 2 - 5, this.y + this.height / 2, 5, 5);
        } else {
            ctx.fillRect(this.x - this.width / 2 + 2, this.y - this.height / 2, this.width - 4, this.height);
            // Legs out
            ctx.fillRect(this.x - this.width / 2 - 3, this.y + this.height / 2 - 5, 5, 5);
            ctx.fillRect(this.x + this.width / 2 - 2, this.y + this.height / 2 - 5, 5, 5);
        }

        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x - 5, this.y - 5, 4, 4);
        ctx.fillRect(this.x + 1, this.y - 5, 4, 4);

        ctx.shadowBlur = 0;
    }
}

export class Mothership {
    constructor(width) {
        this.width = 60;
        this.height = 30;
        this.x = -this.width; // Start off-screen left
        this.y = 80;
        this.speed = 3;
        this.active = true;
        this.color = '#ff0000'; // Red
        this.direction = 1; // 1 for right, -1 for left
    }

    update() {
        this.x += this.speed * this.direction;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;

        // Saucer shape
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dome
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y - 5, 10, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.shadowBlur = 0;
    }
}

export class Bullet {
    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.speed = 7;
        this.width = 4;
        this.height = 10;
        this.active = true;
        this.color = '#00ff00'; // Neon Green
    }

    update() {
        this.y += this.dir * this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.shadowBlur = 0;
    }
}

export class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 4;
        this.speedY = (Math.random() - 0.5) * 4;
        this.life = 1.0;
        this.decay = Math.random() * 0.05 + 0.02;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1.0;
    }
}

export class Barrier {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 40;
        this.color = '#00f3ff'; // Neon Blue
        this.chunks = [];

        // Create grid of chunks
        const rows = 8;
        const cols = 12;
        const chunkW = this.width / cols;
        const chunkH = this.height / rows;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                this.chunks.push({
                    x: this.x - this.width / 2 + c * chunkW,
                    y: this.y - this.height / 2 + r * chunkH,
                    width: chunkW,
                    height: chunkH,
                    active: true
                });
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.color;

        this.chunks.forEach(chunk => {
            if (chunk.active) {
                ctx.fillRect(chunk.x, chunk.y, chunk.width, chunk.height);
            }
        });

        ctx.shadowBlur = 0;
    }
}

export class Powerup {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type; // 'spread', 'freeze', 'rapid'
        this.active = true;
        this.speed = 2;
        let color = '#ffff00'; // Default Yellow
        if (type === 'freeze') color = '#00ffff'; // Cyan
        if (type === 'rapid') color = '#ff0000'; // Red
        this.color = color;
    }

    update() {
        this.y += this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        ctx.beginPath();
        if (this.type === 'spread') {
            // Triangle for spread
            ctx.moveTo(this.x, this.y - 10);
            ctx.lineTo(this.x - 10, this.y + 10);
            ctx.lineTo(this.x + 10, this.y + 10);
        } else if (this.type === 'freeze') {
            // Square for freeze
            ctx.rect(this.x - 10, this.y - 10, 20, 20);
        } else {
            // Circle for rapid
            ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        }
        ctx.fill();

        // Inner detail
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let label = 'S';
        if (this.type === 'freeze') label = 'F';
        if (this.type === 'rapid') label = 'R';
        ctx.fillText(label, this.x, this.y + 2);

        ctx.shadowBlur = 0;
    }
}
