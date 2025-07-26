// Landing Page Animation - Viewy & Olive Jumping Adventure
class LandingAnimation {
    constructor() {
        this.canvas = document.getElementById('animationCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Create images first
        this.oliveImage = new Image();
        this.viewyImage = new Image();
        
        // Image loading state
        this.imagesLoaded = 0;
        this.totalImages = 2;
        
        // Animation objects - create these BEFORE resizeCanvas
        this.olive = {
            x: 100,
            y: 300,
            width: 120,
            height: 150,
            velocityY: 0,
            velocityX: 0.8, // Slower, smoother movement
            velocityYFloat: 0,
            floatTimer: 0,
            heartTimer: 0,
            direction: 1,
            // Simplified movement properties
            movementMode: 'gentle', // Single gentle mode instead of multiple chaotic ones
            floatAmplitude: 30,
            floatSpeed: 0.02,
            horizontalSpeed: 0.8
        };
        
        this.viewy = {
            x: 400,
            y: 200,
            width: 200,
            height: 150,
            velocityX: -1.2, // Slower, smoother movement
            velocityY: 0,
            velocityYFloat: 0,
            floatTimer: 0,
            heartTimer: 0,
            direction: -1,
            // Simplified movement properties
            movementMode: 'gentle', // Single gentle mode instead of multiple chaotic ones
            floatAmplitude: 40,
            floatSpeed: 0.025,
            horizontalSpeed: 1.2
        };
        
        this.hearts = [];
        this.particles = [];
        
        // Animation settings
        this.gravity = 0.2;
        this.jumpPower = -8;
        this.cloudSpawnTimer = 0;
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Load images
        this.oliveImage.src = "assets/olive.png";
        this.oliveImage.onload = () => {
            console.log('Olive image loaded for animation');
            this.imagesLoaded++;
            this.calculateCharacterSizes();
        };
        this.oliveImage.onerror = () => {
            console.error('Failed to load olive image');
            this.imagesLoaded++;
            this.calculateCharacterSizes();
        };
        
        this.viewyImage.src = "assets/viewy.png";
        this.viewyImage.onload = () => {
            console.log('Viewy image loaded for animation');
            this.imagesLoaded++;
            this.calculateCharacterSizes();
        };
        this.viewyImage.onerror = () => {
            console.error('Failed to load viewy image');
            this.imagesLoaded++;
            this.calculateCharacterSizes();
        };
        
        // Start animation immediately (don't wait for images)
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.calculateCharacterSizes();
    }
    
    calculateCharacterSizes() {
        const screenArea = this.canvas.width * this.canvas.height;
        const baseArea = 1920 * 1080;
        const scaleFactor = Math.sqrt(screenArea / baseArea);
        
        // Olive size - much bigger
        const oliveBaseWidth = 150;
        const oliveAspectRatio = this.oliveImage && this.oliveImage.complete && this.oliveImage.naturalWidth ? 
            this.oliveImage.naturalWidth / this.oliveImage.naturalHeight : 0.8;
        const oliveBaseHeight = oliveBaseWidth / oliveAspectRatio;
        this.olive.width = oliveBaseWidth * scaleFactor;
        this.olive.height = oliveBaseHeight * scaleFactor;
        
        // Viewy size - much bigger
        const viewyBaseWidth = 250;
        const viewyAspectRatio = this.viewyImage && this.viewyImage.complete && this.viewyImage.naturalWidth ? 
            this.viewyImage.naturalWidth / this.viewyImage.naturalHeight : 1.33;
        const viewyBaseHeight = viewyBaseWidth / viewyAspectRatio;
        this.viewy.width = viewyBaseWidth * scaleFactor;
        this.viewy.height = viewyBaseHeight * scaleFactor;
        
        console.log(`Canvas: ${this.canvas.width}x${this.canvas.height}`);
        console.log(`Olive: ${this.olive.width.toFixed(1)}x${this.olive.height.toFixed(1)}`);
        console.log(`Viewy: ${this.viewy.width.toFixed(1)}x${this.viewy.height.toFixed(1)}`);
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
    
    update() {
        this.updateOlive();
        this.updateViewy();
        this.updateHearts();
        this.updateParticles();
        this.spawnHearts();
    }
    
    updateOlive() {
        // Simple, gentle floating movement
        this.olive.floatTimer += this.olive.floatSpeed;
        
        // Horizontal movement with gentle bouncing
        this.olive.x += this.olive.velocityX;
        
        // Vertical floating motion
        const floatOffset = Math.sin(this.olive.floatTimer) * this.olive.floatAmplitude;
        this.olive.y = this.canvas.height / 2 + floatOffset;
        
        // Keep Olive in bounds with gentle bounce
        if (this.olive.x < 50) {
            this.olive.x = 50;
            this.olive.velocityX = Math.abs(this.olive.velocityX);
            this.olive.direction = 1;
        }
        if (this.olive.x > this.canvas.width - this.olive.width - 50) {
            this.olive.x = this.canvas.width - this.olive.width - 50;
            this.olive.velocityX = -Math.abs(this.olive.velocityX);
            this.olive.direction = -1;
        }
        
        // Heart timer
        this.olive.heartTimer++;
    }
    
    updateViewy() {
        // Simple, gentle floating movement
        this.viewy.floatTimer += this.viewy.floatSpeed;
        
        // Horizontal movement with gentle bouncing
        this.viewy.x += this.viewy.velocityX;
        
        // Vertical floating motion (slightly different phase for variety)
        const floatOffset = Math.sin(this.viewy.floatTimer + Math.PI) * this.viewy.floatAmplitude;
        this.viewy.y = this.canvas.height / 2 + floatOffset;
        
        // Keep Viewy in bounds with gentle bounce
        if (this.viewy.x < 50) {
            this.viewy.x = 50;
            this.viewy.velocityX = Math.abs(this.viewy.velocityX);
            this.viewy.direction = 1;
        }
        if (this.viewy.x > this.canvas.width - this.viewy.width - 50) {
            this.viewy.x = this.canvas.width - this.viewy.width - 50;
            this.viewy.velocityX = -Math.abs(this.viewy.velocityX);
            this.viewy.direction = -1;
        }
        
        // Heart timer
        this.viewy.heartTimer++;
    }
    
    updateHearts() {
        for (let i = this.hearts.length - 1; i >= 0; i--) {
            const heart = this.hearts[i];
            heart.y -= heart.velocityY;
            heart.x += heart.velocityX;
            heart.life -= 1;
            heart.scale = Math.max(0.5, heart.life / 60);
            
            if (heart.life <= 0) {
                this.hearts.splice(i, 1);
            }
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.life -= 1;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    spawnHearts() {
        // Olive creates hearts
        if (this.olive.heartTimer > 120) { // Every 2 seconds (less frequent)
            this.createHeartParticles(this.olive);
            this.olive.heartTimer = 0;
        }
        
        // Viewy creates hearts
        if (this.viewy.heartTimer > 120) { // Every 2 seconds (less frequent)
            this.createHeartParticles(this.viewy);
            this.viewy.heartTimer = 0;
        }
    }
    
    createHeartParticles(character) {
        for (let i = 0; i < 1; i++) { // Fewer hearts
            this.hearts.push({
                x: character.x + character.width / 2 + (Math.random() - 0.5) * 40,
                y: character.y + character.height / 2,
                velocityX: (Math.random() - 0.5) * 1,
                velocityY: 0.8 + Math.random() * 1,
                life: 60,
                scale: 1,
                color: '#FF69B4' // Pink hearts for both characters
            });
        }
    }
    
    createJumpParticles() {
        for (let i = 0; i < 6; i++) {
            this.particles.push({
                x: this.olive.x + this.olive.width / 2,
                y: this.olive.y + this.olive.height / 2,
                velocityX: (Math.random() - 0.5) * 4,
                velocityY: -Math.random() * 3,
                life: 30,
                color: '#90EE90'
            });
        }
    }
    
    createBounceParticles() {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: this.viewy.x + this.viewy.width / 2,
                y: this.viewy.y + this.viewy.height / 2,
                velocityX: (Math.random() - 0.5) * 6,
                velocityY: -Math.random() * 4,
                life: 40,
                color: '#FFFFFF'
            });
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw particles
        this.drawParticles();
        
        // Draw hearts
        this.drawHearts();
        
        // Draw Viewy
        this.drawViewy();
        
        // Draw Olive
        this.drawOlive();
    }
    
    drawParticles() {
        for (const particle of this.particles) {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / 30;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawHearts() {
        for (const heart of this.hearts) {
            this.ctx.save();
            this.ctx.translate(heart.x, heart.y);
            this.ctx.scale(heart.scale, heart.scale);
            
            this.ctx.fillStyle = heart.color;
            this.ctx.globalAlpha = heart.life / 60;
            this.ctx.shadowColor = heart.color;
            this.ctx.shadowBlur = 8;
            
            // Draw heart shape
            this.ctx.beginPath();
            this.ctx.moveTo(0, -8);
            this.ctx.bezierCurveTo(-12, -12, -12, 3, 0, 8);
            this.ctx.bezierCurveTo(12, 3, 12, -12, 0, -8);
            this.ctx.fill();
            
            this.ctx.shadowBlur = 0;
            this.ctx.restore();
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawViewy() {
        if (this.viewyImage && this.viewyImage.complete && this.viewyImage.naturalWidth > 0) {
            // Draw the actual image
            this.ctx.drawImage(
                this.viewyImage,
                this.viewy.x,
                this.viewy.y,
                this.viewy.width,
                this.viewy.height
            );
        } else {
            // Fallback: draw a cloud shape
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            this.ctx.shadowBlur = 5;
            
            this.ctx.beginPath();
            this.ctx.arc(this.viewy.x + this.viewy.width * 0.3, this.viewy.y + this.viewy.height * 0.5, this.viewy.height * 0.3, 0, Math.PI * 2);
            this.ctx.arc(this.viewy.x + this.viewy.width * 0.7, this.viewy.y + this.viewy.height * 0.5, this.viewy.height * 0.3, 0, Math.PI * 2);
            this.ctx.arc(this.viewy.x + this.viewy.width * 0.5, this.viewy.y + this.viewy.height * 0.3, this.viewy.height * 0.4, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.shadowBlur = 0;
        }
    }
    
    drawOlive() {
        if (this.oliveImage && this.oliveImage.complete && this.oliveImage.naturalWidth > 0) {
            // Draw the actual image
            this.ctx.drawImage(
                this.oliveImage,
                this.olive.x,
                this.olive.y,
                this.olive.width,
                this.olive.height
            );
        } else {
            // Fallback: draw an avocado shape
            this.ctx.fillStyle = '#90EE90';
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            this.ctx.shadowBlur = 5;
            
            // Draw avocado body
            this.ctx.beginPath();
            this.ctx.ellipse(
                this.olive.x + this.olive.width / 2,
                this.olive.y + this.olive.height / 2,
                this.olive.width / 2,
                this.olive.height / 2,
                0, 0, Math.PI * 2
            );
            this.ctx.fill();
            
            // Draw avocado pit
            this.ctx.fillStyle = '#8B4513';
            this.ctx.beginPath();
            this.ctx.ellipse(
                this.olive.x + this.olive.width / 2,
                this.olive.y + this.olive.height / 2,
                this.olive.width / 4,
                this.olive.height / 4,
                0, 0, Math.PI * 2
            );
            this.ctx.fill();
            
            this.ctx.shadowBlur = 0;
        }
    }
}

// Initialize animation when page loads
window.addEventListener('load', () => {
    console.log('Starting Viewy & Olive animation...');
    const animation = new LandingAnimation();
    // Expose animation instance globally for click detection
    window.animationInstance = animation;
});

console.log('🌤️ Viewy & Olive are floating around sharing love! 💖🥑'); 