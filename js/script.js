document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // 1. DARK MODE TOGGLE (DAY 1 SETUP)
    // ==========================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    const bodyElement = document.body;

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function () {
            bodyElement.classList.toggle('dark-mode');
        });
    }

    // ==========================================
    // 2. CONTACT FORM VALIDATION & HANDLING
    // ==========================================
    const form = document.getElementById('contactForm');
    const alertPlaceholder = document.getElementById('alertPlaceholder');

    function showAlert(message, type) {
        if (!alertPlaceholder) return;
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

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();

            let isValid = true;

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');

            const inputs = [name, email, phone, subject, message].filter(Boolean);

            // Basic empty field check
            inputs.forEach(input => {
                if (input.value.trim() === "") {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            });

            // Email check
            if (email && email.value.trim() !== "" && !isValidEmail(email.value.trim())) {
                email.classList.remove('is-valid');
                email.classList.add('is-invalid');
                const feedback = document.getElementById('emailFeedback');
                if (feedback) feedback.innerText = "Please provide a valid email structure (e.g. user@domain.com).";
                isValid = false;
            }

            // Phone check
            if (phone && phone.value.trim() !== "") {
                const numericPhone = phone.value.replace(/[^0-9]/g, '');
                if (numericPhone.length < 10 || numericPhone.length > 15) {
                    phone.classList.remove('is-valid');
                    phone.classList.add('is-invalid');
                    const feedback = document.getElementById('phoneFeedback');
                    if (feedback) feedback.innerText = "Please provide a valid phone number (10-15 digits).";
                    isValid = false;
                }
            }

            if (isValid) {
                showAlert("Your message has been validated and sent successfully!", "success");
                form.reset();
                inputs.forEach(input => input.classList.remove('is-valid'));
            } else {
                showAlert("Validation Failed! Please make sure all fields are correctly filled.", "danger");
            }
        });
    }

    // ==========================================
    // 3. GALLERY LIGHTBOX & CATEGORY FILTER
    // ==========================================
    if (typeof GLightbox !== 'undefined') {
        let lightbox = GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true,
            zoomable: true,
            draggable: true
        });

        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryCards = document.querySelectorAll('.gallery-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const selectedCategory = this.getAttribute('data-filter');

                galleryCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    const anchor = card.querySelector('a');

                    if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                        card.style.display = 'block';
                        if (anchor) anchor.classList.add('glightbox');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        if (anchor) anchor.classList.remove('glightbox');
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });

                setTimeout(() => {
                    lightbox.reload();
                }, 350);
            });
        });
    }

    // ==========================================
    // 4. STATS COUNTER ANIMATION (INTERSECTION OBSERVER)
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
    // 5. BACK TO TOP BUTTON
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

});