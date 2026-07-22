document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Interactive Particle Canvas Background
    const canvas = document.getElementById("bg-canvas");
    const ctx = canvas.getContext("2d");

    let particlesArray = [];
    const numberOfParticles = 65;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = "rgba(0, 240, 255, 0.5)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.strokeStyle = `rgba(0, 240, 255, ${1 - distance / 120})`;
                    ctx.lineWidth = 0.4;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // 2. Typewriter Effect
    const typewriterElement = document.getElementById("typewriter");
    const roles = [
        "Full Stack Web Engineer.",
        "Computer Science Specialist.",
        "UI/UX Interface Designer.",
        "SEO & GSC Architect."
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(typeEffect, typeSpeed);
    }
    typeEffect();

    // 3. Scroll Reveal Animations
    const reveals = document.querySelectorAll(".scroll-reveal");

    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.85;
        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            if (revealTop < triggerBottom) {
                reveal.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll(); // Trigger initial check

    // 4. Counter Animation for Metrics
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    function startCounters() {
        const metricsSection = document.getElementById('cpm');
        const sectionPos = metricsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight;

        if (sectionPos < screenPos && !hasCounted) {
            hasCounted = true;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                let count = 0;
                const speed = target / 50;

                const updateCount = () => {
                    count += speed;
                    if (count < target) {
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 30);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
        }
    }
    window.addEventListener('scroll', startCounters);

    // 5. Contact Form Submission Handling
    const contactForm = document.getElementById("cyber-contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("TRANSMISSION RECEIVED: Vivian will contact you shortly.");
            contactForm.reset();
        });
    }
});
const contactForm = document.getElementById('cyber-contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        const formData = new FormData(contactForm);

        // UI Loading state
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting...';
        btn.disabled = true;

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success feedback
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Packet Delivered!';
                btn.style.background = '#00ff88';
                btn.style.color = '#000';
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Transmission Error';
            btn.style.background = '#ff4444';
            btn.style.color = '#fff';
        }

        // Reset button state after 4 seconds
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
        }, 4000);
    });
}