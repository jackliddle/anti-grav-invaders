import { Player, Invader, Bullet, Particle, Barrier, Powerup, Mothership } from './Entities';
import { AudioController } from './Audio';

export class GameState {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.player = new Player(width / 2, height - 50);
        this.bullets = [];
        this.invaders = [];
        this.particles = [];
        this.barriers = [];
        this.keys = {};
        this.lastTime = 0;
        this.score = 0;
        this.gameOver = false;

        this.audio = new AudioController();

        this.onScoreUpdate = null;
        this.onGameOver = null;
        this.onLivesUpdate = null;

        this.lives = 3;
        this.powerups = [];
        this.spreadShotActive = false;
        this.spreadShotTimer = 0;
        this.timeFreezeActive = false;
        this.timeFreezeTimer = 0;
        this.rapidFireActive = false;
        this.rapidFireTimer = 0;
        this.playerInvulnerable = false;
        this.playerInvulnerableTimer = 0;

        this.mothership = null;
        this.mothershipTimer = 0;

        this.invaderDir = 1;
        this.invaderSpeed = 1;
        this.invaderDropDistance = 20;
        this.lastInvaderShot = 0;

        this.initInvaders();
        this.initBarriers();
    }

    initInvaders() {
        const rows = 5;
        const cols = 10;
        const padding = 50;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                this.invaders.push(new Invader(100 + c * padding, 100 + r * padding));
            }
        }
    }

    initBarriers() {
        const count = 4;
        const spacing = this.width / (count + 1);
        for (let i = 1; i <= count; i++) {
            this.barriers.push(new Barrier(i * spacing, this.height - 150));
        }
    }

    handleInput(key, isPressed) {
        this.keys[key] = isPressed;

        if (isPressed && this.audio.ctx.state === 'suspended') {
            this.audio.ctx.resume();
        }

        if (isPressed && key === ' ') {
            this.shoot();
        }
        if (isPressed && key === 'Enter' && this.gameOver) {
            this.restart();
        }
    }

    restart() {
        this.player = new Player(this.width / 2, this.height - 50);
        this.bullets = [];
        this.invaders = [];
        this.particles = [];
        this.barriers = [];
        this.score = 0;
        this.gameOver = false;
        this.invaderSpeed = 1;
        this.initInvaders();
        this.initBarriers();

        this.lives = 3;
        this.powerups = [];
        this.spreadShotActive = false;
        this.timeFreezeActive = false;
        this.rapidFireActive = false;
        this.playerInvulnerable = false;

        this.mothership = null;
        this.mothershipTimer = 0;

        if (this.onScoreUpdate) this.onScoreUpdate(0);
        if (this.onLivesUpdate) this.onLivesUpdate(3);
    }

    shoot() {
        if (this.gameOver) return;

        // Bullet Limit: Max 3 bullets on screen (unless spread shot is active)
        const activePlayerBullets = this.bullets.filter(b => b.dir === -1 && b.active).length;
        const limit = this.rapidFireActive ? 10 : 3;

        if (activePlayerBullets >= limit && !this.spreadShotActive) return;

        if (this.spreadShotActive) {
            this.bullets.push(new Bullet(this.player.x, this.player.y, -1));
            this.bullets.push(new Bullet(this.player.x - 15, this.player.y, -1));
            this.bullets.push(new Bullet(this.player.x + 15, this.player.y, -1));
            this.audio.playShoot();
        } else {
            this.bullets.push(new Bullet(this.player.x, this.player.y, -1));
            this.audio.playShoot();
        }
    }

    update(time) {
        this.lastTime = time;

        if (this.gameOver) return;

        // Player movement
        if (this.keys['ArrowLeft'] || this.keys['a']) this.player.move(-1, this.width);
        if (this.keys['ArrowRight'] || this.keys['d']) this.player.move(1, this.width);

        // Update bullets
        this.bullets.forEach(b => b.update());
        this.bullets = this.bullets.filter(b => b.y > 0 && b.y < this.height && b.active);

        // Update particles
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.life > 0);

        // Update Powerups
        this.powerups.forEach(p => p.update());
        this.powerups = this.powerups.filter(p => p.y < this.height && p.active);

        // Handle Powerup Timers
        if (this.spreadShotActive) {
            if (time > this.spreadShotTimer) this.spreadShotActive = false;
        }
        if (this.timeFreezeActive) {
            if (time > this.timeFreezeTimer) this.timeFreezeActive = false;
        }
        if (this.rapidFireActive) {
            if (time > this.rapidFireTimer) this.rapidFireActive = false;
        }
        if (this.playerInvulnerable) {
            if (time > this.playerInvulnerableTimer) {
                this.playerInvulnerable = false;
                this.player.color = '#00f3ff'; // Reset color
            } else {
                // Flicker effect
                this.player.color = Math.floor(time / 100) % 2 === 0 ? '#00f3ff' : '#ffffff';
            }
        }

        // Invader Logic
        if (!this.timeFreezeActive) {
            let hitWall = false;
            const frameTick = Math.floor(time / 500) % 2;

            // Invader Shooting
            if (time - this.lastInvaderShot > 1000 && this.invaders.some(i => i.active)) {
                const activeInvaders = this.invaders.filter(i => i.active);
                const shooter = activeInvaders[Math.floor(Math.random() * activeInvaders.length)];
                this.bullets.push(new Bullet(shooter.x, shooter.y, 1)); // 1 for down
                this.lastInvaderShot = time;
            }

            this.invaders.forEach(invader => {
                if (!invader.active) return;
                invader.x += this.invaderDir * this.invaderSpeed;
                invader.frame = frameTick;

                if (invader.x > this.width - 30 || invader.x < 30) {
                    hitWall = true;
                }

                if (invader.y > this.player.y - 20) {
                    this.gameOver = true;
                    this.audio.playGameOver();
                }
            });

            if (hitWall) {
                this.invaderDir *= -1;
                this.invaders.forEach(invader => {
                    invader.y += this.invaderDropDistance;
                });
                this.invaderSpeed += 0.2;
                this.audio.playInvaderMove();
            }
        }

        // Mothership Logic
        if (!this.mothership) {
            // Random spawn chance (0.2% per frame -> ~8 seconds)
            if (Math.random() < 0.002) {
                this.mothership = new Mothership(this.width);
                this.mothership.direction = Math.random() < 0.5 ? 1 : -1;
                this.mothership.x = this.mothership.direction === 1 ? -this.mothership.width : this.width + this.mothership.width;
            }
        } else {
            this.mothership.update();
            // Despawn if off screen
            if ((this.mothership.direction === 1 && this.mothership.x > this.width + 100) ||
                (this.mothership.direction === -1 && this.mothership.x < -100)) {
                this.mothership = null;
            }
        }

        this.checkCollisions();

        if (this.invaders.every(i => !i.active)) {
            this.initInvaders();
            this.invaderSpeed += 1;
        }
    }

    checkCollisions() {
        this.bullets.forEach(bullet => {
            if (!bullet.active) return;

            // Bullet vs Invaders (Player bullets only)
            if (bullet.dir === -1) {
                this.invaders.forEach(invader => {
                    if (invader.active && bullet.active && this.rectIntersect(bullet, invader)) {
                        invader.active = false;
                        bullet.active = false;
                        this.score += 100;
                        if (this.onScoreUpdate) this.onScoreUpdate(this.score);
                        this.createExplosion(invader.x, invader.y, invader.color);
                        this.audio.playExplosion();

                        // Drop Powerup (5% chance)
                        if (Math.random() < 0.05) {
                            const r = Math.random();
                            let type = 'spread';
                            if (r < 0.33) type = 'spread';
                            else if (r < 0.66) type = 'freeze';
                            else type = 'rapid';

                            this.powerups.push(new Powerup(invader.x, invader.y, type));
                        }
                    }
                });

                // Bullet vs Mothership
                if (this.mothership && bullet.active && this.rectIntersect(bullet, this.mothership)) {
                    this.mothership = null; // Destroy
                    bullet.active = false;
                    this.score += 500;
                    if (this.onScoreUpdate) this.onScoreUpdate(this.score);
                    this.createExplosion(bullet.x, bullet.y, '#ff0000');
                    this.audio.playMothershipHit();
                }
            }
            // Bullet vs Player (Invader bullets only)
            else if (bullet.dir === 1) {
                if (this.rectIntersect(bullet, this.player) && !this.playerInvulnerable) {
                    bullet.active = false;
                    this.handlePlayerHit();
                }
            }

            // Bullet vs Barriers
            this.barriers.forEach(barrier => {
                barrier.chunks.forEach(chunk => {
                    if (chunk.active && bullet.active &&
                        bullet.x < chunk.x + chunk.width &&
                        bullet.x + bullet.width > chunk.x &&
                        bullet.y < chunk.y + chunk.height &&
                        bullet.y + bullet.height > chunk.y) {

                        chunk.active = false;
                        bullet.active = false;
                        this.createExplosion(chunk.x, chunk.y, barrier.color);
                    }
                });
            });
        });

        // Invaders vs Barriers
        this.invaders.forEach(invader => {
            if (!invader.active) return;
            this.barriers.forEach(barrier => {
                barrier.chunks.forEach(chunk => {
                    if (chunk.active && this.rectIntersect(invader, chunk)) {
                        chunk.active = false;
                        this.createExplosion(chunk.x, chunk.y, barrier.color);
                    }
                });
            });
        });

        // Player vs Powerups
        this.powerups.forEach(p => {
            if (p.active && this.rectIntersect(p, this.player)) {
                p.active = false;
                this.activatePowerup(p.type);
            }
        });
    }

    handlePlayerHit() {
        this.lives--;
        if (this.onLivesUpdate) this.onLivesUpdate(this.lives);
        this.createExplosion(this.player.x, this.player.y, this.player.color);
        this.audio.playPlayerHit();

        if (this.lives <= 0) {
            this.gameOver = true;
        } else {
            // Respawn logic
            this.playerInvulnerable = true;
            this.playerInvulnerableTimer = this.lastTime + 2000; // 2 seconds
            // Clear enemy bullets nearby or all? Let's clear all for fairness
            this.bullets = this.bullets.filter(b => b.dir === -1);
        }
    }

    activatePowerup(type) {
        if (type === 'spread') {
            this.spreadShotActive = true;
            this.spreadShotTimer = this.lastTime + 5000; // 5 seconds
        } else if (type === 'freeze') {
            this.timeFreezeActive = true;
            this.timeFreezeTimer = this.lastTime + 3000; // 3 seconds
        } else if (type === 'rapid') {
            this.rapidFireActive = true;
            this.rapidFireTimer = this.lastTime + 5000; // 5 seconds
        }
    }

    createExplosion(x, y, color) {
        for (let i = 0; i < 10; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    rectIntersect(r1, r2) {
        return !(r2.x - r2.width / 2 > r1.x + r1.width / 2 ||
            r2.x + r2.width / 2 < r1.x - r1.width / 2 ||
            r2.y - r2.height / 2 > r1.y + r1.height / 2 ||
            r2.y + r2.height / 2 < r1.y - r1.height / 2);
    }

    draw(ctx) {
        this.player.draw(ctx);
        this.bullets.forEach(b => b.draw(ctx));
        this.particles.forEach(p => p.draw(ctx));
        this.barriers.forEach(b => b.draw(ctx));
        this.powerups.forEach(p => p.draw(ctx));
        this.invaders.forEach(i => {
            if (i.active) i.draw(ctx);
        });
        if (this.mothership) {
            this.mothership.draw(ctx);
        }

        if (this.gameOver) {
            if (this.onGameOver) this.onGameOver(this.score);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, this.width, this.height);
        }
    }
}
