/* ============================================ */
/* INTERSECTION OBSERVER - Scroll Reveal        */
/* ============================================ */
document.addEventListener('DOMContentLoaded', function() {

    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    // Optimizador para Celulares: Si es pantalla chica, activa todo de golpe
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    });

    // Solo observa si NO es celular
    if (!isMobile) {
        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    /* ============================================ */
    /* INTERSECTION OBSERVER - Tarjetas de Servicio */
    /* ============================================ */
    const serviceCards = document.querySelectorAll('.servicio-card');

    // Optimizador para Celulares
    if (isMobile) {
        serviceCards.forEach(card => card.classList.add('active'));
    }

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.3
    });

    // Solo observa si NO es celular
    if (!isMobile) {
        serviceCards.forEach(card => {
            cardObserver.observe(card);
        });
    }

    /* ============================================ */
    /* NAVBAR REVEAL (Aquí continúa el resto de tu código igual...) */
    /* ============================================ */
    /* ============================================ */
    /* NAVBAR REVEAL (Oculto en Hero, visible al scroll) */
    /* ============================================ */
    const header = document.getElementById('header');
    const heroSection = document.querySelector('.hero');
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;

        // Mostrar navbar cuando el scroll supera el 80% del hero
        if (scrollY > heroHeight * 0.8) {
            header.classList.add('header--visible');
        } else {
            header.classList.remove('header--visible');
        }

        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
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
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
        hamburgerBtn.classList.remove('header__hamburger--open');
        headerNav.classList.remove('header__nav--open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburgerBtn.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function(e) {
        if (headerNav.classList.contains('header__nav--open') && 
            !headerNav.contains(e.target) && 
            !hamburgerBtn.contains(e.target)) {
            closeMenu();
        }
    });

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
    /* THEME SELECTOR SYSTEM (9 TEMAS)              */
    /* ============================================ */
    const themeBtns = document.querySelectorAll('.theme-btn');
    const body = document.body;

    // Cargar tema guardado o usar default
    const savedTheme = localStorage.getItem('theme') || 'principal';
    setTheme(savedTheme);

    function setTheme(themeName) {
        body.setAttribute('data-theme', themeName);

        themeBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-theme') === themeName) {
                btn.classList.add('active');
            }
        });

        localStorage.setItem('theme', themeName);
    }

    themeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
        });
    });

    /* ============================================ */
    /* CONTACT FORM - FormSubmit Integration        */
    /* ============================================ */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = contactForm.querySelector('.contacto__form-submit');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"></circle>
                </svg>
                Enviando...
            `;

            setTimeout(() => {
                if (submitBtn.disabled) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }, 10000);
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
    /* HERO PARALLAX SUBTLE EFFECT                  */
    /* ============================================ */
    const heroShapes = document.querySelectorAll('.hero__shape');

    if (heroShapes.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
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

// Detectar si el usuario tiene internet lento o ahorro de datos activo
if (navigator.connection) {
    const santiagoData = navigator.connection.saveData; // ¿Ahorro de datos activo?
    const connectionType = navigator.connection.effectiveType; // '2g', '3g', '4g'

    if (santiagoData || connectionType === '2g' || connectionType === '3g') {
        console.log("Conexión lenta detectada. Desactivando animaciones para mejorar rendimiento.");
        
        // Añade una clase al body para apagar efectos pesados en CSS
        document.body.classList.add('low-performance');
    }
}