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
    /* DARK MODE TOGGLE                             */
    /* ============================================ */
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeToggleMobile = document.getElementById('darkModeToggleMobile');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const darkModeIconMobile = document.getElementById('darkModeIconMobile');
    const darkModeLabelMobile = document.getElementById('darkModeLabelMobile');
    const body = document.body;

    // Textos del toggle
    const labelDark = 'Modo Oscuro';
    const labelLight = 'Modo Claro';
    const iconDark = '🌙';
    const iconLight = '☀️';

    // Cargar preferencia guardada o usar default (light/principal)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }

    function enableDarkMode() {
        body.setAttribute('data-theme', 'dark');
        if (darkModeIcon) darkModeIcon.textContent = iconLight;
        if (darkModeIconMobile) darkModeIconMobile.textContent = iconLight;
        if (darkModeLabelMobile) darkModeLabelMobile.textContent = labelLight;
        localStorage.setItem('theme', 'dark');
    }

    function disableDarkMode() {
        body.removeAttribute('data-theme');
        if (darkModeIcon) darkModeIcon.textContent = iconDark;
        if (darkModeIconMobile) darkModeIconMobile.textContent = iconDark;
        if (darkModeLabelMobile) darkModeLabelMobile.textContent = labelDark;
        localStorage.setItem('theme', 'light');
    }

    function toggleDarkMode() {
        const isDark = body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    if (darkModeToggleMobile) {
        darkModeToggleMobile.addEventListener('click', toggleDarkMode);
    }

    /* ============================================ */
    /* CONTACT FORM - FormSubmit & AJAX Integration */
    /* ============================================ */
    const contactForm = document.getElementById('contactForm');
    const modal = document.getElementById('successModal');
    const closeBtn = document.getElementById('closeModalBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Evitamos recarga de página

            const submitBtn = contactForm.querySelector('.contacto__form-submit');
            const originalText = submitBtn.innerHTML;

            // --- 1. VALIDACIÓN Y FORMATEO INTERNO DE DATOS ---
            const inputNombre = contactForm.querySelector('#nombre');
            const inputTelefono = contactForm.querySelector('#telefono');

            // Limpieza del Nombre
            let nombreLimpio = inputNombre.value.trim().replace(/\s+/g, ' ');
            nombreLimpio = nombreLimpio.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

            // Limpieza y Formateo del Celular de Colombia
            let telRaw = inputTelefono.value.replace(/\s+/g, '');

            // Validamos estrictamente que tenga 10 dígitos antes de proceder
            if (telRaw.length !== 10 || isNaN(telRaw)) {
                inputTelefono.focus();
                return; // Detiene el envío si no es un celular válido
            }

            // Aplicamos la máscara espaciada
            const telFormateado = `${telRaw.substring(0,3)} ${telRaw.substring(3,6)} ${telRaw.substring(6,8)} ${telRaw.substring(8,10)}`;

            // --- 2. EFECTO VISUAL DE "ENVIANDO..." ---
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"></circle>
                </svg>
                Enviando...
            `;

            // --- 3. REESTRUCTURAR LOS DATOS PARA FORMSUBMIT ---
            const finalFormData = new FormData();

            // Pasamos los valores ocultos fijos
            const captcha = contactForm.querySelector('input[name="_captcha"]');
            const template = contactForm.querySelector('input[name="_template"]');
            if (captcha) finalFormData.append('_captcha', captcha.value);
            if (template) finalFormData.append('_template', template.value);

            // Asunto dinámico automático
            const tipoConsulta = contactForm.querySelector('#asunto').value || "General";
            finalFormData.append('_subject', `Consulta Web: ${tipoConsulta}`);

            // INYECTAMOS LOS DATOS ULTRA ORGANIZADOS Y FORMATEADOS
            finalFormData.append('nombre', nombreLimpio);
            finalFormData.append('email', contactForm.querySelector('input[type="email"]').value);
            finalFormData.append('telefono', telFormateado);
            finalFormData.append('asunto', tipoConsulta);
            finalFormData.append('mensaje', contactForm.querySelector('textarea').value);

            // --- 4. ENVÍO INVISIBLE POR AJAX (FETCH) ---
            fetch(contactForm.action, {
                method: 'POST',
                body: finalFormData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                if (response.ok) {
                    if (modal) modal.classList.add('show');
                    contactForm.reset(); 
                } else {
                    alert('Hubo un problema al enviar el mensaje. Inténtalo de nuevo.');
                }
            })
            .catch(error => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                alert('Error de conexión. Inténtalo de nuevo más tarde.');
            });
        });
    }

    // Lógica para cerrar el Modal de éxito
    if (modal && closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('show');
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    /* ============================================ */
    /* MODALES LEGALES (Aviso, Términos, Ética)     */
    /* ============================================ */
    const legalModal = document.getElementById('legalModal');
    const legalModalClose = document.getElementById('legalModalClose');
    const legalModalTitle = document.getElementById('legalModalTitle');
    const legalModalBody = document.getElementById('legalModalBody');
    const legalTriggers = document.querySelectorAll('.legal-modal-trigger');

    const legalContent = {
        privacidad: {
            title: 'Aviso de Privacidad',
            body: `<p>De conformidad con la <strong>Ley 1581 de 2012</strong> y el <strong>Decreto 1377 de 2013</strong> de la República de Colombia (Protección de Datos Personales), le informamos que los datos capturados en el formulario de contacto (Nombre, Correo y Teléfono) serán tratados bajo estrictas medidas de seguridad y confidencialidad.</p>
            <p>La finalidad exclusiva de la recolección de estos datos es realizar la gestión de su consulta jurídica, agendar la asesoría inicial y enviar notificaciones del estado de su caso. En ningún escenario sus datos serán vendidos, compartidos o expuestos a terceras partes con fines comerciales.</p>
            <p>Como titular de la información, usted tiene derecho a conocer, actualizar, rectificar o solicitar la supresión de sus datos personales enviando una solicitud directa a nuestro correo: <strong>tusderechosalamano@gmail.com</strong>.</p>`
        },
        terminos: {
            title: 'Términos de Servicio',
            body: `<p>Bienvenido a <strong>Tus Derechos a la Mano</strong>. Al utilizar nuestro formulario web de contacto, usted acepta que la información suministrada es verídica y actual. El envío del formulario constituye una solicitud formal de contacto y no genera de forma automática una relación contractual de representación judicial o mandato de abogado-cliente.</p>
            <p>Nuestros servicios de respuesta y asesoría inicial están sujetos a la disponibilidad de nuestros asesores jurídicos. Nos reservamos el derecho de aceptar o declinar casos basados en criterios de viabilidad jurídica, competencia profesional y carga operativa.</p>`
        },
        etica: {
            title: 'Código de Ética',
            body: `<p>En <strong>Tus Derechos a la Mano</strong> nos regimos por el <strong>Estatuto del Abogado (Ley 1123 de 2007 de Colombia)</strong>, asumiendo los principios de honradez, lealtad, diligencia y secreto profesional en cada consulta recibida.</p>
            <p>Establecemos un compromiso de atención transparente basado en las siguientes pautas:</p>
            <ol>
                <li>Las consultas recibidas serán analizadas individualmente con absoluta objetividad jurídica.</li>
                <li>Nuestro horario de atención oficial es de <strong>Lunes a Viernes de 8:00 am a 5:00 pm</strong>. Las solicitudes que ingresen fuera de este horario o durante fines de semana se gestionarán con máxima prioridad al inicio de la siguiente jornada hábil.</li>
                <li>Se garantiza una respuesta inicial o confirmación de viabilidad en un plazo óptimo, asegurando que el ciudadano comprenda de manera clara y sin tecnicismos complejos las opciones reales para la protección de sus derechos esenciales.</li>
            </ol>`
        }
    };

    function openLegalModal(type) {
        const content = legalContent[type];
        if (!content || !legalModal || !legalModalTitle || !legalModalBody) return;

        legalModalTitle.textContent = content.title;
        legalModalBody.innerHTML = content.body;
        legalModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeLegalModal() {
        if (legalModal) {
            legalModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    legalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalType = this.getAttribute('data-modal');
            openLegalModal(modalType);
        });
    });

    if (legalModalClose) {
        legalModalClose.addEventListener('click', closeLegalModal);
    }

    if (legalModal) {
        legalModal.addEventListener('click', function(e) {
            if (e.target === legalModal) {
                closeLegalModal();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLegalModal();
        }
    });

    /* ============================================ */
    /* SMOOTH SCROLL OFFSET FOR FIXED HEADER        */
    /* ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // No interceptar los triggers de modales legales
            if (this.classList.contains('legal-modal-trigger')) return;

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

/* ============================================ */
/* NETWORK & PERFORMANCE OPTIMIZATION           */
/* ============================================ */
if (navigator.connection) {
    const santiagoData = navigator.connection.saveData; 
    const connectionType = navigator.connection.effectiveType; 

    if (santiagoData || connectionType === '2g' || connectionType === '3g') {
        console.log("Conexión lenta detectada. Desactivando animaciones para mejorar rendimiento.");
        document.body.classList.add('low-performance');
    }
}