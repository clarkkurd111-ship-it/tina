// Modal canvas for starfield background
let modalCanvas = null;
let modalCtx = null;
let modalStars = [];
let modalAnimationId = null;

function createModalStarfield() {
    modalCanvas = document.getElementById('modalCanvas');
    if (!modalCanvas) return;

    modalCanvas.width = window.innerWidth;
    modalCanvas.height = window.innerHeight;
    modalCtx = modalCanvas.getContext('2d');

    // Create realistic starfield with many more stars
    modalStars = [];
    const starCount = 400;

    for (let i = 0; i < starCount; i++) {
        const depth = Math.random(); // 0 = far, 1 = close
        const size = Math.pow(depth, 2) * 2 + 0.3; // Exponential sizing for more realism

        // Realistic star colors - mostly white with slight variations
        let color;
        const rand = Math.random();
        if (rand > 0.95) {
            color = { r: 200, g: 220, b: 255 }; // Slight blue tint
        } else if (rand > 0.9) {
            color = { r: 255, g: 240, b: 220 }; // Slight warm tint
        } else {
            color = { r: 240, g: 245, b: 250 }; // Pure white-ish
        }

        modalStars.push({
            x: Math.random() * modalCanvas.width,
            y: Math.random() * modalCanvas.height,
            size: size,
            depth: depth,
            alpha: 0.4 + depth * 0.6,
            color: color,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.01 + Math.random() * 0.02
        });
    }
}

function animateModalStarfield() {
    if (!modalCtx || !imageGalleryOpen) return;

    // Clear with dark space background
    const gradient = modalCtx.createRadialGradient(
        modalCanvas.width / 2, modalCanvas.height / 2, 0,
        modalCanvas.width / 2, modalCanvas.height / 2, modalCanvas.width / 2
    );
    gradient.addColorStop(0, 'rgba(15, 10, 35, 0.4)');
    gradient.addColorStop(1, 'rgba(5, 5, 20, 0.6)');
    modalCtx.fillStyle = gradient;
    modalCtx.fillRect(0, 0, modalCanvas.width, modalCanvas.height);

    // Draw stars
    modalStars.forEach(star => {
        // Subtle twinkle
        star.twinkle += star.twinkleSpeed;
        const twinkleAlpha = star.alpha * (0.85 + Math.sin(star.twinkle) * 0.15);

        // Draw star - smaller stars are just points, larger ones have minimal glow
        if (star.size < 0.8) {
            // Tiny distant stars - simple points
            modalCtx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${twinkleAlpha})`;
            modalCtx.fillRect(star.x, star.y, star.size, star.size);
        } else {
            // Larger stars with subtle glow
            const glowSize = star.size * 1.5;
            const gradient = modalCtx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowSize);
            gradient.addColorStop(0, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${twinkleAlpha})`);
            gradient.addColorStop(0.6, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${twinkleAlpha * 0.4})`);
            gradient.addColorStop(1, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, 0)`);

            modalCtx.fillStyle = gradient;
            modalCtx.beginPath();
            modalCtx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
            modalCtx.fill();
        }
    });

    modalAnimationId = requestAnimationFrame(animateModalStarfield);
}

function startModalStarfield() {
    createModalStarfield();
    animateModalStarfield();
}

function stopModalStarfield() {
    if (modalAnimationId) {
        cancelAnimationFrame(modalAnimationId);
        modalAnimationId = null;
    }
}
let images = [];
let currentImageIndex = 0;
let imageGalleryOpen = false;

// Load images from folder
function loadImages() {
    images = [
        { src: 'img_1096.mp4', alt: 'Video', type: 'video' },
        { src: 'photo_1_2026-02-09_16-08-41.jpg', alt: 'Photo 1' },
        { src: 'photo_3_2026-02-09_16-08-41.jpg', alt: 'Photo 3' },
        { src: 'photo_4_2026-02-09_16-08-41.jpg', alt: 'Photo 4' },
        { src: 'photo_5_2026-02-09_16-08-41.jpg', alt: 'Photo 5' },
        { src: 'photo_6_2026-02-09_16-08-41.jpg', alt: 'Photo 6' },
        { src: 'photo_7_2026-02-09_16-08-41.jpg', alt: 'Photo 7' },
        { src: 'photo_8_2026-02-09_16-08-41.jpg', alt: 'Photo 8' },
        { src: 'photo_9_2026-02-09_16-08-41.jpg', alt: 'Photo 9' },
        { src: 'photo_10_2026-02-09_16-08-41.jpg', alt: 'Photo 10' },
        { src: 'photo_11_2026-02-09_16-08-41.jpg', alt: 'Photo 11' },
        { src: 'photo_12_2026-02-09_16-08-41.jpg', alt: 'Photo 12' },
        { src: 'photo_13_2026-02-09_16-08-41.jpg', alt: 'Photo 13' },
        { src: 'photo_14_2026-02-09_16-08-41.jpg', alt: 'Photo 14' },
        { src: 'photo_15_2026-02-09_16-08-41.jpg', alt: 'Photo 15' },
        { src: 'photo_16_2026-02-09_16-08-41.jpg', alt: 'Photo 16' },
        { src: 'photo_17_2026-02-09_16-08-41.jpg', alt: 'Photo 17' }
    ];
}

// Open image modal
function openImageGallery() {
    if (images.length === 0) {
        return;
    }

    const modal = document.getElementById('imageModal');
    if (!modal) {
        return;
    }

    modal.classList.add('show');
    imageGalleryOpen = true;
    currentImageIndex = 0;
    showImage(currentImageIndex);
    startAutoSlideshow();
    startModalStarfield(); // Start starfield animation
}

// Show specific image
function showImage(index) {
    if (images.length === 0) return;

    const img = document.getElementById('modalImage');
    const video = document.getElementById('modalVideo');
    const counter = document.getElementById('imageCounter');

    if (!img || !video || !counter) {
        return;
    }

    const item = images[index];
    counter.textContent = `${index + 1} / ${images.length}`;

    if (item.type === 'video') {
        img.style.display = 'none';
        video.style.display = 'block';
        video.classList.remove('image-transition');
        void video.offsetWidth;
        video.src = item.src;
        video.load();
        video.currentTime = 0;
        video.play().catch(() => {
            // Autoplay may be blocked until user interaction.
        });
        video.classList.add('image-transition');
    } else {
        video.pause();
        video.removeAttribute('src');
        video.load();
        video.style.display = 'none';
        img.style.display = 'block';
        img.classList.remove('image-transition');
        void img.offsetWidth;
        img.src = item.src;
        img.alt = item.alt;
        img.classList.add('image-transition');
    }
}

// Navigate to next image
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showImage(currentImageIndex);
}

// Navigate to previous image
function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    showImage(currentImageIndex);
}

// Auto slideshow
let slideshowInterval = null;
function startAutoSlideshow() {
    if (slideshowInterval) clearInterval(slideshowInterval);
    slideshowInterval = setInterval(() => {
        if (imageGalleryOpen) {
            nextImage();
        } else {
            clearInterval(slideshowInterval);
        }
    }, 5000); // Change image every 5 seconds
}

// Close modal
function closeImageGallery() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');
    imageGalleryOpen = false;
    stopModalStarfield(); // Stop starfield animation
    if (slideshowInterval) clearInterval(slideshowInterval);
}

loadImages();
const canvas = document.getElementById('galaxyCanvas');
if (!canvas) {
    console.error('Canvas element not found!');
}

if (canvas) {
    console.log('Canvas element found:', canvas);
}

// Detect mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// Background stars (parallax depth)
let backgroundStars = [];

function resetBackgroundStars() {
    backgroundStars = [];
    const starCount = isMobile ? 200 : 400;

    for (let i = 0; i < starCount; i++) {
        const depth = Math.random();
        const size = Math.pow(depth, 2) * 2 + 0.3;

        // Realistic star colors
        let color;
        const rand = Math.random();
        if (rand > 0.95) {
            color = 'rgba(200, 220, 255,'; // Slight blue tint
        } else if (rand > 0.9) {
            color = 'rgba(255, 240, 220,'; // Slight warm tint
        } else {
            color = 'rgba(240, 245, 250,'; // Pure white-ish
        }

        backgroundStars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: size,
            alpha: 0.4 + depth * 0.6,
            depth: depth,
            color: color,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.01 + Math.random() * 0.02
        });
    }
}

// Set canvas size with mobile optimization BEFORE getting context
function resizeCanvas() {
    if (!canvas) return;
    // Use document.documentElement for more reliable sizing
    canvas.width = document.documentElement.clientWidth || window.innerWidth;
    canvas.height = document.documentElement.clientHeight || window.innerHeight;
    console.log(`Canvas resized to: ${canvas.width} x ${canvas.height}`);
    if (backgroundStars) {
        resetBackgroundStars();
    }
}

// Initialize canvas size FIRST
resizeCanvas();

// NOW get the context
const ctx = canvas.getContext('2d');
if (!ctx) {
    console.error('Failed to get canvas context!');
} else {
    console.log('Canvas context created successfully');
    // Draw initial dark background  
    ctx.fillStyle = 'rgba(10, 13, 46, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Listen for resize events
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 100);
});

// Galaxy configuration
const galaxy = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 0,
    vy: 0,
    friction: 0.95,
    targetX: canvas.width / 2,
    targetY: canvas.height / 2
};

// Background singing audio
const bgAudio = document.getElementById('bgAudio');
let bgAudioAlt = null;
let audioStarted = false;
let usingAlt = false;
let crossfadeTimer = null;
let crossfadeInProgress = false;
const TARGET_VOLUME = 0.6;
const FADE_MS = 900;
const CHECK_INTERVAL_MS = 200;

function setupSeamlessLoop() {
    if (!bgAudio || bgAudioAlt) {
        return;
    }

    bgAudioAlt = bgAudio.cloneNode(true);
    bgAudioAlt.id = 'bgAudioAlt';
    bgAudioAlt.volume = 0;
    bgAudioAlt.loop = false;
    bgAudioAlt.preload = 'auto';
    document.body.appendChild(bgAudioAlt);
}

function crossfadeTo(nextAudio, currentAudio) {
    if (crossfadeInProgress) {
        return;
    }

    crossfadeInProgress = true;
    nextAudio.currentTime = 0;
    nextAudio.volume = 0;

    const playPromise = nextAudio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
            crossfadeInProgress = false;
        });
    }

    const steps = 20;
    const stepTime = FADE_MS / steps;
    let step = 0;
    const fadeInterval = setInterval(() => {
        step += 1;
        const t = step / steps;
        nextAudio.volume = TARGET_VOLUME * t;
        currentAudio.volume = TARGET_VOLUME * (1 - t);

        if (step >= steps) {
            clearInterval(fadeInterval);
            currentAudio.pause();
            currentAudio.currentTime = 0;
            crossfadeInProgress = false;
            usingAlt = !usingAlt;
        }
    }, stepTime);
}

function startBackgroundAudio() {
    if (!bgAudio || audioStarted) {
        return;
    }

    setupSeamlessLoop();
    bgAudio.loop = false;
    bgAudio.volume = TARGET_VOLUME;

    const playPromise = bgAudio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
            // Autoplay may be blocked until another user interaction.
        });
    }

    crossfadeTimer = setInterval(() => {
        const currentAudio = usingAlt ? bgAudioAlt : bgAudio;
        const nextAudio = usingAlt ? bgAudio : bgAudioAlt;
        if (!currentAudio || !nextAudio || crossfadeInProgress) {
            return;
        }

        if (currentAudio.duration && currentAudio.currentTime >= currentAudio.duration - (FADE_MS / 1000)) {
            crossfadeTo(nextAudio, currentAudio);
        }
    }, CHECK_INTERVAL_MS);

    audioStarted = true;
}

// Particle system for realistic orbital stars
class Star {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.random() * 200 + 50;
        this.size = Math.random() * 1.5 + 0.4;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.twinkleSpeed = Math.random() * 0.03 + 0.01;
        this.twinkle = 0;

        // Realistic star colors
        const rand = Math.random();
        if (rand > 0.95) {
            this.color = 'rgba(200, 220, 255,'; // Blue tint
        } else if (rand > 0.9) {
            this.color = 'rgba(255, 240, 220,'; // Warm tint
        } else {
            this.color = 'rgba(240, 245, 250,'; // White-ish
        }
    }

    update(galaxyX, galaxyY) {
        // Circular motion around galaxy center
        this.angle += 0.001;
        this.x = galaxyX + Math.cos(this.angle) * this.distance;
        this.y = galaxyY + Math.sin(this.angle) * this.distance;

        // Subtle twinkling effect
        this.twinkle += this.twinkleSpeed;
        this.opacity = Math.abs(Math.sin(this.twinkle)) * 0.4 + 0.3;
    }

    draw(ctx) {
        ctx.fillStyle = `${this.color}${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Minimal glow for larger stars
        if (this.size > 0.8) {
            ctx.fillStyle = `${this.color}${this.opacity * 0.2})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Create orbit stars
const stars = [];
function createStars() {
    // Fewer stars on mobile for better performance
    const starCount = isMobile ? 60 : 100;
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star(galaxy.x, galaxy.y));
    }
}
createStars();

// Background nebula particles
class Nebula {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 100 + 50;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.color = ['rgba(199, 55, 143,', 'rgba(255, 107, 166,', 'rgba(123, 104, 238,'][
            Math.floor(Math.random() * 3)
        ];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw(ctx) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, this.color + this.opacity + ')');
        gradient.addColorStop(1, this.color + '0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const nebulas = [];
for (let i = 0; i < (isMobile ? 4 : 8); i++) {
    nebulas.push(new Nebula());
}

// Spiral dust stars for a more realistic galaxy
let galaxyDust = [];
let galaxySpin = 0;

function createGalaxyDust() {
    galaxyDust = [];
    const dustCount = isMobile ? 600 : 1200;
    for (let i = 0; i < dustCount; i++) {
        const r = Math.pow(Math.random(), 0.65);
        const arm = Math.random() < 0.5 ? 0 : 1;
        const baseAngle = r * Math.PI * 4 + arm * Math.PI;
        const scatter = (Math.random() - 0.5) * 0.6;

        galaxyDust.push({
            r,
            baseAngle: baseAngle + scatter,
            size: 0.5 + Math.random() * 1.2,
            alpha: 0.12 + Math.random() * 0.35
        });
    }
}

function drawGalaxyDust(x, y) {
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.45;
    galaxyDust.forEach((dust) => {
        const angle = dust.baseAngle + galaxySpin;
        const dist = dust.r * maxRadius;
        const px = x + Math.cos(angle) * dist;
        const py = y + Math.sin(angle) * dist;
        ctx.fillStyle = `rgba(255, 210, 235, ${dust.alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, dust.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

createGalaxyDust();

// Galaxy core glow
function drawGalaxyCore(x, y) {
    // Central bright core
    const coreGradient = ctx.createRadialGradient(x, y, 0, x, y, 150);
    coreGradient.addColorStop(0, 'rgba(255, 150, 220, 0.8)');
    coreGradient.addColorStop(0.5, 'rgba(199, 55, 143, 0.3)');
    coreGradient.addColorStop(1, 'rgba(123, 104, 238, 0)');

    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(x, y, 150, 0, Math.PI * 2);
    ctx.fill();

    // Bright center
    ctx.fillStyle = 'rgba(255, 200, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
}

// Mouse tracking
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

document.addEventListener('touchmove', (e) => {
    if (e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        // Prevent default scrolling on touch
        if (Math.abs(e.touches[0].clientX - galaxy.x) < 300 || Math.abs(e.touches[0].clientY - galaxy.y) < 300) {
            e.preventDefault();
        }
    }
}, { passive: false });

// Setup modal controls when DOM is ready
function setupModalControls() {
    console.log('Setting up modal controls...');
    const closeBtn = document.querySelector('.close');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const modal = document.getElementById('imageModal');

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeImageGallery();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextImage();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevImage();
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'imageModal') {
                closeImageGallery();
            }
        });
    }
}

// Setup immediately
setupModalControls();

// Add button click handler
const galleryBtn = document.getElementById('galleryBtn');
if (galleryBtn) {
    galleryBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startBackgroundAudio();
        openImageGallery();
    });
}

// Keyboard navigation for gallery
document.addEventListener('keydown', (e) => {
    if (!imageGalleryOpen) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextImage();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevImage();
    } else if (e.key === 'Escape') {
        closeImageGallery();
    }
});

// Animation loop
function animate() {
    // Clear canvas with dark semi-transparent overlay for trail effect
    if (!ctx) {
        console.error('Context is null in animate!');
        requestAnimationFrame(animate);
        return;
    }
    ctx.fillStyle = 'rgba(10, 13, 46, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background stars with parallax and twinkling
    if (backgroundStars && backgroundStars.length > 0) {
        const parallaxX = (mouseX - canvas.width / 2) * 0.02;
        const parallaxY = (mouseY - canvas.height / 2) * 0.02;
        backgroundStars.forEach((star) => {
            // Update twinkle
            star.twinkle += star.twinkleSpeed;
            const twinkleAlpha = star.alpha * (0.85 + Math.sin(star.twinkle) * 0.15);

            const x = star.x + parallaxX * star.depth;
            const y = star.y + parallaxY * star.depth;

            if (star.size < 0.8) {
                // Tiny distant stars - simple points
                ctx.fillStyle = `${star.color}${twinkleAlpha})`;
                ctx.fillRect(x, y, star.size, star.size);
            } else {
                // Larger stars with subtle glow
                const glowSize = star.size * 1.5;
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
                gradient.addColorStop(0, `${star.color}${twinkleAlpha})`);
                gradient.addColorStop(0.6, `${star.color}${twinkleAlpha * 0.4})`);
                gradient.addColorStop(1, `${star.color}0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, glowSize, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    // Update and draw nebulas
    if (nebulas && nebulas.length > 0) {
        nebulas.forEach(nebula => {
            if (nebula && nebula.update && nebula.draw) {
                nebula.update();
                nebula.draw(ctx);
            }
        });
    }

    // Subtle galaxy spin
    galaxySpin += 0.0005;

    // Apply physics to galaxy (spring + damping)
    const dx = galaxy.targetX - galaxy.x;
    const dy = galaxy.targetY - galaxy.y;
    const spring = 0.009;
    const damping = 0.92;
    const maxSpeed = 10;

    galaxy.vx = (galaxy.vx + dx * spring) * damping;
    galaxy.vy = (galaxy.vy + dy * spring) * damping;

    const speed = Math.hypot(galaxy.vx, galaxy.vy);
    if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        galaxy.vx *= scale;
        galaxy.vy *= scale;
    }

    galaxy.x += galaxy.vx;
    galaxy.y += galaxy.vy;

    // Keep galaxy within bounds with elasticity
    const minDist = 150;
    const maxDistX = canvas.width - minDist;
    const maxDistY = canvas.height - minDist;

    if (galaxy.x < minDist) {
        galaxy.x = minDist;
        galaxy.vx *= -0.5;
    }
    if (galaxy.x > maxDistX) {
        galaxy.x = maxDistX;
        galaxy.vx *= -0.5;
    }
    if (galaxy.y < minDist) {
        galaxy.y = minDist;
        galaxy.vy *= -0.5;
    }
    if (galaxy.y > maxDistY) {
        galaxy.y = maxDistY;
        galaxy.vy *= -0.5;
    }

    // Draw galaxy core
    if (galaxy && galaxy.x && galaxy.y) {
        drawGalaxyDust(galaxy.x, galaxy.y);
        drawGalaxyCore(galaxy.x, galaxy.y);
    }

    // Update and draw stars
    if (stars && stars.length > 0) {
        stars.forEach(star => {
            if (star && star.update && star.draw) {
                star.update(galaxy.x, galaxy.y);
                star.draw(ctx);
            }
        });
    }

    // Draw spiral arms
    drawSpiralArms();

    requestAnimationFrame(animate);
}

// Draw spiral galaxy arms
function drawSpiralArms() {
    for (let arm = 0; arm < 2; arm++) {
        ctx.strokeStyle = `rgba(255, 170, 210, 0.18)`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();

        // Fewer points on mobile for better performance
        const pointCount = isMobile ? 50 : 100;
        for (let i = 0; i < pointCount; i++) {
            const angle = (i / pointCount) * Math.PI * 4 + (arm * Math.PI);
            const distance = i * 2.5;
            const x = galaxy.x + Math.cos(angle) * distance;
            const y = galaxy.y + Math.sin(angle) * distance;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
}

// Start animation
animate();

// Smooth scroll behavior for info boxes
const contentOverlay = document.querySelector('.content-overlay');
if (contentOverlay) {
    contentOverlay.style.maxHeight = '90vh';
    contentOverlay.style.overflowY = 'auto';
    contentOverlay.style.scrollBehavior = 'smooth';
}
