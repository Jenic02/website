/* ============================================
   NEXUSSTUDIO — JavaScript
   Animations, Interactions, UX
   ============================================ */

(function () {
    'use strict';

    /* ============================================
       PAGE LOADER
       - Waits for all page resources to load
       - Adds .loading class to body (prevents scroll)
       - After 1.4s, fades out loader and triggers hero animations
       ============================================ */
    // --- Loader ---
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        document.body.classList.add('loading');
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
            initHeroAnimations();
        }, 1400);
    });

    /* ============================================
       CUSTOM CURSOR (Glow Effect)
       - Tracks mouse position globally
       - Follower uses lerp (linear interpolation) for smooth trailing
       - 0.25 interpolation factor = fast, responsive follow
       - Hover class adds larger glow on interactive elements
       ============================================ */
    // --- Custom Cursor ---
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateCursor() {
        followerX += (mouseX - followerX) * 0.25;
        followerY += (mouseY - followerY) * 0.25;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .service-card, .project-card').forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
        el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
    });

    /* ============================================
       HEADER SCROLL BEHAVIOR
       - Adds .scrolled class when page is scrolled > 50px
         (triggers backdrop blur + border)
       - Shows/hides back-to-top button after 600px
       ============================================ */
    // --- Header Scroll ---
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        header.classList.toggle('scrolled', scrollY > 50);
        backToTop.classList.toggle('visible', scrollY > 600);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ============================================
       MOBILE NAVIGATION
       - Burger button toggles full-screen nav overlay
       - Locks body scroll when menu is open
       - Closing menu on link click for smooth UX
       ============================================ */
    // --- Mobile Nav ---
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');

    burger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        burger.classList.toggle('active');
        burger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    /* ============================================
       ACTIVE NAV LINK HIGHLIGHTING
       - Uses scroll position to determine which section is in view
       - Highlights the matching nav link
       - Uses offset of 200px for better UX (triggers slightly before section top)
       ============================================ */
    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinkElements = document.querySelectorAll('.nav__link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinkElements.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    /* ============================================
       SCROLL REVEAL ANIMATIONS
       - IntersectionObserver watches .reveal-up/left/right elements
       - When element enters viewport (15% visible), adds .revealed class
       - data-delay attribute staggers animations on grouped elements
       - Elements are unobserved after reveal (one-time animation)
       ============================================ */
    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, parseInt(delay));
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ============================================
       COUNTER ANIMATION
       - Numbers count up from 0 to target value
       - Triggers when stat section is 50% visible
       - Uses requestAnimationFrame for smooth 60fps animation
       - Duration: 2 seconds
       ============================================ */
    // --- Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat__number[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        function update() {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }
        update();
    }

    /* ============================================
       HERO ENTRANCE ANIMATIONS
       - After loader disappears, hero elements animate in sequentially
       - Each element delayed by 150ms for cascading effect
       ============================================ */
    // --- Hero Animations ---
    function initHeroAnimations() {
        const heroReveal = document.querySelectorAll('.hero .reveal-up');
        heroReveal.forEach((el, i) => {
            setTimeout(() => el.classList.add('revealed'), 200 + i * 150);
        });
    }

    /* ============================================
       PARTICLE CANVAS SYSTEM
       - Creates 60 floating particles on a canvas element
       - Each particle: random position, size, speed, opacity
       - Particles bounce off canvas edges
       - Lines drawn between nearby particles (< 150px apart)
       - Line opacity fades based on distance
       - Creates a connected constellation/network effect
       ============================================ */
    // --- Particle Canvas ---
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 60;

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(129, 140, 248, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(129, 140, 248, ${0.06 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawLines();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    /* ============================================
       TESTIMONIALS SLIDER
       - Creates dot navigation dynamically from card count
       - goToSlide(): translates track by -100% per index
       - Auto-advances every 5 seconds
       - Pauses auto-advance on hover
       - Touch swipe support (50px threshold)
       ============================================ */
    // --- Testimonials Slider ---
    const track = document.querySelector('.testimonials__track');
    const cards = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('testimonialDots');
    const prevBtn = document.querySelector('.testimonials__btn--prev');
    const nextBtn = document.querySelector('.testimonials__btn--next');
    let currentSlide = 0;

    if (track && cards.length) {
        // Create dots
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Utisak ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        function goToSlide(index) {
            currentSlide = index;
            track.style.transform = `translateX(-${index * 100}%)`;
            dotsContainer.querySelectorAll('button').forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });
        }

        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide === 0 ? cards.length - 1 : currentSlide - 1);
        });

        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
        });

        // Auto-slide
        let autoSlide = setInterval(() => {
            goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
        }, 5000);

        const sliderEl = document.querySelector('.testimonials__slider');
        sliderEl.addEventListener('mouseenter', () => clearInterval(autoSlide));
        sliderEl.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
            }, 5000);
        });

        // Touch support
        let touchStartX = 0;
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
                } else {
                    goToSlide(currentSlide === 0 ? cards.length - 1 : currentSlide - 1);
                }
            }
        }, { passive: true });
    }

    /* ============================================
       CONTACT FORM
       - Client-side validation for name, email, message
       - Email validated with regex pattern
       - Error messages shown below each field
       - Real-time error clearing on input
       - Simulated 2s send delay with loading spinner
       - Success message auto-hides after 5 seconds
       ============================================ */
    // --- Contact Form ---
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            // Reset errors
            form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
            form.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));

            // Validate name
            const name = form.querySelector('#name');
            if (!name.value.trim()) {
                name.classList.add('error');
                name.nextElementSibling.textContent = 'Molimo unesite vaše ime.';
                valid = false;
            }

            // Validate email
            const email = form.querySelector('#email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim()) {
                email.classList.add('error');
                email.nextElementSibling.textContent = 'Molimo unesite email adresu.';
                valid = false;
            } else if (!emailRegex.test(email.value)) {
                email.classList.add('error');
                email.nextElementSibling.textContent = 'Molimo unesite validnu email adresu.';
                valid = false;
            }

            // Validate message
            const message = form.querySelector('#message');
            if (!message.value.trim()) {
                message.classList.add('error');
                message.nextElementSibling.textContent = 'Molimo unesite poruku.';
                valid = false;
            }

            if (valid) {
                submitBtn.classList.add('loading');

                // Simulate sending
                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                    form.reset();
                    formSuccess.hidden = false;
                    formSuccess.style.animation = 'none';
                    formSuccess.offsetHeight; // reflow
                    formSuccess.style.animation = 'fadeUp 0.5s ease forwards';

                    setTimeout(() => {
                        formSuccess.hidden = true;
                    }, 5000);
                }, 2000);
            }
        });

        // Real-time validation clear
        form.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error');
                const errorEl = input.nextElementSibling;
                if (errorEl && errorEl.classList.contains('form-error')) {
                    errorEl.textContent = '';
                }
            });
        });
    }

    /* ============================================
       MAGNETIC BUTTON EFFECT
       - Primary buttons follow cursor slightly when hovered
       - Offset calculated from cursor position relative to button center
       - 0.15 multiplier = subtle magnetic pull
       - Resets transform on mouse leave
       ============================================ */
    // --- Magnetic Button Effect ---
    document.querySelectorAll('.btn--primary, .nav__cta').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    /* ============================================
       SMOOTH SCROLL
       - Intercepts all anchor link clicks (#href)
       - Calculates target position with 80px offset for fixed header
       - Uses native smooth scrolling
       ============================================ */
    // --- Smooth Scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ============================================
       3D TILT EFFECT ON SERVICE CARDS
       - Cards tilt toward mouse position on hover
       - Uses CSS perspective(600px) for 3D depth
       - RotateX/Y calculated from cursor position within card
       - Max tilt: 8 degrees
       - Resets on mouse leave
       ============================================ */
    // --- Tilt effect on service cards ---
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateX = (0.5 - y) * 8;
            const rotateY = (x - 0.5) * 8;
            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ============================================
       PARALLAX EFFECT
       - Hero gradient orbs move at different speeds on scroll
       - Each orb has increasing speed (0.08, 0.16, 0.24)
       - Creates depth illusion as user scrolls
       ============================================ */
    // --- Parallax on hero orbs ---
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const orbs = document.querySelectorAll('.hero__gradient-orb');
        orbs.forEach((orb, i) => {
            const speed = (i + 1) * 0.08;
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }, { passive: true });



    /* ============================================
       CROSS-BROWSER & MOBILE OPTIMIZATIONS
       ============================================ */

    /* --- Detect touch device --- */
    const isTouchDevice = ('ontouchstart' in window) ||
                          (navigator.maxTouchPoints > 0) ||
                          (navigator.msMaxTouchPoints > 0);

    /* --- Detect reduced motion preference --- */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotionOld = window.matchMedia('(prefers-reduced-motion: no-preference)');

    if (prefersReducedMotion.matches) {
        // Skip particle animation for performance
        if (canvas) {
            canvas.style.display = 'none';
        }
    }

    /* --- Disable cursor glow on touch devices --- */
    if (isTouchDevice) {
        if (cursor) cursor.style.display = 'none';
        if (follower) follower.style.display = 'none';
    }

    /* --- Handle orientation change --- */
    /* Reload layout calculations after device rotates */
    let resizeTimeout;
    window.addEventListener('orientationchange', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalculate particle canvas size
            if (canvas) {
                resizeCanvas();
            }
            // Force reflow for proper layout
            document.body.offsetHeight;
        }, 300);
    });

    /* --- Handle viewport resize (address bar show/hide on mobile) --- */
    /* Uses VisualViewport API when available for accurate mobile viewport */
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
            // Set CSS custom property for actual viewport height
            // This fixes 100vh issue on mobile browsers
            document.documentElement.style.setProperty(
                '--vh',
                window.visualViewport.height * 0.01 + 'px'
            );
        });
    } else {
        // Fallback for older browsers
        const setVH = () => {
            document.documentElement.style.setProperty(
                '--vh',
                window.innerHeight * 0.01 + 'px'
            );
        };
        setVH();
        window.addEventListener('resize', setVH);
    }

    /* --- IntersectionObserver polyfill check --- */
    /* If browser doesn't support IntersectionObserver, reveal all elements immediately */
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
            el.classList.add('revealed');
        });
        document.querySelectorAll('.stat__number[data-count]').forEach(el => {
            el.textContent = el.getAttribute('data-count');
        });
    }

    /* --- requestAnimationFrame polyfill --- */
    /* Ensures rAF works in older browsers (IE10+) */
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function() {
            return window.webkitRequestAnimationFrame ||
                   window.mozRequestAnimationFrame ||
                   function(callback) { return setTimeout(callback, 1000 / 60); };
        })();
    }

    /* --- Passive event listeners for scroll/touch performance --- */
    /* Already using { passive: true } on scroll events above,
       this adds it to touch events for better scrolling performance */

    /* --- Handle iOS Safari address bar changes --- */
    /* Sets --vh CSS variable for true viewport height */
    function setMobileViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', vh + 'px');
    }
    setMobileViewportHeight();
    window.addEventListener('resize', debounce(setMobileViewportHeight, 200));

    /* --- Debounce utility for resize handlers --- */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    /* --- Preload critical resources hint --- */
    /* Tells browser to preload images that will likely be needed */
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            // After page is idle, preload any off-screen images
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        });
    }

    /* --- Handle page visibility changes --- */
    /* Pause animations when tab is not visible for performance */
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden - pause auto-slide
            if (autoSlide) clearInterval(autoSlide);
        } else {
            // Page is visible - resume auto-slide
            if (track && cards.length) {
                autoSlide = setInterval(() => {
                    goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
                }, 5000);
            }
        }
    });

    /* --- Prevent zoom on double-tap on iOS --- */
    /* Only on interactive elements, not on general content */
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            const target = e.target;
            if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' &&
                target.tagName !== 'SELECT' && !target.closest('a') &&
                !target.closest('button')) {
                e.preventDefault();
            }
        }
        lastTouchEnd = now;
    }, false);

    /* --- Handle Samsung Internet pull-to-refresh --- */
    /* Prevent accidental pull-to-refresh during normal scrolling */
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    /* --- Console message for developers --- */
    console.log(
      '%c NexusStudio %c Built with HTML5, CSS3 & JavaScript ',
      'background: #6366f1; color: #fff; padding: 4px 8px; border-radius: 4px 0 0 4px; font-weight: bold;',
      'background: #18181b; color: #a1a1aa; padding: 4px 8px; border-radius: 0 4px 4px 0;'
    );

    /* ============================================
       DYNAMIC KEYFRAME INJECTION
       - fadeUp animation used by form success message
       - Injected via JS to keep animation logic centralized
       ============================================ */
    // --- Add fadeUp animation keyframe dynamically ---
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

})();
