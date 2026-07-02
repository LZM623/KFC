document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    const scrollAnimateElements = document.querySelectorAll('.scroll-animate');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    scrollAnimateElements.forEach(element => {
        observer.observe(element);
    });

    const scrollRevealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    scrollRevealElements.forEach(element => {
        revealObserver.observe(element);
    });

    function createParticles(event) {
        const target = event.target;
        const rect = target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('span');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--angle', (360 / 12) * i + 'deg');
            particle.style.setProperty('--delay', Math.random() * 0.2 + 's');
            target.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }

    const particleButtons = document.querySelectorAll('.particle-btn');
    particleButtons.forEach(btn => {
        btn.addEventListener('click', createParticles);
    });

    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    const navLinkItems = document.querySelectorAll('.nav-links a');
    navLinkItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    const heroBtn = document.querySelector('.hero-btn');
    if (heroBtn) {
        heroBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    initBeamLightCanvas();
});

function initBeamLightCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let time = 0;
    
    const particles = [];
    for (let i = 0; i < 250; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 5 + 1,
            speedX: (Math.random() - 0.5) * 1.2,
            speedY: (Math.random() - 0.5) * 1.2,
            opacity: Math.random() * 0.5 + 0.5,
            pulseSpeed: Math.random() * 0.03 + 0.015,
            pulseOffset: Math.random() * Math.PI * 2
        });
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function drawRadialBackground() {
        const gradient = ctx.createRadialGradient(
            canvas.width * 0.45,
            canvas.height * 0.55,
            0,
            canvas.width * 0.45,
            canvas.height * 0.55,
            canvas.width * 0.8
        );
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#0d0d1a');
        gradient.addColorStop(1, '#000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawBeamLight() {
        const beamX = canvas.width * 0.45;
        const beamY = canvas.height * 0.55;
        
        const beamWidth = 80 + Math.sin(time * 0.5) * 20;
        const beamAngle = -0.3 + Math.sin(time * 0.3) * 0.1;
        
        const gradient = ctx.createLinearGradient(
            beamX, beamY,
            beamX + Math.cos(beamAngle) * canvas.width,
            beamY + Math.sin(beamAngle) * canvas.height * 1.5
        );
        
        gradient.addColorStop(0, 'rgba(120, 180, 255, 0.4)');
        gradient.addColorStop(0.1, 'rgba(100, 160, 230, 0.3)');
        gradient.addColorStop(0.3, 'rgba(80, 140, 210, 0.15)');
        gradient.addColorStop(0.6, 'rgba(60, 120, 190, 0.05)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.save();
        ctx.translate(beamX, beamY);
        ctx.rotate(beamAngle);
        
        ctx.beginPath();
        ctx.moveTo(0, -beamWidth / 2);
        
        for (let i = 0; i < 50; i++) {
            const x = (canvas.width * 1.5) * (i / 50);
            const waveY = Math.sin(x * 0.02 + time * 2) * 15 + Math.sin(x * 0.01 + time * 3) * 8;
            ctx.lineTo(x, waveY - beamWidth / 2);
        }
        
        for (let i = 49; i >= 0; i--) {
            const x = (canvas.width * 1.5) * (i / 50);
            const waveY = Math.sin(x * 0.02 + time * 2 + Math.PI) * 15 + Math.sin(x * 0.01 + time * 3 + Math.PI) * 8;
            ctx.lineTo(x, waveY + beamWidth / 2);
        }
        
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.shadowColor = 'rgba(100, 160, 255, 0.8)';
        ctx.shadowBlur = 40;
        ctx.fill();
        
        ctx.restore();
        
        const innerGradient = ctx.createLinearGradient(
            beamX, beamY,
            beamX + Math.cos(beamAngle) * canvas.width * 0.5,
            beamY + Math.sin(beamAngle) * canvas.height * 0.8
        );
        innerGradient.addColorStop(0, 'rgba(200, 230, 255, 0.6)');
        innerGradient.addColorStop(0.3, 'rgba(150, 200, 255, 0.3)');
        innerGradient.addColorStop(1, 'transparent');
        
        ctx.save();
        ctx.translate(beamX, beamY);
        ctx.rotate(beamAngle);
        
        ctx.beginPath();
        const innerWidth = beamWidth * 0.4;
        ctx.moveTo(0, -innerWidth / 2);
        
        for (let i = 0; i < 30; i++) {
            const x = (canvas.width * 0.8) * (i / 30);
            const waveY = Math.sin(x * 0.03 + time * 2.5) * 8;
            ctx.lineTo(x, waveY - innerWidth / 2);
        }
        
        for (let i = 29; i >= 0; i--) {
            const x = (canvas.width * 0.8) * (i / 30);
            const waveY = Math.sin(x * 0.03 + time * 2.5 + Math.PI) * 8;
            ctx.lineTo(x, waveY + innerWidth / 2);
        }
        
        ctx.closePath();
        ctx.fillStyle = innerGradient;
        ctx.shadowColor = 'rgba(200, 230, 255, 0.9)';
        ctx.shadowBlur = 60;
        ctx.fill();
        ctx.restore();
    }

    function drawGrid() {
        ctx.strokeStyle = 'rgba(100, 150, 200, 0.03)';
        ctx.lineWidth = 1;
        
        const gridSize = 60 + Math.sin(time * 0.2) * 10;
        const offsetX = (time * 5) % gridSize;
        const offsetY = (time * 3) % gridSize;
        
        for (let x = offsetX; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        for (let y = offsetY; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    function drawParticles() {
        particles.forEach(p => {
            p.x += p.speedX + Math.sin(time * 2 + p.x * 0.01) * 0.5;
            p.y += p.speedY + Math.cos(time * 2 + p.y * 0.01) * 0.5;
            
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            
            const pulse = Math.sin(time * p.pulseSpeed * 100 + p.pulseOffset) * 0.3 + 0.7;
            const currentSize = p.size * pulse;
            const currentOpacity = p.opacity * pulse;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize * 2.5, 0, Math.PI * 2);
            const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 2.5);
            glowGradient.addColorStop(0, `rgba(100, 180, 255, ${currentOpacity * 0.4})`);
            glowGradient.addColorStop(0.5, `rgba(80, 150, 230, ${currentOpacity * 0.2})`);
            glowGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGradient;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 230, 255, ${currentOpacity})`;
            ctx.shadowColor = `rgba(100, 200, 255, ${currentOpacity})`;
            ctx.shadowBlur = currentSize * 3;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }

    function drawVignette() {
        const gradient = ctx.createRadialGradient(
            canvas.width * 0.5,
            canvas.height * 0.5,
            0,
            canvas.width * 0.5,
            canvas.height * 0.5,
            canvas.width * 0.7
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function animate() {
        time += 0.016;
        
        drawRadialBackground();
        drawGrid();
        drawBeamLight();
        drawParticles();
        drawVignette();
        
        requestAnimationFrame(animate);
    }
    
    animate();
}