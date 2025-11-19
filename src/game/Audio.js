export class AudioController {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
    }

    playTone(freq, type, duration, vol = 0.1) {
        if (!this.enabled) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playShoot() {
        this.playTone(880, 'square', 0.1, 0.05);
        setTimeout(() => this.playTone(600, 'square', 0.1, 0.05), 50);
    }

    playExplosion() {
        // Noise is hard with simple oscillators, using low freq sawtooth for "rumble"
        this.playTone(100, 'sawtooth', 0.2, 0.1);
        this.playTone(50, 'square', 0.3, 0.1);
    }

    playInvaderMove() {
        this.playTone(200, 'square', 0.05, 0.02);
    }

    playGameOver() {
        this.playTone(300, 'sawtooth', 0.5, 0.1);
        setTimeout(() => this.playTone(250, 'sawtooth', 0.5, 0.1), 400);
        setTimeout(() => this.playTone(200, 'sawtooth', 1.0, 0.1), 800);
    }

    playPlayerHit() {
        this.playTone(150, 'sawtooth', 0.3, 0.1);
        setTimeout(() => this.playTone(100, 'sawtooth', 0.3, 0.1), 200);
    }

    playMothershipHit() {
        this.playTone(400, 'square', 0.1, 0.1);
        setTimeout(() => this.playTone(600, 'square', 0.1, 0.1), 100);
        setTimeout(() => this.playTone(800, 'square', 0.2, 0.1), 200);
    }
}
