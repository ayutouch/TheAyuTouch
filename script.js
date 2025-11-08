// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- Page Switching Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const logo = document.querySelector('.logo');
    const homeLearnMoreButton = document.getElementById('home-learn-more');
    
    // --- NEW: Hamburger Menu ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navList = document.querySelector('.nav-links'); // Get the <ul>
    const nav = document.querySelector('nav'); // Get the <nav>

    // Toggle menu on hamburger click
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            navList.classList.toggle('nav-open');
            nav.classList.toggle('menu-open');
        });
    }

    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active-link'));

        const targetPage = document.getElementById(pageId);
        if (targetPage) targetPage.classList.add('active');

        const targetLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
        if (targetLink) targetLink.classList.add('active-link');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const pageId = link.getAttribute('data-page');
            showPage(pageId);
            
            // --- NEW: Close menu on link click ---
            navList.classList.remove('nav-open');
            nav.classList.remove('menu-open');
        });
    });
    
    logo.addEventListener('click', (event) => {
        event.preventDefault();
        showPage('home');
    });

    if (homeLearnMoreButton) {
        homeLearnMoreButton.addEventListener('click', () => {
            showPage('about');
        });
    }

    // --- 💡 Dark Mode Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.innerHTML = '☀️';
        } else {
            body.classList.remove('dark-mode');
            themeToggle.innerHTML = '🌙';
        }
    }

    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            currentTheme = 'dark';
        } else {
            currentTheme = 'light';
        }
    }
    applyTheme(currentTheme);

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        let newTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // --- 💸 NEW: Price Display Logic ---
    const bookingSelect = document.getElementById('book-service');
    const priceDisplay = document.getElementById('price-notification');

    if (bookingSelect) {
        bookingSelect.addEventListener('change', () => {
            const selectedOption = bookingSelect.options[bookingSelect.selectedIndex];
            const price = selectedOption.getAttribute('data-price');
            if (price) {
                priceDisplay.textContent = 'Estimated Price: ' + price;
                priceDisplay.style.display = 'block';
            } else {
                priceDisplay.style.display = 'none'; 
            }
        });
    }
    // --- End of Price Display Logic ---

    
    // --- 🧠 NEW: 3D Mouse-Move Tilt Effect ---
    const tiltCards = document.querySelectorAll('.service-card, .portfolio-item, #booking .container, #contact .container');
    
    tiltCards.forEach(card => {
        const maxTilt = 15; 

        function handleMouseMove(e) {
            card.style.transition = 'transform 0.05s linear';
            const { width, height, left, top } = card.getBoundingClientRect();
            const x = e.clientX - left; 
            const y = e.clientY - top;  
            const xPct = (x / width) - 0.5;  
            const yPct = (y / height) - 0.5; 
            const rotateY = xPct * maxTilt;
            const rotateX = -1 * yPct * maxTilt;
            const scale = card.classList.contains('service-card') ? 'scale(1.05)' : 'scale(1.03)';
            card.style.transform = `perspective(1000px) ${scale} rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }

        card.addEventListener('mousemove', handleMouseMove);

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.4s ease-out';
            card.style.transform = 'perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)';
        });
        
        card.addEventListener('transitionend', () => {
            if (!card.matches(':hover')) {
                card.style.transition = '';
            }
        });
    });
    // --- End of 3D Tilt Effect ---

    // --- 📞 NEW: Contact Form to WhatsApp ---
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const yourWhatsAppNumber = '919448760729';
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;
            const fullMessage = `Hi! I'm ${name}.\n\nMy email is: ${email}\n\nMessage:\n${message}`;
            const encodedMessage = encodeURIComponent(fullMessage);
            const waURL = `https://wa.me/${yourWhatsAppNumber}?text=${encodedMessage}`;
            window.open(waURL, '_blank');
            contactForm.reset();
        });
    }
    // --- End of Contact Form Logic ---

    // --- 🚀 Form Submission Logic (Updated with Price & Phone) ---
    const bookingForm = document.getElementById('service-booking-form');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbydR4rJjydo04-wB4jV5tCPX8UvgI7XLhfao2H8PT_SakSYPrfqgLmXlczp-EmQy-le/exec'; 

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            var submitButton = bookingForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            var name = document.getElementById('book-name').value;
            var email = document.getElementById('book-email').value;
            var phone = document.getElementById('book-phone').value;
            var service = document.getElementById('book-service').value;
            var details = document.getElementById('book-message').value;
            var priceText = document.getElementById('price-notification').textContent;
            var price = priceText.replace('Estimated Price: ', '');

            var formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('service', service);
            formData.append('details', details);
            formData.append('price', price);

            fetch(scriptURL, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    alert('Booking successful! 🎉 Please check your email.');
                    bookingForm.reset();
                    document.getElementById('price-notification').style.display = 'none'; 
                } else {
                    alert('Error: ' + (data.message || 'Something went wrong.'));
                }
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('An error occurred. Please try again.');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Book Now';
            });
        });
    }

    // --- ⌨️ NEW: Typing Particle Effect ---
    const formInputs = document.querySelectorAll(
        '.form-group input, .form-group textarea'
    );
    let isTypingThrottled = false;
    const typingColors = [
        'var(--primary-color)',
        'var(--secondary-color)'
    ];

    function createTypingParticle(e) {
        if (isTypingThrottled) return;
        isTypingThrottled = true;
        setTimeout(() => {
            isTypingThrottled = false;
        }, 100);

        const rect = e.target.getBoundingClientRect();
        const spawnX = rect.left + window.scrollX + rect.width - 30;
        const spawnY = rect.top + window.scrollY + (rect.height / 2);

        for (let i = 0; i < 2; i++) {
            const particle = document.createElement('div');
            particle.classList.add('typing-particle');
            particle.style.left = spawnX + (Math.random() * 20 - 10) + 'px';
            particle.style.top = spawnY + (Math.random() * 10 - 5) + 'px';
            const color = typingColors[Math.floor(Math.random() * typingColors.length)];
            particle.style.backgroundColor = color;
            const destinationX = (Math.random() - 0.5) * 60;
            const destinationY = (Math.random() * -50) - 20;
            particle.style.setProperty('--x', destinationX + 'px');
            particle.style.setProperty('--y', destinationY + 'px');
            document.body.appendChild(particle);
            setTimeout(() => {
                particle.remove();
            }, 600);
        }
    }

    formInputs.forEach(input => {
        input.addEventListener('input', createTypingParticle);
    });
    // --- End of Typing Particle Effect ---

    // --- 💖 NEW: Mouse Sparkle Trail ---
    let isThrottled = false;
    const sparkleColors = [
        'var(--primary-color)',
        'var(--secondary-color)',
        '#FFFFFF'
    ];

    document.addEventListener('mousemove', (e) => {
        if (isThrottled) return;
        isThrottled = true;
        setTimeout(() => {
            isThrottled = false;
        }, 50);

        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        particle.style.backgroundColor = color;
        const size = Math.random() * 8 + 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        const destinationX = (Math.random() - 0.5) * 200;
        const destinationY = (Math.random() - 0.5) * 200;
        particle.style.setProperty('--x', destinationX + 'px');
        particle.style.setProperty('--y', destinationY + 'px');
        document.body.appendChild(particle);
        setTimeout(() => {
            particle.remove();
        }, 800);
    });
    // --- End of Mouse Sparkle Trail ---

});