document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // THEME TOGGLER (DARK / LIGHT MODE)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Load theme from localStorage or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Dynamic feedback for the theme toggle transition
        themeToggleBtn.style.transform = 'scale(0.85) rotate(15deg)';
        setTimeout(() => {
            themeToggleBtn.style.transform = 'none';
        }, 150);
    });

    // ==========================================
    // RESPONSIVE MOBILE MENU
    // ==========================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinksContainer.classList.remove('open');
        });
    });

    // ==========================================
    // STICKY HEADER & SCROLL EFFECTS
    // ==========================================
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    
    const navObserverOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the middle view
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // ==========================================
    // PORTFOLIO PROJECTS CATEGORY FILTERING
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Add filter transition effect
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9) translateY(10px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.classList.remove('hide');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.classList.add('hide');
                    }
                }, 300);
            });
        });
    });

    // ==========================================
    // INTERACTIVE SCROLL ENTRANCE REVEAL
    // ==========================================
    // Add scroll reveal styles in script to keep HTML/CSS clean
    const style = document.createElement('style');
    style.innerHTML = `
        .reveal-item {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .reveal-item.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    const revealItems = document.querySelectorAll('.skill-category-card, .exp-node-right, .project-card, .edu-card, .cert-card, .contact-info-panel, .contact-form-panel');
    
    revealItems.forEach(item => {
        item.classList.add('reveal-item');
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // ==========================================
    // CONTACT FORM INTERACTIVE SUBMISSION
    // ==========================================
    const contactForm = document.getElementById('portfolio-contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = contactForm.querySelector('.btn-submit');
    const submitBtnText = submitBtn.querySelector('span');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Visual feedback during "sending"
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.8';
        submitBtnText.textContent = 'Sending Message...';
        formFeedback.className = 'form-feedback';
        formFeedback.textContent = '';

        // Simulate form processing (since there is no active backend, we mock success)
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtnText.textContent = 'Send Message';
            
            // Format success message
            formFeedback.classList.add('success');
            formFeedback.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline; vertical-align:middle; margin-right:5px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Thank you, ${contactForm.name.value}! Your message has been sent successfully.
            `;
            
            // Clear inputs
            contactForm.reset();
            
            // Clear message after 5 seconds
            setTimeout(() => {
                formFeedback.style.opacity = '0';
                setTimeout(() => {
                    formFeedback.innerHTML = '';
                    formFeedback.style.opacity = '1';
                    formFeedback.className = 'form-feedback';
                }, 300);
            }, 5000);
        }, 1500);
    });
});
