class AuroraGradient {
    constructor(options) {
        this.canvas = typeof options.canvas === 'string' 
            ? document.querySelector(options.canvas) 
            : options.canvas;
        
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.colors = options.colors || ['#1a237e', '#0d47a1', '#42a5f5', '#4fc3f7'];
        this.speed = options.speed || 0.001;
        this.waveAmplitude = options.waveAmplitude || 0.5;
        this.waveFrequency = options.waveFrequency || 2;
        this.blurFactor = options.blurFactor || 100;
        this.opacity = options.opacity || 0.8;

        this.time = 0;
        this.width = 0;
        this.height = 0;
        this.waves = [];
        this.numWaves = 4;

        this.init();
        this.animate();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Создаем несколько волн с разными параметрами
        for (let i = 0; i < this.numWaves; i++) {
            this.waves.push({
                amplitude: this.waveAmplitude * (1 - i * 0.15),
                frequency: this.waveFrequency * (1 + i * 0.2),
                phase: Math.random() * Math.PI * 2,
                speed: this.speed * (1 + i * 0.1)
            });
        }
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.width = rect.width;
        this.height = rect.height;
        
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        
        this.ctx.scale(dpr, dpr);
    }

    drawWave(wave, colorIndex) {
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
        
        // Создаем градиент с плавными переходами
        this.colors.forEach((color, i) => {
            gradient.addColorStop(i / (this.colors.length - 1), color);
        });

        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);

        // Рисуем волну с множеством точек для плавности
        for (let y = 0; y <= this.height; y += 1) {
            let x = this.width / 3;
            
            // Добавляем несколько синусоидальных волн с разными фазами
            this.waves.forEach(w => {
                x += Math.sin(y * w.frequency / this.height + this.time * w.speed + w.phase) * 
                     this.width * w.amplitude * 0.3;
            });

            // Добавляем дополнительное колебание для более естественного эффекта
            x += Math.sin(y * 0.02 + this.time * 0.5) * this.width * 0.05;

            this.ctx.lineTo(x, y);
        }

        this.ctx.lineTo(this.width, this.height);
        this.ctx.lineTo(this.width, 0);
        this.ctx.closePath();

        // Применяем градиент и размытие
        this.ctx.fillStyle = gradient;
        this.ctx.globalAlpha = this.opacity;
        this.ctx.filter = `blur(${this.blurFactor}px)`;
        this.ctx.fill();
    }

    animate() {
        this.time += this.speed;
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Рисуем несколько слоев волн
        for (let i = 0; i < this.numWaves; i++) {
            this.drawWave(this.waves[i], i);
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Экспортируем класс
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuroraGradient;
} else {
    window.AuroraGradient = AuroraGradient;
} 