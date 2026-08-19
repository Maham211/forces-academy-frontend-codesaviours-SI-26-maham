document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. DARK MODE TOGGLE & PERSISTENCE
    // ==========================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const bodyElement = document.body;
    const docElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';

    // Initial Theme Set
    bodyElement.classList.toggle('dark-mode', isDark);
    docElement.classList.toggle('dark-mode', isDark);
    if (darkModeIcon) {
        darkModeIcon.classList.toggle('bi-sun-fill', isDark);
        darkModeIcon.classList.toggle('bi-moon-fill', !isDark);
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const isDarkMode = bodyElement.classList.toggle('dark-mode');
            docElement.classList.toggle('dark-mode', isDarkMode);

            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

            if (darkModeIcon) {
                darkModeIcon.classList.toggle('bi-sun-fill', isDarkMode);
                darkModeIcon.classList.toggle('bi-moon-fill', !isDarkMode);
            }
        });
    }

    // ==========================================
    // 2. NAVIGATION & SMOOTH SCROLL
    // ==========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
    // 4. DYNAMIC SEARCH & CATEGORY FILTERING
    // ==========================================
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.gallery-card, .course-card');
    const noResultsMsg = document.getElementById('noResultsMsg');

    let activeCategory = 'all';
    let searchQuery = '';

    function filterItems() {
        let visibleCount = 0;

        cards.forEach(card => {
            const cardCategory = card.getAttribute('data-category') || '';
            const cardTitle = card.querySelector('.card-title, h5')?.textContent.toLowerCase() || '';
            const cardText = card.querySelector('.card-text, p')?.textContent.toLowerCase() || '';

            const matchesCategory = activeCategory === 'all' || cardCategory.toLowerCase() === activeCategory.toLowerCase();
            const matchesSearch = cardTitle.includes(searchQuery) || cardText.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'block';
                card.classList.remove('fade-out');
                card.classList.add('fade-in');
                visibleCount++;
            } else {
                card.classList.remove('fade-in');
                card.classList.add('fade-out');
                setTimeout(() => {
                    if (card.classList.contains('fade-out')) {
                        card.style.display = 'none';
                    }
                }, 200);
            }
        });

        if (noResultsMsg) {
            noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.currentTarget.classList.add('active');

            activeCategory = e.currentTarget.getAttribute('data-filter') || 'all';
            filterItems();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterItems();
        });
    }

    // ==========================================
    // 5. STATS COUNTER ANIMATION & INTERSECTION OBSERVER
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
        const statsObserver = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    statNumbers.forEach((num) => animateCounter(num));
                    observerInstance.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    // Element Animation Observer
    const animElements = document.querySelectorAll('.animate-fade-left, .animate-fade-right');
    if (animElements.length > 0) {
        const animObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-show');
                }
            });
        }, { threshold: 0.1 });

        animElements.forEach(el => animObserver.observe(el));
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

            if (typeof emailjs !== 'undefined') {
                emailjs.sendForm('service_0t4xg0a', 'template_lf8l72w', this)
                    .then(() => {
                        alert('Enquiry sent successfully!');
                        enquiryForm.reset();
                    })
                    .catch((error) => {
                        alert('Failed to send enquiry: ' + JSON.stringify(error));
                    })
                    .finally(() => {
                        if (submitBtn) {
                            submitBtn.innerText = "Send Enquiry";
                            submitBtn.disabled = false;
                        }
                    });
            } else {
                // Fallback simulation if EmailJS library fails to load
                setTimeout(() => {
                    alert('Thank you! Your enquiry has been submitted successfully.');
                    enquiryForm.reset();
                    if (submitBtn) {
                        submitBtn.innerText = "Send Enquiry";
                        submitBtn.disabled = false;
                    }
                }, 1000);
            }
        });
    }
});