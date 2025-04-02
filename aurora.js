class AuroraGradient {
    constructor(options) {
        this.canvas = typeof options.canvas === 'string' 
            ? document.querySelector(options.canvas) 
            : options.canvas;
        
        this.ctx = this.canvas.getContext('2d');
        this.colors = options.colors || ['#1a237e', '#0d47a1', '#42a5f5', '#4fc3f7'];
        this.speed = options.speed || 0.002;
        this.baseRadius = options.baseRadius || 0.5;
        this.waveAmplitude = options.waveAmplitude || 0.3;
        this.waveFrequency = options.waveFrequency || 5;
        this.blurFactor = options.blurFactor || 100;
        this.opacity = options.opacity || 0.5;

        this.time = 0;
        this.width = 0;
        this.height = 0;
        this.gradientPoints = [];

        this.init();
        this.animate();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Создаем точки для градиента
        this.gradientPoints = this.colors.map((_, index) => ({
            x: this.width * (index / (this.colors.length - 1)),
            y: this.height / 2,
            baseY: this.height / 2
        }));
    }

    animate() {
        this.time += this.speed;
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Обновляем позиции точек
        this.gradientPoints.forEach((point, index) => {
            point.y = point.baseY + Math.sin(this.time + index) * this.height * this.waveAmplitude;
        });

        // Создаем градиент
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
        this.colors.forEach((color, index) => {
            gradient.addColorStop(index / (this.colors.length - 1), color);
        });

        // Рисуем волны
        this.ctx.globalAlpha = this.opacity;
        this.ctx.fillStyle = gradient;
        this.ctx.filter = `blur(${this.blurFactor}px)`;

        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        
        // Создаем плавную кривую через точки
        for (let i = 0; i < this.width; i++) {
            const y = this.height / 2 + 
                Math.sin(i * this.waveFrequency / this.width + this.time) * 
                this.height * this.waveAmplitude;
            this.ctx.lineTo(i, y);
        }

        this.ctx.lineTo(this.width, this.height);
        this.ctx.lineTo(0, this.height);
        this.ctx.closePath();
        this.ctx.fill();

        requestAnimationFrame(() => this.animate());
    }
}

// Экспортируем класс
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuroraGradient;
} else {
    window.AuroraGradient = AuroraGradient;
} 