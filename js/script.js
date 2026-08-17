document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. DARK MODE TOGGLE & PERSISTENCE
    // ==========================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const bodyElement = document.body;

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        bodyElement.classList.add('dark-mode');
        document.documentElement.classList.add('dark-mode');
        if (darkModeIcon) {
            darkModeIcon.classList.remove('bi-moon-fill');
            darkModeIcon.classList.add('bi-sun-fill');
        }
    } else {
        bodyElement.classList.remove('dark-mode');
        document.documentElement.classList.remove('dark-mode');
        if (darkModeIcon) {
            darkModeIcon.classList.remove('bi-sun-fill');
            darkModeIcon.classList.add('bi-moon-fill');
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            bodyElement.classList.toggle('dark-mode');
            document.documentElement.classList.toggle('dark-mode');
            const isDarkMode = bodyElement.classList.contains('dark-mode');

            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

            if (darkModeIcon) {
                if (isDarkMode) {
                    darkModeIcon.classList.remove('bi-moon-fill');
                    darkModeIcon.classList.add('bi-sun-fill');
                } else {
                    darkModeIcon.classList.remove('bi-sun-fill');
                    darkModeIcon.classList.add('bi-moon-fill');
                }
            }
        });
    }

    // ==========================================
    // 2. MOBILE NAVIGATION TOGGLE & SMOOTH SCROLL
    // ==========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ==========================================
    // 3. CONTACT FORM VALIDATION
    // ==========================================
    const contactForm = document.getElementById('contactForm') || document.querySelector('#contact-form');
    const alertPlaceholder = document.getElementById('alertPlaceholder');

    function showAlert(message, type) {
        if (!alertPlaceholder) {
            alert(message);
            return;
        }
        alertPlaceholder.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show fw-bold" role="alert">
                <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    function isValidEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    if (contactForm) {
        const name = document.getElementById('name');
        const email = document.getElementById('email') || contactForm.querySelector('input[type="email"]');
        const phone = document.getElementById('phone');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message') || contactForm.querySelector('textarea');

        const inputs = [name, email, phone, subject, message].filter(Boolean);

        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    input.classList.remove('is-invalid');
                }
            });
        });

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            let isValid = true;

            inputs.forEach(input => {
                if (input.value.trim() === '') {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            });

            if (email && email.value.trim() !== '' && !isValidEmail(email.value.trim())) {
                email.classList.remove('is-valid');
                email.classList.add('is-invalid');
                isValid = false;
            }

            if (isValid) {
                showAlert('Aapka paigham kamyabi se bhej diya gaya hai!', 'success');
                contactForm.reset();
                inputs.forEach(input => input.classList.remove('is-valid'));
            } else {
                showAlert('Meharbani karke tamam fields sahi tarah se pur karein.', 'danger');
            }
        });
    }

    // ==========================================
    // 4. GALLERY FILTERING
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const selectedCategory = this.getAttribute('data-filter');

                galleryCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');

                    if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ==========================================
    // 5. STATS COUNTER ANIMATION
    // ==========================================
    const statsSection = document.getElementById('statsSection') || document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10) || 0;
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000;
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentCount = Math.round(target * (1 - Math.pow(1 - progress, 3)));

            element.textContent = currentCount + suffix;

            if (frame === totalFrames) {
                element.textContent = target + suffix;
                clearInterval(counter);
            }
        }, frameRate);
    };

    if (statsSection && statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    statNumbers.forEach((num) => animateCounter(num));
                    observerInstance.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    }

    // ==========================================
    // 6. BACK TO TOP BUTTON
    // ==========================================
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 7. EMAILJS INTEGRATION (ADMISSIONS ENQUIRY)
    // ==========================================
    const enquiryForm = document.getElementById('enquiry-form');
    const submitBtn = document.getElementById('submit-btn');

    if (typeof emailjs !== 'undefined') {
        emailjs.init("qhqrcrKHbzkDYLDPD");
    }

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function (event) {
            event.preventDefault();

            if (submitBtn) {
                submitBtn.innerText = "Sending...";
                submitBtn.disabled = true;
            }

            emailjs.sendForm('service_0t4xg0a', 'template_lf8l72w', this)
                .then(() => {
                    alert('Enquiry sent successfully!');
                    if (submitBtn) {
                        submitBtn.innerText = "Send Enquiry";
                        submitBtn.disabled = false;
                    }
                    enquiryForm.reset();
                }, (error) => {
                    alert('Failed to send enquiry: ' + JSON.stringify(error));
                    if (submitBtn) {
                        submitBtn.innerText = "Send Enquiry";
                        submitBtn.disabled = false;
                    }
                });
        });
    }
});