/* ============================================ */
/* INTERSECTION OBSERVER - Scroll Reveal        */
/* ============================================ */
document.addEventListener('DOMContentLoaded', function() {

    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Opcional: dejar de observar una vez revelado
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ============================================ */
    /* HEADER SCROLL EFFECT                         */
    /* ============================================ */
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    /* ============================================ */
    /* MOBILE HAMBURGER MENU                        */
    /* ============================================ */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const headerNav = document.getElementById('headerNav');
    const navLinks = document.querySelectorAll('.header__nav-link');

    function toggleMenu() {
        const isOpen = hamburgerBtn.classList.toggle('header__hamburger--open');
        headerNav.classList.toggle('header__nav--open');
        hamburgerBtn.setAttribute('aria-expanded', isOpen);

        // Prevenir scroll del body cuando el menú está abierto
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
        hamburgerBtn.classList.remove('header__hamburger--open');
        headerNav.classList.remove('header__nav--open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburgerBtn.addEventListener('click', toggleMenu);

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function(e) {
        if (headerNav.classList.contains('header__nav--open') && 
            !headerNav.contains(e.target) && 
            !hamburgerBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Cerrar menú con la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && headerNav.classList.contains('header__nav--open')) {
            closeMenu();
        }
    });

    /* ============================================ */
    /* ACTIVE NAV LINK ON SCROLL                    */
    /* ============================================ */
    const sections = document.querySelectorAll('section[id]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    /* ============================================ */
    /* CONTACT FORM HANDLING                        */
    /* ============================================ */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Simulación de envío
            const submitBtn = contactForm.querySelector('.contacto__form-submit');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"></circle>
                </svg>
                Enviando...
            `;

            // Simular delay de envío
            setTimeout(() => {
                submitBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    ¡Mensaje enviado!
                `;
                submitBtn.style.background = '#25D366';

                // Reset después de 3 segundos
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    contactForm.reset();
                }, 3000);

                console.log('Formulario enviado:', data);
            }, 1500);
        });
    }

    /* ============================================ */
    /* SMOOTH SCROLL OFFSET FOR FIXED HEADER        */
    /* ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ============================================ */
    /* CARRUSEL PAUSE ON TOUCH/HOVER               */
    /* ============================================ */
    const clientesTrack = document.getElementById('clientesTrack');

    if (clientesTrack) {
        // Pausar al tocar en móvil
        clientesTrack.addEventListener('touchstart', function() {
            clientesTrack.style.animationPlayState = 'paused';
        });

        clientesTrack.addEventListener('touchend', function() {
            setTimeout(() => {
                clientesTrack.style.animationPlayState = 'running';
            }, 2000);
        });
    }

    /* ============================================ */
    /* HERO PARALLAX SUBTLE EFFECT                  */
    /* ============================================ */
    const heroShapes = document.querySelectorAll('.hero__shape');

    if (heroShapes.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            const heroSection = document.querySelector('.hero');
            const heroHeight = heroSection.offsetHeight;

            if (scrollY < heroHeight) {
                const parallaxFactor = scrollY * 0.15;
                heroShapes.forEach((shape, index) => {
                    const factor = (index + 1) * 0.05;
                    shape.style.transform = `translateY(${parallaxFactor * factor}px)`;
                });
            }
        });
    }

    /* ============================================ */
    /* CSS KEYFRAMES INJECTION FOR SPIN             */
    /* ============================================ */
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);

});
